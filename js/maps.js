var distanceUnit = 'km';
var marker1, marker2;
var poly, geodesicPoly;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 38.08, lng: -99.42}
  });

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      document.getElementById('info'));

  marker1 = new google.maps.Marker({
    map: map,
    draggable: true,
    position: {lat: 32.78, lng: -117.19}
  });

  marker2 = new google.maps.Marker({
    map: map,
    draggable: true,
    position: {lat: 40.714, lng: -74.006}
  });

  var bounds = new google.maps.LatLngBounds(
      marker1.getPosition(), marker2.getPosition());
  map.fitBounds(bounds);

  google.maps.event.addListener(marker1, 'position_changed', update);
  google.maps.event.addListener(marker2, 'position_changed', update);

  poly = new google.maps.Polyline({
    strokeColor: '#800000',
    strokeOpacity: 1.0,
    strokeWeight: 3,
    map: map,
  });

  geodesicPoly = new google.maps.Polyline({
    strokeColor: '#CC0099',
    strokeOpacity: 1.0,
    strokeWeight: 3,
    geodesic: true,
    map: map
  });

  update();

  var inputSource = document.getElementById('originSearch');
  var inputDestination = document.getElementById('destinationSearch');
  var autocompleteSource = new google.maps.places.Autocomplete(inputSource);
  var autocompleteDestination = new google.maps.places.Autocomplete(inputDestination);

  autocompleteSource.addListener('place_changed', function() {
    var place = autocompleteSource.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(4); 
    }
    marker1.setPosition(place.geometry.location);
    document.getElementById('originSearch').value = '';

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
  });


  autocompleteDestination.addListener('place_changed', function() {
    var place = autocompleteDestination.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(4); 
    }
    marker2.setPosition(place.geometry.location);
    document.getElementById('destinationSearch').value = '';

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
  });



}

function update() {
  var path = [marker1.getPosition(), marker2.getPosition()];
  poly.setPath(path);
  geodesicPoly.setPath(path);
  var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
  document.getElementById('origin').innerText = getCoordsForDisplay(path[0]);
  document.getElementById('destination').innerText = getCoordsForDisplay(path[1]);
  document.getElementById('heading').innerText = heading;
  document.getElementById('distance').innerText = getDistance(marker1.getPosition(), marker2.getPosition());
}

//Haversine Formula to calculate distance between two pairs of co-ordinates

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  // console.log("Point1 --" + p1.lat() + "---" + p1.lng());
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  if(distanceUnit == 'km'){
    return Math.round(d/1000);
  }else{
    return Math.round(d/1000 * 0.621371);
  }
};


function roundToTwoDecimal(num) {    
  return +(Math.round(num + "e+2")  + "e-2");
}


function getCoordsForDisplay(coords){
  var lat = roundToTwoDecimal(coords.lat());
  var long = roundToTwoDecimal(coords.lng());
  return "[" + lat + ", " + long + "]";
}


function setDUnit(){  
  if(document.getElementById('km').checked){
    distanceUnit = 'km';
  }else{
     distanceUnit = 'miles';
  }
  document.getElementById("dunitSpan").innerHTML = distanceUnit;
  update();
}



function drag_start(event) 
{
  var style = window.getComputedStyle(event.target, null);
  var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY)+ ',' + event.target.id;
  event.dataTransfer.setData("Text",str);
} 

function drop(event) 
{
  var offset = event.dataTransfer.getData("Text").split(',');
  var dm = document.getElementById(offset[2]);
  dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
  dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
  event.preventDefault();
  return false;
}

function drag_over(event)
{
  event.preventDefault();
  return false;
}










// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Place Autocomplete</title>
//     <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
//     <meta charset="utf-8">
//     <style>
//       /* Always set the map height explicitly to define the size of the div
//        * element that contains the map. */
//       #map {
//         height: 100%;
//       }
//       /* Optional: Makes the sample page fill the window. */
//       html, body {
//         height: 100%;
//         margin: 0;
//         padding: 0;
//       }
//       #description {
//         font-family: Roboto;
//         font-size: 15px;
//         font-weight: 300;
//       }

//       #infowindow-content .title {
//         font-weight: bold;
//       }

//       #infowindow-content {
//         display: none;
//       }

//       #map #infowindow-content {
//         display: inline;
//       }

//       .pac-card {
//         margin: 10px 10px 0 0;
//         border-radius: 2px 0 0 2px;
//         box-sizing: border-box;
//         -moz-box-sizing: border-box;
//         outline: none;
//         box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
//         background-color: #fff;
//         font-family: Roboto;
//       }

//       #pac-container {
//         padding-bottom: 12px;
//         margin-right: 12px;
//       }

//       .pac-controls {
//         display: inline-block;
//         padding: 5px 11px;
//       }

//       .pac-controls label {
//         font-family: Roboto;
//         font-size: 13px;
//         font-weight: 300;
//       }

//       #pac-input {
//         background-color: #fff;
//         font-family: Roboto;
//         font-size: 15px;
//         font-weight: 300;
//         margin-left: 12px;
//         padding: 0 11px 0 13px;
//         text-overflow: ellipsis;
//         width: 400px;
//       }

//       #pac-input:focus {
//         border-color: #4d90fe;
//       }

//       #title {
//         color: #fff;
//         background-color: #4d90fe;
//         font-size: 25px;
//         font-weight: 500;
//         padding: 6px 12px;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="pac-card" id="pac-card">
//       <div>
//         <div id="title">
//           Autocomplete search
//         </div>
//         <div id="type-selector" class="pac-controls">
//           <input type="radio" name="type" id="changetype-all" checked="checked">
//           <label for="changetype-all">All</label>

//           <input type="radio" name="type" id="changetype-establishment">
//           <label for="changetype-establishment">Establishments</label>

//           <input type="radio" name="type" id="changetype-address">
//           <label for="changetype-address">Addresses</label>

//           <input type="radio" name="type" id="changetype-geocode">
//           <label for="changetype-geocode">Geocodes</label>
//         </div>
//         <div id="strict-bounds-selector" class="pac-controls">
//           <input type="checkbox" id="use-strict-bounds" value="">
//           <label for="use-strict-bounds">Strict Bounds</label>
//         </div>
//       </div>
//       <div id="pac-container">
//         <input id="pac-input" type="text"
//             placeholder="Enter a location">
//       </div>
//     </div>
//     <div id="map"></div>
//     <div id="infowindow-content">
//       <img src="" width="16" height="16" id="place-icon">
//       <span id="place-name"  class="title"></span><br>
//       <span id="place-address"></span>
//     </div>

//     <script>
//       // This example requires the Places library. Include the libraries=places
//       // parameter when you first load the API. For example:
//       // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

//       function initMap() {
//         var map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: -33.8688, lng: 151.2195},
//           zoom: 13
//         });
//         var card = document.getElementById('pac-card');
//         var input = document.getElementById('pac-input');
//         var types = document.getElementById('type-selector');
//         var strictBounds = document.getElementById('strict-bounds-selector');

//         map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

//         var autocomplete = new google.maps.places.Autocomplete(input);

//         // Bind the map's bounds (viewport) property to the autocomplete object,
//         // so that the autocomplete requests use the current map bounds for the
//         // bounds option in the request.
//         autocomplete.bindTo('bounds', map);

//         var infowindow = new google.maps.InfoWindow();
//         var infowindowContent = document.getElementById('infowindow-content');
//         infowindow.setContent(infowindowContent);
//         var marker = new google.maps.Marker({
//           map: map,
//           anchorPoint: new google.maps.Point(0, -29)
//         });

//         autocomplete.addListener('place_changed', function() {
//           infowindow.close();
//           marker.setVisible(false);
//           var place = autocomplete.getPlace();
//           if (!place.geometry) {
//             // User entered the name of a Place that was not suggested and
//             // pressed the Enter key, or the Place Details request failed.
//             window.alert("No details available for input: '" + place.name + "'");
//             return;
//           }

//           // If the place has a geometry, then present it on a map.
//           if (place.geometry.viewport) {
//             map.fitBounds(place.geometry.viewport);
//           } else {
//             map.setCenter(place.geometry.location);
//             map.setZoom(17);  // Why 17? Because it looks good.
//           }
//           marker.setPosition(place.geometry.location);
//           marker.setVisible(true);

//           var address = '';
//           if (place.address_components) {
//             address = [
//               (place.address_components[0] && place.address_components[0].short_name || ''),
//               (place.address_components[1] && place.address_components[1].short_name || ''),
//               (place.address_components[2] && place.address_components[2].short_name || '')
//             ].join(' ');
//           }

//           infowindowContent.children['place-icon'].src = place.icon;
//           infowindowContent.children['place-name'].textContent = place.name;
//           infowindowContent.children['place-address'].textContent = address;
//           infowindow.open(map, marker);
//         });

//         // Sets a listener on a radio button to change the filter type on Places
//         // Autocomplete.
//         function setupClickListener(id, types) {
//           var radioButton = document.getElementById(id);
//           radioButton.addEventListener('click', function() {
//             autocomplete.setTypes(types);
//           });
//         }

//         setupClickListener('changetype-all', []);
//         setupClickListener('changetype-address', ['address']);
//         setupClickListener('changetype-establishment', ['establishment']);
//         setupClickListener('changetype-geocode', ['geocode']);

//         document.getElementById('use-strict-bounds')
//             .addEventListener('click', function() {
//               console.log('Checkbox clicked! New state=' + this.checked);
//               autocomplete.setOptions({strictBounds: this.checked});
//             });
//       }
//     </script>
//     <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap"
//         async defer></script>
//   </body>
// </html>