/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(()=> {


  const loadMaps = () => {
    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/maps'
    })
      .done((res)=> {
        renderMaps(res);
      })
      .fail((err) => console.log(`fail to get`, err));
  };
  // async call for maps
  loadMaps();
  // generate html articles from tweets
  const createMapElement = map => {
    // sanitize user input
    // input like ${escape(map.thumbnail_url)}

    const template =
    `<div class='mapArticle'>
      <div class = 'myMap'> </div>
      <div class = myMapDetails
    </div>`;

    return template;
  };

  const renderMaps = arrayOfMaps => {
            //clear current generated articles to prevent duplicates
    $('#mapContainer').empty();
    arrayOfMaps.forEach(map => {
      const $map = createMapElement(map);
      $('#mapContainer').prepend($map);
    });
  };

});
