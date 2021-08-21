function createMap(beaches) {
  
  // Adding tile layer to the map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Beaches": beaches
  };

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Creating map object
  var myMap = L.map("map", {
    center: [41.6, -87.66],
    zoom: 11,
    layers: [lightmap, beaches]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
  // Grab the data with d3
  d3.json("sample.json").then(function(MapData) {
    console.log(MapData); 
    var latitudes = parseFloat(MapData.Latitude);
    var longitudes = parseFloat(MapData.Longitude);
    var locations = MapData.stationNames;
    var maxDNA = d3.max(MapData.dna_reading_means); 
    console.log(maxDNA);
    
    // Create a new marker cluster group
    // var markers = L.markerClusterGroup();
    var markers = [];

    // Loop through locations
    for (var i = 0; i < locations.length; i++) {
      // var location = locations[i];
      // console.log(location);
  // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([latitudes[i], longitudes[i]])
      .bindPopup("<h3>" + locations[i] + "<h3><h3>Max DNA mean: " + maxDNA + "</h3>"));
    
      // // Add our marker cluster layer to the map
      // markers.push(marker);
      // Add our marker cluster layer to the map
  myMap.addLayer(markers);

      // Create a layer group made from the bike markers array, pass it into the createMap function
      createMap(L.layerGroup(markers));
  }

 });
