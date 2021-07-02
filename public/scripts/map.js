$(() => {
  $('#blackIcon').hide();
  $("#goldIcon").hide();
  // AJAX fetch for user's favorite information, render appropriate icon accoringly
  const checkFavorites = () => {
    const userid = userID;
    $.get(`/api/favorites/${userid}/${mapID}`)
      .then(data => {
        if (data.length > 0) {
          $("#goldIcon").show();
          $('#blackIcon').hide();
        } else {
          $('#blackIcon').show();
          $("#goldIcon").hide();
        }
      });
  };
  checkFavorites();
  // Get map points and load them to map
  $.ajax({
    method: "GET",
    url: `/api/maps/${mapID}/points`
  }).done((points) => {
    const dataObj = points.maps;
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

    // const usersParse = JSON.parse(users);
    if (points.maps[0].coords) {
      points.maps.forEach(elem => {
        const lat = Number(elem.coords.lat);
        const lng = Number(elem.coords.lng);
        const marker = L.marker([lat, lng]).addTo(mymap);
        marker.bindPopup(`<b>${elem.name}</b><br>${elem.description}`);
      });
    }
  });
  // Favorite map
  $('#blackIcon').click(function(e) {
    e.preventDefault();
    const mapID = $("#favorite").val();
    $.ajax({
      method: 'POST',
      url: '/api/favorites',
      data: { mapID }
    }).then(() => {
      setTimeout(() => {
        checkFavorites();
      }, 100);
    });
  });
  // Unfavorite map
  $('#goldIcon').click(function(e) {
    e.preventDefault();
    const mapID = $("#favorite").val();
    $.ajax({
      method: 'POST',
      url: '/api/favorites/delete',
      data: { mapID }
    }).done(() => {
      setTimeout(() => {
        checkFavorites();
      }, 100);
    }
    );
  });
});
