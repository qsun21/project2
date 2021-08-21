
var circles = [];
var initDate = "2019-07-31";
var timeFormatter = d3.timeFormat('%Y-%m-%dt');
var numberFormatter = d3.format(".1f");

var properties = [
    { code: 'DNA Reading', desc: 'benzene level measured in μg/m³' },
    { code: 'Air Temperature', desc: 'carbon monoxide level measured in mg/m³' },
    { code: 'Humidity', desc: 'ethylbenzene level measured in μg/m³' },
    { code: 'Air Pressure', desc: 'm-xylene level measured in μg/m³' },
    { code: 'Wind Speed', desc: 'toluene (methylbenzene) level measured in μg/m³' }
];
var currProperty = 'DNA Reading';
        
function renderProperties() {
    var pp = d3.select('#property-list').selectAll('.view').data(properties);
    pp.enter()
        .append('div')
        .classed('view', true)
        .on('click', d => {
            currProperty = d.code;
            renderProperties();
            renderCircles();
        })
        .attr('title', d => d.desc)
        .text(d => d.code)
        .merge(pp)
        .classed('selected', d => d.code === currProperty);
    }
renderProperties();

console.log(L.Icon.Default.prototype._getIconUrl());

var theMap = L.map('map', {maxZoom: 14});
theMap.attributionControl.addAttribution('Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Map data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>');

L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.png').addTo(theMap);
// center of Chicago
theMap.setView([41.9, -87.66], 11);

// var spaceID = [SpaceID];
// var accessToken = [AccessToken];
var radiusScale = d3.scaleLinear().domain([0, 200]).range([7, 70]).clamp(true);
var colorScale = d3.scaleSequential(d3.interpolateOrRd).domain([0, 100]);

function renderCircles() {
   // remove old markers
   circles.forEach(function(c) {
      c.remove();
   })
   circles = [];
   var locations = theData.stationNames;
   var latitude = theData.Latitude;
   var longitude = theData.Longitude;
   var DNA = theData.dna_reading_mean;
   var humidity = theData.humidity
   for (var i = 0; i < locations.length; i++) { 
      var c = L.circleMarker(
         [theData.Latitude[i], theData.Longitude[i]], {
            radius: 20,
            // color: colorScale(feature.properties[currProperty]),
            color: 'black',
            fillColor: '#f03',
            fillOpacity: 0.9
         });
      c.addTo(theMap);
      c.bindTooltip("<h5>" + locations[i] + "<h5>");
      circles.push(c);
   };
}

function fetchData(dateStr) {
//    var url = 'https://xyz.api.here.com/hub/spaces/' + spaceID + '/search?limit=100&access_token=' + accessToken + '&tags=' + dateStr;
   d3.json("https://nwu-qianmariomahomedpam-proj2.herokuapp.com/data").then(function(data) {
      theData = data;
      console.log(theData);
      renderCircles();

   });
}

fetchData(initDate);

    var calendar = flatpickr("#datepicker", {
        enableTime: true,
        dateFormat: "Y-m-d",
        minDate: "2019-07-31",
        maxDate: "2019-08-31",
        // minuteIncrement: 60,
        onChange: function(selectedDates, dateStr, instance) {
           fetchData(timeFormatter(selectedDates[0]))
        }
     });
     calendar.setDate(initDate); 