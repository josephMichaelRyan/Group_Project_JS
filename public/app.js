const Leaflet = require('leaflet');
const keys = require('./keys.js');
const Places = require('./places.js')

var map;
var service;
var infowindow;
let zoom;


const appStart = function(){


    const callback = function(poisToDisplay){

      poisToDisplay.forEach(function(poi){
        let newMarkerIcon;
        if(poi.thumbnail_url != null){
          newMarkerIcon = Leaflet.icon({
            iconUrl: poi.thumbnail_url,
            iconSize:     [100, 100] // size of the icon
          });
        } else {
          newMarkerIcon = Leaflet.icon({
            iconUrl: 'marker.png',
            iconSize:     [60, 120]// size of the icon
          });
        }
        const lat = poi.location.lat;
        const long = poi.location.lng;
        let perex = poi.perex;
        if(perex == null){
          perex = "";
        }

        const marker = Leaflet.marker([lat, long], {icon: newMarkerIcon}).addTo(mymap)
            .bindPopup(poi.name + '\n' + perex);

        marker.addEventListener('click', function(){
          const url = 'https://api.sygictraveldata.com/1.0/en/places/' + poi.id
          const request = new XMLHttpRequest();
          request.open('GET', url)
          request.setRequestHeader('x-api-key', keys.sygicTravel)
          request.addEventListener('load', function(){
            const jsonString = request.responseText
            let description = JSON.parse(jsonString).data.place.description;

            if(description == null){
              description = poi.name;
            } else {
              description = description.text
            }
            marker._popup.setContent(description);
        }.bind(this));
          request.send();
        })
      })
    }

    const mymap = Leaflet.map('map');

    Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: keys.mapbox
    }).addTo(mymap);

    const newMarkerIcon = Leaflet.icon({
        iconUrl: 'marker.png',
        iconSize:     [60, 120] // size of the icon
        // iconAnchor:   [50, 1], // point of the icon which will correspond to marker's location
        // popupAnchor:  [15, -20] // point from which the popup should open relative to the iconAnchor
    });

    mymap.locate({setView: false, maxZoom: 15, watch: true});

// 55.946927, -3.201912

const poi = new Places();
let hasSetInitialView = false;

let userMarker = Leaflet.marker([0,0],{icon: newMarkerIcon}).addTo(mymap);
// let userCircle = Leaflet.circle([0,0], 20).addTo(mymap);


function onLocationFound(e) {

  if(!hasSetInitialView){
    mymap.setView(e.latlng, 15);
  }

  hasSetInitialView = true;

  // const radius = e.accuracy / 2;
  userMarker.setLatLng(e.latlng);
  mymap.panTo(e.latlng);
  // userCircle.setLatLng(e.latlng);

  if(!poi.hasPlaces){
    poi.getPlacesPOIs(e.latlng, callback);
  }
}
mymap.on('locationfound', onLocationFound);

}

document.addEventListener("DOMContentLoaded", appStart);
