var url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
//var url="../all_month.geojson.json";
	var DataClient = function (url) {
	    $.getJSON(url, function(jsonp){
	    	var dataToStore = JSON.stringify(jsonp);
			localStorage.setItem('myData', dataToStore);
	  });
	};
	DataClient(url);
