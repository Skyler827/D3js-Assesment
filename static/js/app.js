(async () => {

// Basic parameters of the svg
var margin = {
  top: 15,
  bottom: 15,
  left: 70,
  right: 15
};

var width = 900;
var height = 600;

var svgHeight = height + margin.top + margin.bottom;
var svgWidth = width + margin.left + margin.right;

var svg = d3.select('#svg-area')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight);

var tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .attr('opacity', '0');

// Read and arrange the data

const req = new XMLHttpRequest();
var data = null;
const reqDone = new Promise((resolve)=>{
  req.addEventListener("load", function() {
    data = JSON.parse(this.responseText);
    resolve();
  });
});
req.open("GET", "/data/data.json");
req.send();
await reqDone;

// Set scales

for (season of data) {
  if (minYear === null || minYear > season.year) minYear = season.year;
  if (maxYear === null || maxYear < season.year) maxYear = season.year;
  const seasonGames = season.wins + season.draws + season.losses;
  if (maxTotalGames === null || maxTotalGames < seasonGames) maxTotalGames = seasonGames;
  if (minPoints === null || season.points < minPoints) minPoints = season.points;
  if (maxPoints === null || season.points > maxPoints) maxPoints = season.points;
}
var xRange = d3.scaleLinear()
  .range([margin.left, width - margin.right])
  .domain([d3.min(data, d =>d.year), d3.max(data, d=>d.year)]);
var yRange = d3.scaleLinear()
  .range([height - margin.top, margin.bottom])
  .domain([d3.min(data, d => d.points), d3.max(data, d =>d.points)]);

// Create axes

var xAxis = d3.axisBottom(xRange);

var yAxis = d3.axisLeft(yRange);

// Append the axes as G

svg.append('svg:g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
  .call(xAxis);

svg.append('svg:g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(' + (margin.left) + ',0)')
  .call(yAxis);

// Create Bars or Line function

var lineFunc = d3.line()
  .x(d => xRange(d.year))
  .y(d => yRange(d.score));

svg.append('svg:path')
  .attr('d', lineFunc(data))
  .attr('stroke', 'blue')
  .attr('stroke-width', 2)
  .attr('fill', 'none');

// Create Circle group




// Mouseover / mouseout



// tooltip



// Legend function

})();
