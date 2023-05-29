// Create a map instance and set its center and zoom level
var map = L.map("map", {
    minZoom: 3.75,
    maxZoom: 6.5,
  }).setView([0, 0], 2);
  
  // Add a tile layer to the map (using OpenStreetMap)
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    }
  ).addTo(map);
  
  // Create a custom marker icon
  var issIcon = L.icon({
    iconUrl: "images/icon.png",
    iconSize: [32, 32],
  });
  
  // Create a marker for the ISS with the custom icon
  var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);
  
  // Function to update the marker position
  function updateISSMarker() {
    fetch("https://api.wheretheiss.at/v1/satellites/25544")
      .then((response) => response.json())
      .then((data) => {
        var latitude = data.latitude;
        var longitude = data.longitude;
        issMarker.setLatLng([latitude, longitude]);
        map.setView([latitude, longitude]);
      });
  }
  
  // Event listener for marker click
  issMarker.on("click", function () {
    fetch("https://api.wheretheiss.at/v1/satellites/25544")
      .then((response) => response.json())
      .then((data) => {
        var latitude = data.latitude;
        var longitude = data.longitude;
        var velocity = data.velocity;
        var popupContent =
          "<b>Latitude</b>: " +
          latitude +
          "<br><b>Longitude</b>: " +
          longitude +
          "<br><b>Velocity</b>: " +
          velocity.toFixed(2) +
          " kph";
        issMarker.bindPopup(popupContent).openPopup();
      });
  });
  
  // Update the marker position every 2 seconds
  setInterval(updateISSMarker, 2000);
  