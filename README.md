# map-project
## Introduction
The application shows a Google Map and a side box with a search form. The map loads with a series of restaurants in a european small town. You can search the places with a text input form and retrieve suggestions for more restaurants using the web site [Yelp](https://www.yelp.com/).
## Description of the application
The main file with the view is `index.html`. The model, the viewmodel and the constructor of the Google Map are in `js/neighborhood-map.js`. The features style of the map is in `js/map.js`. The style of the application is in `css/map.css`.
The application make use of jquery, bootstrap and, above all, knockoutjs. In the javascript folder `js` there is also a file `oauth-signature.min.js` that make possible the connection to Yelp API.
The places that load in the map are hard coded in an array. There is a marker in each place, when clicked an infowindow appears that shows a streetview. The markers change colours moving the mouse over them. In the side box there is the list of all the places. You can search and filter the places writing in the input box. clicking on the name of the place you choose again the infowindow in the map opens and meanwhile a yelp list of places in the nearby is loaded in the sidebox. Then you can click on each yelp suggestion and show a marker in the map and then delete the marker.
### A problem
The parameters of the call to yelp api are based on position (latitude and longitude) and on the name of location. The api actually make a search with a certain radius of lat and lng. Due to the fact that the restaurants shown first on the map, are all quite near, all the data that comes from yelp suggestions are more or less the same, that is they are in the same area, and in each area Yelp lists only a few restaurants.
Therefore this application is not actually useful, it is not able to find real suggestions, but it is sort of conceptual proof. If we started with restaurants in different towns the yelp suggestions could be actually useful.

