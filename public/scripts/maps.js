/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(()=> {
  // hide elements that need to be hidden

  const loadMaps = () => {
    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/maps'
    })
    .done((res)=> {
      renderMaps(res)

    })
    .fail((err) => console.log(`fail to get`, err))
  }
              // async call for tweets
  loadMaps();
              // generate html articles from tweets
  const createMapElement = map => {
              // sanitize user input
              // input like ${escape(map.thumbnail_url)}
    const escape = function (str) {
      let div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };

    const template =
    `<div class='mapArticle'>
      <div class = 'myMap'> </div>
      <div class = myMapDetails
    </div>`

    return template;
  }

  const renderMaps = arrayOfMaps => {
            //clear current generated articles to prevent duplicates
    $('#mapContainer').empty()
             // make use of our tweets and html template by rendering an article for each tweet
    arrayOfMaps.forEach(map => {
      const $map = createMapElement(map);
      $('#mapContainer').prepend($map);
    })
  }

})
