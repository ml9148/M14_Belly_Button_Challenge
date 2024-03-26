const WebData = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
let data;

function GetData(url) {
  return d3.json(url);
}

function DashBoard() {
  const dropdown = d3.select("#selDataset");

  GetData(WebData)
    .then(d => {
      data = d; 
      const names = data.names;
      names.forEach(name => {
        dropdown.append("option")
          .text(name)
          .property("value", name);
      });
      const initialName = names[0];
      ChartsAndMetadata(initialName);
    })
    .catch(error => console.error("Error fetching data:", error));
}

function ChartsAndMetadata(sampleId) {
  metadataupdate(sampleId);
  barchartcreate(sampleId);
  bubblechartcreate(sampleId);
}

function metadataupdate(sampleId) {
  const metadata = data.metadata.find(sample => sample.id == sampleId);
  console.log(metadata);

  const metadataPanel = d3.select("#sample-metadata");
  metadataPanel.html("");

  Object.entries(metadata).forEach(([key, value]) => {
    console.log(key, value);
    metadataPanel.append("p").text(`${key}: ${value}`);
  });
}

function barchartcreate(sampleId) {
  const sampleData = data.samples.find(sample => sample.id == sampleId);
  const { otu_ids, otu_labels, sample_values } = sampleData;

  console.log(otu_ids, otu_labels, sample_values);

  const barTrace = {
    x: sample_values.slice(0, 10).reverse(),
    y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
    text: otu_labels.slice(0, 10).reverse(),
    type: 'bar',
    orientation: 'h'
  };

  const barLayout = {
    title: 'Bacterial Cultures Count (Top 10)',
    xaxis: { title: 'Count' },
    yaxis: { title: 'OTU ID' }
  };

  Plotly.newPlot('bar', [barTrace], barLayout);
}

function bubblechartcreate(sampleId) {
  const sampleData = data.samples.find(sample => sample.id == sampleId);
  const { otu_ids, otu_labels, sample_values } = sampleData;

  console.log(otu_ids, otu_labels, sample_values);

  const bubbleTrace = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: 'Viridis'
    }
  };

  const bubbleLayout = {
    title: 'Bacteria Cultures Per Test Subject ID',
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Count' },
    hovermode: 'closest'
  };

  Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);
}

function optionChanged(newSampleId) {
  console.log(newSampleId);
  ChartsAndMetadata(newSampleId);
}

DashBoard();