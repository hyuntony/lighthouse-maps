
const createEditForm = (lat, lng) => {
  const editForm = (`
    <form id="myform">
      <label for="maps_id">map_id:</label>
      <input type="text" name="maps_id" value="${mapID}" disabled="disabled" readonly>
      <label for="lat">Lat:</label>
      <input type="text" name="lat" value="${lat}" readonly>
      <label for="lng">Lng:</label>
      <input type="text" name="lng" value="${lng}" readonly><br><br>
      <label for="name">Title:</label>
      <input type="text" name="name">
      <label for="description">Description:</label>
      <input type="text" name="description">
      <button id="cancel-button">Cancel</button>
      <button id="add-button" type="submit">Add map point</button>
      </form>
      `);
  return editForm;
};

$(() => {
  $.get(`/api/maps/${mapID}`)
    .then((data) => {
      const mapobj = data.map[0];
      const { lat, lng } = mapobj.center_coords;
      //const $pointForm = $('#point-form');


      const mymap = L.map('mymap').setView([lat, lng], mapobj.zoom);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic3Vkb2ZlciIsImEiOiJja3FkeWFhcmMwYWxhMnBtbHlvODhib3ZqIn0.3SgagUt_Y6_pJCpgzEopZg'
      }).addTo(mymap);
      // const groupOne = L.layerGroup().addTo(mymap);

      const onMapClick = function(e) {
        // console.log(e);
        const editForm = createEditForm(e.latlng.lat, e.latlng.lng);
        let marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
        // marker.id = L.stamp(marker);
        // console.log(marker.id);
        // console.log(L.stamp(marker));
        // mymap.on('click', () => {
        //   mymap.removeLayer(marker);
        // });
        marker.bindPopup(`${editForm}`).openPopup();
        $('#cancel-button').click((e) => {
          e.preventDefault();
          // if (marker.id === 40) {
          mymap.removeLayer(marker);
          // }
        });
        $('#myform').submit(function(e) {
          e.preventDefault();
          const data = $(this).serialize();
          $.post(`/map/new/${mapID}/points`, data)
            .then(
              // marker.addTo(groupOne),
              $('#cancel-button').hide(),
              $('#add-button').hide(),
              marker.closePopup(),
              marker.unbindPopup(),
            );
        });
      };
      mymap.on('click', onMapClick);
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

// map.removeLayer(marker)
