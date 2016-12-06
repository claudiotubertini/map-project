// MODEL
// var Model = [
//     // Array containing location data   
// ];

//VIEW MODEL
var ViewModel = function() {
    // functions to add markers, show data, filter locations, 
    //update infowindow content etc.
    // Run API calls to get data 
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat:44.493781,lng:11.35143},
      zoom: 6,
      mapTypeControl: false,
      styles: styles
    });

    var self = this;
    self.showMapMessage = ko.observable(false);
    self.showErrorMessage = ko.observable(false);
    //self.places = ko.observableArray(locations);
    self.query = ko.observable('');
    var earthquakeModel = function(item){
    	self.mag = ko.observable(item.features.properties.mag),
    	self.lng = ko.observable(item.features.geometry.coordinates.longitude),
    	self.lat = ko.observable(item.features.geometry.coordinates.latitude)
    };
   

	// online version
	//**********************
	//var url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
	var url = "http://localhost:8080/locations";
  var DataClient = function (url) {
	    $.getJSON(url, function(jsonp){
	    	map.data.addGeoJson(jsonp);
	  });
	};
	DataClient(url);

//****************************+
// localhost version
// var locations = [];
//     var JSONClient = function (url) {
//         /* the base url for the rest service */
//         var baseUrl = url;
//         /* method to retrieve locations */
//         var getLocations = function(callback) {
//             $.ajax({
//                 url: baseUrl + "/locations",
//                 type: "GET",
//                 success: function(result) {
//                     console.log("Schedule retrieved: " + JSON.stringify(result));
//                     callback(result);
//                 }
//             });
//         };
//         return{
//             getLocations: getLocations
//         };
//     };
//     var client = JSONClient("http://localhost:8080");

// /* method to retrieve products using the client */
//     var retrieveJSON = function () {
//         console.log("Retrieving products from server ...");
//         client.getLocations(retrieveLocationsCallback);
//     };
    
//     /* callback for when the products are retrieved from the server */
//     var retrieveLocationsCallback = function (data) {
//         data.forEach(function(item) {
//             locations.push(new earthquakeModel(item));

//         });
//     };
 
//******************************
	map.data.setStyle(function(feature) {
	    var magnitude = feature.getProperty('mag');
		  return {
		    icon: getCircle(magnitude),
		    clickable: true
		  };
	});
      
//map.data.setStyle({visible: false});
      function getCircle(magnitude) {
        return {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'red',
          fillOpacity: .2,
          scale: Math.pow(2, magnitude) / 2,
          strokeColor: 'white',
          strokeWeight: .5
        };
      }
    // This function will loop through the markers array and display them all.
      function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }

      // This function will loop through the listings and hide them all.
      function hideListings() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }

      // function eqfeed_callback(results) {
      //   map.data.addGeoJson(results);
      // }

// sempre presenti in google map
// var myMap = new google.maps.Map(...);
//  myMap.data.addGeoJson(...);
//  myMap.data.setStyle(...); 
};

//Function to load map and start up app      
//var initMap = function() {
 // Load  Google Map:   map = new google.maps.Map(document.getElementById('map') etc. 
 // Instantiate View Model
  
 
 ko.applyBindings(new ViewModel());
//};
