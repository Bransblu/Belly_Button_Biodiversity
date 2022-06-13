function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    console.log(data);
    var samplesArray = data.samples;
    console.log(samplesArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samplesArray.filter(data => data.id == sample);
    console.log(filteredSamples);
    // 1b. Create a variable that filters the metadata array for the object with the desired sample number.
    metadata = data.metadata;
    var metaDataSample = metadata.filter(mdata => mdata.id == sample);
    console.log(metaDataSample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSamples[0];
    console.log(firstSample);
    // 2b. Create a variable that holds the first sample in the metadata array.
    metaDataFirst = metaDataSample[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // 3b. Create a variable that holds the washing frequency.
    var washFreq = parseInt(metaDataFirst.wfreq);

    console.log(washFreq);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0, 10).map(id => "OTU " + id).reverse();
    console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: 'h',
    };

 barData = [trace1];   
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Sample value"},
      yaxis: { title: "OTU ID"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout, {responsive: true})

// Bar and Bubble charts
// Create the buildCharts function.
//function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  //d3.json("samples.json").then((data) => {
//d3.json('https://raw.githubusercontent.com/plotly/datasets/master/custom_heatmap_colorscale.json',    

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    //Plotly.newPlot(); 

    // 1. Create the trace for the bubble chart.
   
    var trace2 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Portland"
      }
      
    };
  var bubbleData = [trace2];
    // 2. Create the layout for the bubble chart.
    
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false,
      xaxis: { title: "OTU Ids"}
    };
            
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout, {responsive: true}); 
 
    var gaugeData = [
      {
        title: {text: "Belly Button Washing Frequency<br>Scrubs Per Week"},
        value: washFreq,
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
          axis: { range: [0, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red"},
            { range: [2, 4], color:  "lime"},
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "lightseagreen"},
            { range: [8, 10], color: "forestgreen"}]
          
          }
        }];
        
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 500, height: 400, margin: {t: 0, b: 0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  })}
