// MODEL
var Model = {
    map: null,
    //   Array containing sample location data
    locations: [
      {title: 'To Steki', location: {lat: 44.4966635, lng: 11.3475192}},
      {title: "Va Mo La", location: {lat: 44.4981947, lng: 11.3453512}},
      {title: 'La bottega di un chicco', location: {lat: 44.4906848, lng: 11.3475381}},
      {title: 'Camera a Sud', location: {lat: 44.4963092, lng: 11.345127}},
      {title: 'Pizz Artist', location: {lat: 44.4967268, lng: 11.3452905}},
      {title: 'Pizzeria Aldrovandi', location: {lat: 44.4938545, lng: 11.3495862}},
      {title: 'Pane e Panelle', location: {lat: 44.4939947, lng: 11.3531913}}
    ]
};

//VIEW MODEL
var ViewModel = function() {

    // constants to be used with Yelp api
    const YELP_BASE_URL = "https://api.yelp.com/v2/business/";
    const YELP_KEY = "G3gWGS2XU4pO96hRqsYfug";
    const YELP_TOKEN = "5DzTH0aqeQZHcW_djvgmNjuNNjojF5wQ";
    const YELP_KEY_SECRET = "Hrj_9ufk6CnCYiifWKXmnJS1xpQ";
    const YELP_TOKEN_SECRET = "8mn4yqEPFwBxBsXepmge3X3tA6A";

    var self = this;

    self.places = ko.observableArray();
    self.url = ko.observable();
    self.name = ko.observable();
    self.reviews = ko.observable();
    self.filter = ko.observable('');
    self.yelpMarker = ko.observableArray();
    self.showSuggestions = ko.observable(false);
    self.showError = ko.observable(false);

    // Google Map API markers
    // =================================

    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // Add Google Map markers for every location contained in Model.locations
    // Create then a "highlighted location" marker color and mouseover and mouseout events
    for (var i = 0; i < Model.locations.length; i++) {
        // Get the position from the location array.
        obj = Model.locations[i];
        var defaultIcon = makeMarkerIcon('e85113');
        // Create a marker per location
        var marker = new google.maps.Marker({
            position: obj.location,
            title: obj.title,
            //animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            map: Model.map
          });
        // add a click listener to show infowindow and a bounce animation
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeMarkerIcon('f0e4d3');
        // Add the marker to an observableArray
        self.places.push(marker);
        bounds.extend(marker.position);
        google.maps.event.addDomListener(window, 'resize', function() {
          Model.map.fitBounds(bounds);
        });
        // add an event listener to change markers colour
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
    }

    // Search and filter the items (markers) using the input form
    self.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            for (var i = 0; i < self.places().length; i++) {
                self.places()[i].setVisible(true);
              }
            return self.places();
        } else {
            return ko.utils.arrayFilter(self.places(), function(item) {
              if (item.title.toLowerCase().indexOf(filter) > -1){
                item.setVisible(true);
                return true;
              } else {
                item.setVisible(false);
                return false;
              }
            });
        }
    }, self);

    // Show a marker information from Google Map API (an infowindow)
    self.showInfo = function(value){
        value.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ value.setAnimation(null); }, 3000);
        populateInfoWindow(value, largeInfowindow);
      };

    // This function will loop through the markers array and display them all
    // and extend the boundaries of the map
    self.showListings = function () {
        var bounds = new google.maps.LatLngBounds();
        self.hideListings();
        for (var i = 0; i < self.filteredItems().length; i++) {
          self.filteredItems()[i].setVisible(true);
          //self.filteredItems()[i].setMap(Model.map);
          bounds.extend(self.filteredItems()[i].position);
          }
        Model.map.fitBounds(bounds);
      };

    // This function will loop through the markers and hide them all.
    self.hideListings =  function () {
        for (var i = 0; i < self.places().length; i++) {
          self.places()[i].setVisible(false);
          largeInfowindow.close();
          //self.places()[i].setMap(null);
          }
        self.showSuggestions(false);
      };

    // Yelp API and map markers
    // ================================
    // shows results from Yelp API using Ajax

    // retrieve yelp data using the name of the business
    // and assign them to observables
    self.yelpdata = function(value){
      // all observables are cleaned
        self.name('');
        self.url('');
        self.reviews('');
        self.showError(false);
        self.showSuggestions(false);
      // preparing the url
        var business_id0 = value.title.toLowerCase().split(' ').join('-');
        business_id = business_id0 + '-bologna';
        var yelp_url = YELP_BASE_URL + business_id;
        var parameters = {
          oauth_consumer_key: YELP_KEY,
          oauth_token: YELP_TOKEN,
          oauth_nonce: nonce_generate(),
          oauth_timestamp: Math.floor(Date.now()/1000),
          oauth_signature_method: 'HMAC-SHA1',
          oauth_version : '1.0',
          callback: 'cb',
          cc: 'it'
        };

      var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
      parameters.oauth_signature = encodedSignature;
      // if yelp do not respond in 5 sec an alert is triggered
      var apiTimeout = setTimeout(function() {
          alert('Sorry: something went wrong and we failed to load data from Yelp');
      }, 5000);

      var settings = {
        url: yelp_url,
        data: parameters,
        cache: true,
        dataType: 'jsonp',
        success: function(results) {
          clearTimeout(apiTimeout); // timeout is stopped
          self.showSuggestions(true);
          self.name(results.name);
          self.url(results.url);
          self.reviews(results.reviews[0]['excerpt']);
          },
        error: function(xhr, ajaxOptions, thrownError) {
          self.showSuggestions(false);
          self.showError(true);
        }
      };
      // Send AJAX query via jQuery library.
      $.ajax(settings);
    };

    // Helper functions
    // **********************************

    /**
    * @description Generate a random number, an integer, then casted to string, to be used in Yelp parameters
    * @returns {string}
    */
    function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
    }

    /**
    * @description This function takes a marker and an infowindow, retrieves a streetview
    ] and put contents inside the infowindow
    * @param {marker} A Google Map API Marker
    * @param {infowindow} A google Map API infowindow
    */
    function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 40;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
          if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(
              nearStreetViewLocation, marker.position);
              infowindow.setContent('<div><mark>' + 'Nearby '+ marker.title + '</mark></div><div id="pano"></div>');
              var panoramaOptions = {
                position: nearStreetViewLocation,
                pov: {
                  heading: heading,
                  pitch: 30
                }
              };
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('pano'), panoramaOptions);
          } else {
            infowindow.setContent('<div><mark>' + marker.title + '</mark></div>' +
              '<div>No Street View Found</div>');
          }
        }
        // Use streetview service to get the closest streetview image within
        // 40 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(Model.map, marker);
        Model.map.panTo(marker.position);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 5000);

      }
    }

    /**
    * @description This function takes in a COLOR, and then creates a new marker
    * icon of that color. The icon will be 21 px wide by 34 high,
    * have an origin of 0, 0 and be anchored at 10, 34).
    * @param {string} An Hex Color Code without hash: example 'ff0000'
    * @returns {MarkerImage} Creates a new marker icon of that color
    */
      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }

};
// in case something is wrong with google api
var googleError = function(){
  alert( "Error: no map available" );
};

// function to load map and start up app
var initMap = function() {

    Model.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:44.493781,lng:11.35143},
        zoom: 14,
        mapTypeControl: false,
        styles: styles
      });


    ko.applyBindings(new ViewModel());
};


