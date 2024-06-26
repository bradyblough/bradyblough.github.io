// Create a map instance and set its center and zoom level
var map = L.map("map", {
  minZoom: 3.75,
  maxZoom: 6.5,
}).setView([0, 0], 2);


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


var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

// Function to update the marker position
function updateISSMarker() {
  fetch("https://api.wheretheiss.at/v1/satellites/25544")
    .then((response) => response.json())
    .then((data) => {
      var latitude = data.latitude;
      var longitude = data.longitude;
      issMarker.setLatLng([latitude, longitude]);
      map.flyTo([latitude, longitude], map.getZoom());
    });
}

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

// Update the marker position every 5Q seconds
setInterval(updateISSMarker, 5000);
