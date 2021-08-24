function optionChanged(option) {
    if(option == 'Individual Name' || !data) {
        clearBarChart();
        clearBubbleChart();
        clearMeta();    
        return;
    }
    var individualSampleList = data.samples.filter(sample => sample.id == option);
    if(individualSampleList.length != 1) {
        return;
    }
    var individualSample = individualSampleList[0];
    var otuIds = individualSample.otu_ids.slice(0,10);
    var values = individualSample.sample_values.slice(0,10);
    var labels = individualSample.otu_labels.slice(0,10);
    var metadataList = data.metadata.filter(meta => meta.id == option);
    if(metadataList.length != 1) {
        return;
    }
    var metadata = metadataList[0];

    d3.json("http://localhost:5000/data").then(function(data) {
    console.log(data);    
    var tooltip = d3.select("#tooltip")
        tooltip.style("display", "inline").text(JSON.stringify(data));
    })
    
    //bubbleChart(otuIds, values, labels);
    //renderMetadata(metadata);
}

var svg;
var tooltip = d3.select("#tooltip").style("display", "inline").text("TOOLTIP");
var data;
var svgHeight = 300;
var svgWidth = 1200;


d3.json("samples.json").then(function(json) {
    data = json;
    
    var dropdownMenu = d3.select("#selDataset");
    svg = d3.select("#bar")
        .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

    defaultOption = dropdownMenu.append("option");
    defaultOption.property('selected', 'selected');
    defaultOption.property('value', 'Individual Name');
    defaultOption.text("Individual Name");
    for(i = 0; i < data.names.length; i++) {
        var option = dropdownMenu.append("option");
        option.property('value', data.names[i]);
        option.text(data.names[i]);
    }
});

function mouseover(label) {
    tooltip.style("display", "inline");
    tooltip.text(label)
  }

function mouseout() {
    tooltip.text("TOOLTIP");
}

function bubbleChart(otuIds, values, labels) {
    var trace = {
        x: otuIds,
        y: values,
        mode: "markers",
        marker: {
            size: values,
            color: otuIds
        },
        text: labels
    };

    var layout = {
        xaxis: {title: "OTU ids" },
        height: 600,
        width: 800
    };

    var data = [trace];

    Plotly.newPlot("bubble", data, layout);
}

function lookupLabelForValue(values, labels, value) {
    var index = -1;
    for(var i = 0; i < values.length; i++) {
        if(values[i] == value) {
            index = i;
        }
    }
    if(index > -1) {
        return labels[index];
    }
    return "None";
}

function barChart(otuIds, values, labels) {
    var svg = d3.select("svg");
    console.log(values);

    svg.selectAll("*").remove();
    svg.selectAll("rect")
        .data(values)
        .enter().append("rect")
        .classed("bar", true)
        .attr("width", function(d) {
            return d * 2;
        })
        .on("mouseover", d => mouseover(lookupLabelForValue(values, labels, d)))
        .on("mouseout", mouseout)
        .attr("height", 22)
        .attr("x", 90)
        .attr("y", function(d, i) {
            return i * 27;
     });

     var yTextPadding = 20;
     svg.selectAll("valueslabels")
     .data(values)
     .enter()
     .append("text")
     .attr("class", "bartext")
     .attr("text-anchor", "middle")
     .attr("fill", "black")
     .attr("x", Math.max(...values) * 2 + 130)
     .attr("y", function(d,i) {
         return i * 27 + yTextPadding;
     })
     .text(function(d){
          return d;
     });

     console.log(otuIds);

     svg.selectAll("otuidslabels")
     .data(otuIds)
     .enter()
     .append("text")
     .attr("class", "bartext")
     .attr("text-anchor", "middle")
     .attr("fill", "black")
     .attr("x", 45)
     .attr("y", function(d,i) {
         return i * 27 + yTextPadding;
     })
     .text(function(d){
          return 'OTU ID ' + d;
     });

}

function renderMetadata(metadata) {
    var sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("");
    Object.entries(metadata).forEach(entry => {
        sampleMetadata.append("p").text(entry[0] + ": " + entry[1]);
    })
}

function clearMeta() {
    var sampleMetadata = d3.select("#sample-metadata");
    sampleMetadata.html("");
}

function clearBarChart() {
    svg.selectAll("*").remove();
}

function clearBubbleChart() {
    var bubbleChart = d3.select("#bubble");
    bubbleChart.html("");
}