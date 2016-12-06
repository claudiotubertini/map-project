// MODEL
var Model = {
//     // Array containing location data   
map: null,

locations: [
  {title: 'To Steki', location: {lat: 44.4966597, lng: 11.3475139}},
  {title: 'Va Mo La', location: {lat: 44.4981909, lng: 11.3453459}},
  {title: 'La bottega di un chicco', location: {lat: 44.4902791, lng: 11.3489778}},
  {title: 'Camera a Sud', location: {lat: 44.4953182, lng: 11.346849}},
  {title: 'Pizzartist Marsala', location: {lat: 44.496723, lng: 11.3452852}},
  {title: 'Pizzeria Aldrovandi', location: {lat: 44.4938507, lng: 11.3495809}},
  {title: 'Pane e Panelle', location: {lat: 44.4939909, lng: 11.353186}}
]
 };

//VIEW MODEL
var ViewModel = function() {
    // functions to add markers, show data, filter locations, 
    //update infowindow content etc.
    // Run API calls to get data 
    

    var self = this;
    self.showMapMessage = ko.observable(false);
    self.showErrorMessage = ko.observable(false);
    self.places = ko.observableArray();
    self.filter = ko.observable('');
    //self.filteredItems = ko.observableArray();
    var placesModel = function(item){
        this.position = item.location;
        this.title = item.title;
    };
   


  //var largeInfowindow = new google.maps.InfoWindow();
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
         console.log(self.places()[i].title);
          }

    // This function will loop through the markers array and display them all.
      // function showListings() {
      //   var bounds = new google.maps.LatLngBounds();
      //   // Extend the boundaries of the map for each marker and display the marker
      //   for (var i = 0; i < markers.length; i++) {
      //     markers[i].setMap(map);
      //     bounds.extend(markers[i].position);
      //   }
      //   map.fitBounds(bounds);
      // }

      // // This function will loop through the listings and hide them all.
      function hideListings() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }
    //filter the items using the filter text
    self.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            return self.places();
        } else {
            return ko.utils.arrayFilter(self.places(), function(item) {
                //return item.title.substring(0, filter.length) == filter;
                //console.log(item.title + ' ' + filter);
                return item.title == filter;
            });
        }
    }, self);
    

    // self.filteredItems = self.places().filter(function(item) {
    // return !self.filter() || item.title == self.filter();
//});

};

//Function to load map and start up app      
var initMap = function() {
 // Load  Google Map:   map = new google.maps.Map(document.getElementById('map') etc. 
 // Instantiate View Model
  Model.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat:44.493781,lng:11.35143},
      zoom: 14,
      mapTypeControl: false,
      styles: styles
    });
 
 ko.applyBindings(new ViewModel());
};
