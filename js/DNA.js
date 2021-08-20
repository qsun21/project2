var svg;
var tooltip = d3.select("#tooltip").style("display", "inline").text("TOOLTIP");
var data;
var svgHeight = 300;
var svgWidth = 1200;
var DNAMean;

function optionChanged(option) {
  if(option == 'Station Name') {
      clearHistogram();
      clearMetadata();
      return;
  }
  createHistogram(option, data);
  updateMetadata(option, data);
}

d3.json("https://nwu-qianmariomahomedpam-proj2.herokuapp.com/data").then(function(fileData) {
  data = fileData;
  var dropdownMenu = d3.select("#selDataset");
  defaultOption = dropdownMenu.append("option");
  defaultOption.property('selected', 'selected');
  defaultOption.property('value', 'Station Name');
  defaultOption.text("Station Name");
  dataSet = new Set(fileData.stationNames);
  console.log(dataSet);
  dataSet.forEach(element => {
    var option = dropdownMenu.append("option");
    option.property('value', element);
    option.text(element);
  }); 
});


function createHistogram(option, histData) {
  dna_reading_means = [];
  humidityReadings = [];
  histogram = d3.select("#histogram");
  histogram.style("display", "inline");

  for(var i = 0; i < histData.stationNames.length; i++) { 
    if(histData.stationNames[i] == option) {
      dna_reading_means.push(histData.dna_reading_means[i]);
      humidityReadings.push(histData.humidityReadings[i]);
    }
  }    

  var trace1 = {
    x: humidityReadings,
    y: dna_reading_means,
    mode: 'markers+text',
    type: 'histogram',
    name: 'DNA Bacterial level VS Humidity ',
    text: option,
    textposition: 'center',
    textfont: {
        family:  'Raleway, sans-serif'
    },
    marker: { size: 5 }
  };
  
  var layout = {
      xaxis: {
        title: 'humidity',
        autotick: true,
        showline: true,
        ticks: 'outside',
        dtick: 0.25,
        ticklen: 6,
        tickwidth: 1,
        tickcolor: '#001'
      },
      yaxis: {
        title: 'DNA Bacterial level' ,
        autotick: true,
        showline: true,
        ticks: 'outside',
        tick0: 0,
        dtick: 0.25,
        ticklen: 6,
        tickwidth: 2,
        tickcolor: '#000'
      }
    };
  
  var data = [trace1];
  
  Plotly.newPlot('histogram', data, layout);

}

function clearHistogram() {
  var histogram = d3.select("#histogram");
  histogram.style("display", "none");
}

function clearMetadata() {
  var meta = d3.select("#sample-metadata");
  meta.style("display", "none");
}

function updateMetadata(option, data) {
  var meta = d3.select("#sample-metadata");
  meta.html("");
  meta.style("display", "inline");
  latitudeH3 = meta.append("h3");
  longitudeH3 = meta.append("h3");
  aveTemp = meta.append("h3");
  var airTempSum = 0;
  var num = 0;
  for(var i = 0; i < data.stationNames.length; i++) { 
    if(data.stationNames[i] == option) {
      latitudeH3.text(" Latitude: " + data.Latitude[i]);
      longitudeH3.text("  Longitude: " + data.Longitude[i]);
      airTempSum += data['Air Temperature'][i];
      num++;
    }
  }
  aveTemp.text("Ave Temp: " + airTempSum / num);
}
