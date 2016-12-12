// MODEL
var Model = {
 // variable declaration of map
map: null,
//   Array containing location data  
locations: [
  {title: 'To Steki', location: {lat: 44.4966635, lng: 11.3475192}},
  {title: "Va Mo Là", location: {lat: 44.4981947, lng: 11.3453512}},
  {title: 'La bottega di un chicco', location: {lat: 44.4906848, lng: 11.3475381}},
  {title: 'Camera a Sud', location: {lat: 44.4963092, lng: 11.345127}},
  {title: 'Pizzartist Marsala', location: {lat: 44.4967268, lng: 11.3452905}},
  {title: 'Pizzeria Aldrovandi', location: {lat: 44.4938545, lng: 11.3495862}},
  {title: 'Pane e Panelle', location: {lat: 44.4939947, lng: 11.3531913}}
]
 };

//VIEW MODEL
var ViewModel = function() {
    // functions to add markers, show data, filter locations, 
    //update infowindow content etc.

 // constants to be used with Yelp api
    const YELP_BASE_URL = "https://api.yelp.com/v2/search";
    const YELP_KEY = "G3gWGS2XU4pO96hRqsYfug";
    const YELP_TOKEN = "rQIuADbleGHxUfckiJbhMHzfM0PUe7bv";
    const YELP_KEY_SECRET = "Hrj_9ufk6CnCYiifWKXmnJS1xpQ";
    const YELP_TOKEN_SECRET = "K-5qKB_mMpk8mEcoAEIG1UotN9M";

    var self = this;

    self.showMapMessage = ko.observable(false);
    self.places = ko.observableArray();
    self.filter = ko.observable('');
    
    if(Model.map == null){
        self.showMapMessage(false);
      } else {
        self.showMapMessage(true);
      }
 

  var largeInfowindow = new google.maps.InfoWindow();
  
	for (var i = 0; i < Model.locations.length; i++) {
          // Get the position from the location array.
          obj = Model.locations[i];
         // // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: obj.location,
            title: obj.title,
            animation: google.maps.Animation.DROP,
            map: Model.map
          });
         self.places.push(marker);
         // add a click listener to show infowindow
         marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });
          }
     
      // function to show marker when mouseover the form
      self.showInfo = function(value){
          populateInfoWindow(value, largeInfowindow);
        };

        // This function will loop through the markers array and display them all.
      self.showListings = function () {
          var bounds = new google.maps.LatLngBounds();
          // Extend the boundaries of the map for each marker and display the marker
          for (var i = 0; i < self.filteredItems().length; i++) {
            self.filteredItems()[i].setMap(Model.map);
            bounds.extend(self.filteredItems()[i].position);
          }
          Model.map.fitBounds(bounds);
        };
      
      
      // // This function will loop through the listings and hide them all.
      self.hideListings =  function () {
          for (var i = 0; i < self.places().length; i++) {
            self.places()[i].setMap(null);
          }
        };

      // function to retrieve data from Yelp API
      function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
      }
      self.yelpdata = function(value){
         // var yelp_url = YELP_BASE_URL + 'search?location=bologna&term=food&cll=' 
         // + value.position.lat() + '%2C' + value.position.lng() + '&limit=3';
          var yelp_url = YELP_BASE_URL;
          var parameters = {
            oauth_consumer_key: YELP_KEY,
            oauth_token: YELP_TOKEN,
            oauth_nonce: nonce_generate(),
            oauth_timestamp: Math.floor(Date.now()/1000),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version : '1.0',
            callback: 'cb', // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
            location : 'Bologna',
            term : 'food',
            limit : 3,
            cll : value.position.lat() + ',' + value.position.lng()
          };

          var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
          parameters.oauth_signature = encodedSignature;

          var settings = {
            url: yelp_url,
            data: parameters,
            cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
            dataType: 'jsonp',
            success: function(results) {
                  $('#suggestions').empty();
                  $('#suggestions').append('<p><a target="_blank" href="'+ 
                    results.businesses[0].url +'">'+ results.businesses[0].name +'</a></p>');
                  },
            
            fail: function() {
              $('#suggestions').append("No suggestions could be loaded");
            }
          };

          // Send AJAX query via jQuery library.
          $.ajax(settings);
      };





  
    //filter the items using the filter text
    self.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            return self.places();
        } else {
            return ko.utils.arrayFilter(self.places(), function(item) {
                //return item.title.substring(0, filter.length) == filter;
                //console.log(item.title + ' ' + filter);
                return item.title.toLowerCase().indexOf(filter) > -1;
            });
        }
    }, self);
    
    // function populateYelpInfoWindow(marker, infowindow){
    //   if (infowindow.marker != marker) {
    //       // Clear the infowindow content to give the streetview time to load.
    //       infowindow.setContent('');
    //       infowindow.marker = marker;
    //       // Make sure the marker property is cleared if the infowindow is closed.
    //       infowindow.addListener('closeclick', function() {
    //         infowindow.marker = null;
    //       });
    //       infowindow.setContent('<div><mark>' + marker.title + '</mark></div>' +
    //             '<div>No Street View Found</div><p><a target="_blank" href="'+ 
    //                 results.businesses[0].url +'">'+ results.businesses[0].name +'</a></p>');
    //     }
    // }

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
          var radius = 50;
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
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(Model.map, marker);
        }
      }

};

//Function to load map and start up app      
var initMap = function() {

  Model.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat:44.493781,lng:11.35143},
      zoom: 14,
      mapTypeControl: false,
      styles: styles
    });
  
 ko.applyBindings(new ViewModel());
};
