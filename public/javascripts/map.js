// 1. set up map
// global object to put all of our content and variables
const MyMap = {};
// start leaflet map
MyMap.map = L.map('map', {
  center: [39.29564, -76.60689],
  zoom: 15,
  minZoom: 4,
  maxZoom: 19
});

// add basemap
// var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
var OpenStreetMap_Mapnik = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(MyMap.map);

/*
  2. Add data
*/

// Here we define an async function to get and parse geojson from URL
MyMap.getGeoData = async function getGeoData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

// set some default style for the map
// "rail"
// "road"
// "hwy"
MyMap.styler = function(feature) {
  let style = {
    color: "rgb(100,255,143)",
    fillOpacity: 1,
    weight: 3
  }
  let props = feature.properties;
  if (props.subtype === 'rail'){
    style.color = 'red'
  } else if (props.subtype === 'road') {
    style.color = 'blue';
  }

  return style;
}
// define an empty geojson obect to store the data
  let geojson = L.geoJson(null, {style: MyMap.styler});
geojson.addTo(MyMap.map);

// add the data to the map
MyMap.getGeoData('/api/railroads')
  .then(data => geojson.addData(data))
  .catch(e => console.warn('Fetching GeoJSON had an error',e));

/*
  3. Add some popups
*/
MyMap.makePopup = function (event) {
  let feature = event.feature;
  let props = feature.properties;
  let label = `
    <ul>
      <li>Description: ${props.description}</li>
      <li>SubType: ${props.subtype}</li>
    </ul>
  `;
  return label;
}
geojson.bindPopup(MyMap.makePopup);
