const Places = function() {
  this.pois = [];
  this.callback = this.callback.bind(this);
  this.displayPOIS = this.displayPOIS.bind(this);
}



Places.prototype.callback = function(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for(let result of results){
      this.pois.push(result);
    }
  }
}


Places.prototype.getGooglePlacesPOIs = function(latLong){
    const poiTypes = ['art_gallery', 'museum', 'church', 'city_hall', 'courthouse', 'zoo', 'synagogue', 'hindu_temple', 'mosque', 'library'];
    console.log(poiTypes);
    const currentLocation = new google.maps.LatLng(latLong.lat, latLong.lng);

    poiTypes.forEach(function(type){
      var request = {
        location: currentLocation,
        radius: '1000',
        type: type
      };

      const googleMap = new google.maps.Map(document.createElement('nomap'), {
      center: currentLocation,
      zoom: 15
    });
      service = new google.maps.places.PlacesService(googleMap);

      service.nearbySearch(request, this.callback);

    }.bind(this));

    setTimeout(function(){
      this.displayPOIS();
    }.bind(this), 1000);

}

Places.prototype.displayPOIS = function(){

  let poisToDisplay = [];
  // const places = this.pois;
  // console.log(this.pois[0].geometry.location.lat());
  // console.log(places);
  // for (let place of places) {
  //   console.log(place)
  //   poisToDisplay.push(place[0])
  // }
    for (var i = 0; i < 5; i++) {
      poisToDisplay.push(this.pois.splice(Math.floor(Math.random()*this.pois.length), 1)[0]);
    }

    console.log(poisToDisplay);
    // return poisToDisplay;
}

module.exports = Places;
