/* Module for maps application */
var MapsApplication = function () {
  
  /* model to hold addresses */
  var mapsModel = {
      fromAddress: ko.observable(),
      toAddress: ko.observable()
  };

  /* generic model for address */
  var AddressModel = function() {
      this.marker = ko.observable();
      this.location = ko.observable();
      this.streetNumber = ko.observable();
      this.streetName = ko.observable();
      this.city = ko.observable();
      this.state = ko.observable();
      this.postCode = ko.observable();
      this.country = ko.observable();
  };
  /* address components to retrieve */
  var addressComponents = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
  };

  /* method to retrieve address information in the model */
  var populateAddress = function (place, value) {
      var address = new AddressModel();
      //set location
      address.location(place.geometry.location);
      //loop through the components and extract required address fields
      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (addressComponents[addressType]) {
          var val = place.address_components[i][addressComponents[addressType]];
          if (addressType == "street_number") {
            address.streetNumber(val);
          } else if (addressType == "route") {
            address.streetName(val);
          } else if (addressType == "locality") {
            address.city(val);
          } else if (addressType == "administrative_area_level_1") {
            address.state(val);
          } else if (addressType == "country") {
            address.country(val);
          } else if (addressType == "postal_code") {
            address.postCode(val);
          }
        }
      };
      //set the address model in the binding value
      value(address);
  };

  var configureBindingHandlers = function(){
      ko.bindingHandlers.addressAutoComplete = {
          init: function(element, valueAccessor){
              var autocomplete = new google.maps.places.Autocomplete(element, {types:['geocode']});
              var value = valueAccessor();
              google.maps.event.addListener(autocomplete, 'place_changed', function(){
                  var place = autocomplete.getPlace();
                  updateAddress(place, value);
              });
          }
      };
      /* custom binding handler for maps panel   */
      ko.bindingHandlers.mapPanel = {
          init: function(element, valueAccessor){
            map = new google.maps.Map(element, {
              zoom: 10
            });
            centerMap(localLocation);
          }
      };
  };
    /* method to update the address model */
  var updateAddress = function(place, value) {
    populateAddress(place, value);
    placeMarker(place.geometry.location, value);
  };

    /* method to center map based on the location*/
  var centerMap = function (location) {
    map.setCenter(location);
    google.maps.event.trigger(map, 'resize');
  }
  
  var localLocation = {lat: 41.810432, lng: 12.96616};
  /* method to retrieve and set local location */
  var setLocalLocation = function () {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        localLocation.lat = position.coords.latitude;
        localLocation.lng = position.coords.longitude;
        console.log("successfully retrieved local location. Lat [" + localLocation.lat + "] Lng [" + localLocation.lng + "]");
      },
      function (error) {
        console.log("Could not get current coords: " + error.message);
      });
    };
  };

  /* method to place a marker on the map */
  var placeMarker = function (location, value) {
    // create and place marker on the map
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    //store the newly created marker in the address model
    value().marker(marker);
  };
  /* method to remove old marker from the map */
  var removeMarker = function(address) {
    if(address != null) {
      address.marker().setMap(null);
    }
  };
  /* method to register subscriber */
  var registerSubscribers = function () {
    //fire before from address is changed
    mapsModel.fromAddress.subscribe(function(oldValue) {
      removeMarker(oldValue);
    }, null, "beforeChange");
    
    //fire before to address is changed
    mapsModel.toAddress.subscribe(function(oldValue) {
      removeMarker(oldValue);
    }, null, "beforeChange");
  };
  var init = function () {
    /* add code to initialize this module */
    configureBindingHandlers();
    setLocalLocation();
    registerSubscribers();
    ko.applyBindings(MapsApplication);
  };

  /* execute the init function when the DOM is ready */
  $(init);
  
  return {
    /* add members that will be exposed publicly */
    mapsModel: mapsModel
  };
}();