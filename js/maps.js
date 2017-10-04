var distanceUnit = 'km';
var marker1, marker2;
var poly, geodesicPoly;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.769, lng: -122.446}
  });

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      document.getElementById('info'));

  marker1 = new google.maps.Marker({
    map: map,
    draggable: true,
    position: {lat: 45.857, lng: -122.352}
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

  update();
}

function update() {
  var path = [marker1.getPosition(), marker2.getPosition()];
  poly.setPath(path);
  document.getElementById('origin').value = getCoordsForDisplay(path[0]);
  document.getElementById('destination').value = getCoordsForDisplay(path[1]);
  document.getElementById('distance').value = getDistance(marker1.getPosition(), marker2.getPosition());
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