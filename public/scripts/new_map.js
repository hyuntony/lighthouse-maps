// Build map as requested by user
const createEditForm = (lat, lng, id) => {
  const editForm = (`
    <form class="edit-form" id="myform-${id}">
      <input type="hidden" name="maps_id" value="${mapID}">
      <input type="hidden" name="lat" value="${lat}">
      <input type="hidden" name="lng" value="${lng}">
      <div>
        <label for="name">Title:</label>
        <input type="text" name="name">
      </div>
      <label for="description">Description:</label>
      <textarea class="description-box" type="text" name="description"></textarea>
      <div class="button-div">
        <button class="btn btn-success" id="add-button" type="submit">Add map point</button>
        <button class="btn btn-danger" id="cancel-button-${id}">Cancel</button>
      </div>
    </form>
      `);
  return editForm;
};

// AJAX fetch the newly created map
$(() => {
  $.get(`/api/maps/${mapID}`)
    .then((data) => {
      const mapobj = data.map[0];
      const { lat, lng } = mapobj.center_coords;
      const mymap = L.map('mymap').setView([lat, lng], mapobj.zoom);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic3Vkb2ZlciIsImEiOiJja3FkeWFhcmMwYWxhMnBtbHlvODhib3ZqIn0.3SgagUt_Y6_pJCpgzEopZg'
      }).addTo(mymap);
      // On click create a marker and append a form to it
      const onMapClick = function(e) {
        let marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
        const markerid = L.stamp(marker);
        const editForm = createEditForm(e.latlng.lat, e.latlng.lng, markerid);
        // Append edit form to new marker
        marker.bindPopup(`${editForm}`).openPopup();
        $('body').on('click', `#cancel-button-${markerid}`, (e) => {
          e.preventDefault();
          mymap.removeLayer(marker);
        });
        $(`body`).on('submit', `#myform-${markerid}`, function(e) {
          e.preventDefault();
          const data = $(this).serialize();
          $.post(`/map/new/${mapID}/points`, data)
            .then(
              $('#cancel-button').hide(),
              $('#add-button').hide(),
              marker.closePopup(),
              marker.unbindPopup(),
            );
        });
      };

      mymap.on('click', onMapClick);
      // Post new data
      $('#finish-button').click((e) => {
        e.preventDefault();
        const centerCoords = mymap.getCenter();
        const zoom = mymap.getZoom();
        const { lat, lng } = centerCoords;
        const data = { mapID, lat, lng, zoom};
        $.post(`/map/new/${mapID}/update`, data)
          .then(data => {
            window.location.href = data;
          });
      });
    });
});

