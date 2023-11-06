// Function to build the charts
function buildCharts(sample) {
    // Use D3 to fetch the data from the provided URL
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      // Filter the data for the object with the desired sample number
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
  
      // Get the necessary data for the charts
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // Build the bar chart
      var barData = [{
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
      }];
  
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
  
      // Build the bubble chart
      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }];
  
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30 }
      };
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
  }
  
  // Function to display the metadata
  function showMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      var metadata = data.metadata;
      var result = metadata.filter(meta => meta.id.toString() === sample)[0];
      var metadataPanel = d3.select("#sample-metadata");
  
      // Clear existing metadata
      metadataPanel.html("");
  
      // Add each key-value pair to the metadata panel
      Object.entries(result).forEach(([key, value]) => {
        metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  // Function to handle the change event when a new sample is selected
  function optionChanged(newSample) {
    buildCharts(newSample);
    showMetadata(newSample);
  }
  
  // Initialize the dashboard
  function init() {
    var selector = d3.select("#selDataset");
  
    // Populate the select options
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      showMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard on page load
  init();
  