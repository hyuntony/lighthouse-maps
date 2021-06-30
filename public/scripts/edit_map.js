const loadMarkers = (map, data) => {
  if (data[0].coords) {
    const group = L.layerGroup().addTo(map);
    data.forEach(point => {
      const lat = Number(point.coords.lat);
      const lng = Number(point.coords.lng);
      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(`<b>${point.name}</b><br>${point.description}`);
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

      loadMarkers(mymap, dataObj);
      mymap.removeLayer(layer);


      mymap.on('click', () => {
        loadMarkers(mymap, dataObj);
      });

    });


});
