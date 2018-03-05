const Leaflet = require('leaflet');
const keys = require('./keys.js');

const appStart = function(){

    const mymap = Leaflet.map('map');

    Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: keys.mapbox
    }).addTo(mymap);

    const newMarkerIcon = Leaflet.icon({
        iconUrl: 'marker.png',
        iconSize:     [60, 120], // size of the icon
        // iconAnchor:   [50, 1], // point of the icon which will correspond to marker's location
        // popupAnchor:  [15, -20] // point from which the popup should open relative to the iconAnchor
    });

    mymap.locate({setView: true, maxZoom: 16});

    function onLocationFound(e) {
        const radius = e.accuracy / 2;

        Leaflet.marker(e.latlng, {icon: newMarkerIcon}).addTo(mymap)
            .bindPopup("You are here!").openPopup();

        Leaflet.circle(e.latlng, radius).addTo(mymap);
    }

    mymap.on('locationfound', onLocationFound);

    const url = 'https://maps.googleapis.com/maps/api/js?key='+ keys.googleMaps +'&libraries=places';
    makeRequest(url, requestComplete);

}
    const makeRequest = function(url, callback){
      const request = new XMLHttpRequest();
      request.open('GET', url);
      request.addEventListener('load', callback);
      request.send();
    }

    const requestComplete = function(){
      if(this.status !== 200) return;
      const jsonString = this.responseText;
      const places = JSON.parse(jsonString);
      console.log(places);
    }

document.addEventListener("DOMContentLoaded", appStart);
