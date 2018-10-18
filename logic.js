// Earthquakes from the last 30 days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
/*
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
 */ 
 var earthquakeMarkers = [];

 for (var i = 0; i < earthquakeData.length; i++) {
	 console.log(earthquakeData[i].properties.mag);

  earthquakeMarkers.push(
    L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
	  color: markerColor(earthquakeData[i].properties.mag),
	  fillColor: markerColor(earthquakeData[i].properties.mag),
	  fillOpacity: 0.75,
	  radius: markerSize(earthquakeData[i].properties.mag)
    }).bindPopup("<h1>" + earthquakeData[i].properties.place + "</h1> <hr> <h3>Magnitude: " + earthquakeData[i].properties.mag + "</h3>")
  );
}
var earthquakes = L.layerGroup(earthquakeMarkers);

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Function to determine marker size based on magnitude types
function markerSize(radius) {
  if (radius <= 6) {return 300000};
  if (radius > 6 && radius <= 7) {return 300000};
  if (radius > 7) {return 800000};
}
function markerColor(magnitude) {
  if (magnitude <= 6) {return "green"};
  if (magnitude > 6 && magnitude <= 7) {return "yellow"};
  if (magnitude > 7) {return "red"};
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      28.8719, -12.5674
    ],
    zoom: 2.3,
    layers: [streetmap, earthquakes]
  });


  
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

//legend  
	  var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (myMap) {

		var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 6, 7],
		labels = [];

		// loop through our density intervals and generate a label with a colored square for each interval
		for (var i = 0; i < grades.length; i++) {
			div.innerHTML +=
				'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	}

	return div;
	};

	legend.addTo(myMap);
}

function getColor(d) {
    return d > 7   ? 'red' :
           d > 6   ? 'yellow' :
                      'green';
}