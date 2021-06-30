




$(() => {



  $.ajax({
    method: "GET",
    url: `/api/maps/${mapID}/points`
  }).done((points) => {
    console.log(`!!!!!!!!!`, points);
    const dataObj = points.maps;
    const {lat, lng} = dataObj[0] ? dataObj[0].center_coords : {lat:0,lng:0};
    const zoom = dataObj[0].zoom;
    const mymap = L.map('mymap').setView([lat, lng],zoom)

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic3Vkb2ZlciIsImEiOiJja3FkeWFhcmMwYWxhMnBtbHlvODhib3ZqIn0.3SgagUt_Y6_pJCpgzEopZg'
    }).addTo(mymap);






    console.log(points.maps[0].center_coords);
    mymap.setView([Number(points.maps[0].center_coords.lat), Number(points.maps[0].center_coords.lng)], 13);
    // console.log(users);
    // const usersParse = JSON.parse(users);
    if (points.maps[0].coords) {
      points.maps.forEach(elem => {
        console.log(`***********`,elem);
        const lat = Number(elem.coords.lat);
        const lng = Number(elem.coords.lng);
        const marker = L.marker([lat, lng]).addTo(mymap);
        marker.bindPopup(`<b>${elem.name}</b><br>${elem.description}`);
      })

    }

    })

  $('#favorite').click(function (e) {
    e.preventDefault();
    const mapID = $( "#sample" ).val();
    console.log(mapID);
    $.ajax({
      method: 'POST',
      url: '/api/favorites',
      data: { mapID }
    }).done( favorites => {
      console.log(favorites);
    }
  )

  });
})
