// Dynamically build edit form
const createEditForm = (lat, lng, id) => {
  const editForm = (`
    <form id="myform-${id}">
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
      <button id="add-button" type="submit">Add map point</button>
      </form>
      <button id="cancel-button-${id}">Cancel</button>
      `);
  return editForm;
};
// Dynamically add markers to map
const loadMarkers = (map, data, group) => {
  if (data[0].coords) {
    data.forEach(point => {
      const lat = Number(point.coords.lat);
      const lng = Number(point.coords.lng);
      const marker = L.marker([lat, lng]).addTo(map).addTo(group);
      // Each marker has an edit form
      marker.bindPopup(`
        <form id="point-update">
          <input type="hidden" name="point_id" value="${point.id}">
          <label for="name">Title:</label>
          <input type="text" name="name" value="${point.name}"><br>
          <label for="description">Description:</label>
          <input type="text" name="description" value="${point.description}">
          <button type="submit">Update</button>
        </form>
        <form id="point-remove">
          <input type="hidden" name="point_id" value="${point.id}">
          <button type="submit">Remove</button>
        </form>
      `);
    });
  }
};

$(() => {
  // AJAX fetch for map's original points
  $.get(`/api/maps/${mapID}/points`)
    .then(data => {
      const dataObj = data.maps;
      const {lat, lng} = dataObj[0] ? dataObj[0].center_coords : {lat:0,lng:0};
      const zoom = dataObj[0].zoom;
      // Declare a leaflet map instance with our data
      const mymap = L.map('mymap').setView([lat, lng],zoom);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic3Vkb2ZlciIsImEiOiJja3FkeWFhcmMwYWxhMnBtbHlvODhib3ZqIn0.3SgagUt_Y6_pJCpgzEopZg'
      }).addTo(mymap);
      const groupOne = L.layerGroup().addTo(mymap);

      // Call to finally render markers onto map
      loadMarkers(mymap, dataObj, groupOne);

      // Update name and description of map_points
      $('body').on("submit", "#point-update", function(e) {
        e.preventDefault();
        const data = $(this).serialize();
        $.post("/map/point/update", data)
          .then(() => {
            setTimeout(() => {
              groupOne.clearLayers(),
              $.get(`/api/maps/${mapID}/points`)
                .then(data => {
                  const changedData = data.maps;
                  loadMarkers(mymap, changedData, groupOne);
                });
            }, 200);
          });
      });

      // Remove map_point
      $(`body`).on("submit", "#point-remove", function(e) {
        e.preventDefault();
        const data = $(this).serialize();
        $.post("/map/point/delete", data)
          .then(() => {
            setTimeout(() => {
              groupOne.clearLayers(),
              $.get(`/api/maps/${mapID}/points`)
                .then(data => {
                  const changedData = data.maps;
                  loadMarkers(mymap, changedData, groupOne);
                });
            }, 200);
          });
      });

      // create new marker with click on map
      const onMapClick = function(e) {
        let marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
        const markerid = L.stamp(marker);
        const editForm = createEditForm(e.latlng.lat, e.latlng.lng, markerid);
        // Add edit form to new popup
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
              marker.addTo(groupOne),
              setTimeout(() => {
                groupOne.clearLayers(),
                $.get(`/api/maps/${mapID}/points`)
                  .then(data => {
                    const changedData = data.maps;
                    loadMarkers(mymap, changedData, groupOne);
                  });
              }, 200)
            );
        });
      };
      //On click, run the add marker function
      mymap.on('click', onMapClick);

      // update map title
      $(`body`).on('submit', '#title-update', function(e) {
        e.preventDefault();
        const data = $(this).serialize();
        $.post(`/map/title`, data)
          .then(
            alert("Title Updated!")
          );
      });

      // update map description
      $(`body`).on('submit', '#description-update', function(e) {
        e.preventDefault();
        const data = $(this).serialize();
        $.post(`/map/description`, data)
          .then(
            alert("Description Updated!")
          );
      });

      //finish Edit sends the current center-coords and zoom levels
      $('#edit-final').click((e) => {
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
