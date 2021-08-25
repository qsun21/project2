
var circles = [];
var initDate = "2019-07-31";
var timeFormatter = d3.timeFormat('%Y-%m-%dt');
var numberFormatter = d3.format(".1f");

var properties = [
    { code: 'DNA Reading', desc: 'PCR Measurement' },
    { code: 'Air Temperature', desc: 'Beach Station Temperature' },
    { code: 'Humidity', desc: 'Beach Station Humidity' }
    ];
var currProperty = 'dna_reading_means';
        
function renderProperties() {
    var pp = d3.select('#property-list').selectAll('.view').data(properties);
    pp.enter()
        .append('div')
        .classed('view', true)
        .attr('title', d => d.desc)
        .text(d => d.code)
        .merge(pp)
        .classed('selected', d => d.code === currProperty)
        .on('click', d => {
         // alert(d.code);
         currProperty = d.code;
         // renderProperties();
         renderCircles();
     })
    }
renderProperties();

var theMap = L.map('map', {maxZoom: 14});
theMap.attributionControl.addAttribution('Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Map data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>');

L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg').addTo(theMap);
// center of Chicago
theMap.setView([41.9, -87.66], 11);
var radiusScale = d3.scaleLinear().domain([0, 1000]).range([7, 30]).clamp(true);
var colorScale = d3.scaleSequential(d3.interpolateOrRd).domain([0, 1000]);

function renderCircles() {
   // remove old markers
   circles.forEach(function(c) {
      c.remove();
   })
   circles = [];
   var locations = theData.stationNames;
   // console.log(locations);
   var latitude = theData.Latitude;
   var longitude = theData.Longitude;
   var DNA = theData.dna_reading_means;
   var maxDNA = Math.max(parseFloat(theData.dna_reading_means));
   // console.log(DNA);
   var temp = theData['Air Temperature']
   var humidity = theData.humidityReadings;
   for (var i = 0; i < locations.length; i++) { 
      var c = L.circleMarker(
         [latitude[i], longitude[i]], {
            radius: radiusScale(DNA[i]),
            color: colorScale(DNA[i]),
            color: 'black',
            fillColor: '#f03',
            fillOpacity: 0.9
         });
      c.addTo(theMap);
      if (currProperty === 'DNA Reading'){ 
         c.bindTooltip("<h5>Beach: " + locations[i] + "</h5> <hr> <h5>DNA: " + DNA[i] + "</h5>");
      } else if (currProperty === 'Air Temperature'){
         c.bindTooltip("<h5>Beach: " + locations[i] + "</h5> <hr> <h5>Temp: " + temp[i] + "</h5>");
      } else if (currProperty === 'Humidity'){
         c.bindTooltip("<h5>Beach: " + locations[i] + "</h5> <hr> <h5>Humidity: " + humidity[i] + "</h5>");
      } 
        
      circles.push(c);
   };
}

function fetchData(dateStr) {
   d3.json("https://nwu-qianmariomahomedpam-proj2.herokuapp.com/data").then(function(data) {
      theData = data;
      var selectedDates = theData.dna_sample_timestamps;
      for (var i = 0; i < selectedDates.length; i++) {
         // console.log(selectedDates);
         renderCircles();
      }
   });
}

fetchData(initDate);
    
    var calendar = flatpickr("#datepicker", {
      //   enableTime: true,
        dateFormat: "Y-m-d",
        minDate: "2019-07-30",
        maxDate: "2019-08-04",
        // minuteIncrement: 60,
        onChange: function(selectedDates, dateStr, instance) {
           fetchData(timeFormatter(selectedDates[i]));
         //   console.log(selectedDates);
        }
     });
     calendar.setDate(initDate); 