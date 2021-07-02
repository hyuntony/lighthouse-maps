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
        <button class="btn-sm btn-success" id="add-button" type="submit">Add map point</button>
        <button class="btn-sm btn-danger" id="cancel-button-${id}">Cancel</button>
      </div>
    </form>
      `);
  return editForm;
};

const loadMarkers = (map, data, group) => {
  if (data[0].coords) {
    data.forEach(point => {
      const lat = Number(point.coords.lat);
      const lng = Number(point.coords.lng);
      const marker = L.marker([lat, lng]).addTo(map).addTo(group);
      marker.bindPopup(`
        <div class="loaded-markers">
          <form id="point-update">
            <input type="hidden" name="point_id" value="${point.id}">
            <label for="name">Title:</label>
            <input type="text" name="name" value="${point.name}"><br>
            <label for="description">Description:</label>
            <textarea class="text-area" type="text" name="description">${point.description}</textarea>
            <button class="update-button btn-sm btn-success" type="submit">Update</button>
          </form>
          <form id="point-remove">
            <input type="hidden" name="point_id" value="${point.id}">
            <button class="remove-button btn-sm btn-danger" type="submit">Remove</button>
          </form>
        </div>
      `);
    });
  }
};

$(() => {

  $.get(`/api/maps/${mapID}/points`)
    .then(data => {
      const dataObj = data.maps;
      const {lat, lng} = dataObj[0] ? dataObj[0].center_coords : {lat:0,lng:0};
      const zoom = dataObj[0].zoom;
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


      loadMarkers(mymap, dataObj, groupOne);

      // update name and description of map_points
      $('body').on("submit", "#point-update", function(e) {
        e.preventDefault();
        const data = $(this).serialize();
        $.post("/map/point/update", data)
          .then(data => {
            console.log(data);
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

      // remove map_point
      $(`body`).on("submit", "#point-remove", function(e) {
        e.preventDefault();
        const data = $(this).serialize();
        $.post("/map/point/delete", data)
          .then(data => {
            console.log(data);
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

      mymap.on('click', onMapClick);

      //finish Edit sends the current center-coords and zoom levels
      $('body').on('submit', '#edit-final', function(e) {
        e.preventDefault();

        const centerCoords = mymap.getCenter();
        const zoom = mymap.getZoom();
        const { lat, lng } = centerCoords;
        const mapData = { lat, lng, zoom};
        const url = new URLSearchParams(mapData).toString();
        const data = $(this).serialize() + '&' + url;

        $.post(`/map/edit/update`, data)
          .then(data => {
            window.location.href = data;
          });
      });

    });
});
