(async () => {

// Basic parameters of the svg
var margin = {
  top: 15,
  bottom: 15,
  left: 100,
  right: 100
};

var width = 900;
var height = 600;
var widthPerUnit;

var svgHeight = height + margin.top + margin.bottom;
var svgWidth = width + margin.left + margin.right;

var svg = d3.select('#svg-area')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight);


// Read and arrange the data

const req = new XMLHttpRequest();
var data = null;
const reqDone = new Promise((resolve)=>{
  req.addEventListener("load", function() {
    data = JSON.parse(this.responseText);
    resolve();
    widthPerUnit = width/(data.length+2);
  });
});
req.open("GET", "/data/data.json");
req.send();
await reqDone;

// Set scales

var totalGames = (d) => d.wins + d.draws + d.losses;
const maxTotalGames = d3.max(data, totalGames);

var xRange = d3.scaleLinear()
  .range([margin.left, width - margin.right])
  .domain([d3.min(data, d =>d.year)-0.5, d3.max(data, d=>d.year)+0.5]);
var yRangeLeft = d3.scaleLinear()
  .range([height - margin.top, margin.bottom])
  .domain([d3.min(data, d => d.points), d3.max(data, d =>d.points)]);
var yRangeRight = d3.scaleLinear()
  .range([margin.bottom, height - margin.top])
  .domain([maxTotalGames, 0])
var yRangeRightHeight = d3.scaleLinear()
  .range([0, height-margin.bottom-margin.top])
  .domain([0, maxTotalGames]);

// Create axes

var xAxis = d3.axisBottom(xRange)
  .tickFormat(d3.format(".0f"))
  // .tickValues(data.map(d => d.year-0.5))


var yAxisLeft = d3.axisLeft(yRangeLeft);
// console.log(yAxisLeft);

var yAxisRight = d3.axisRight(yRangeRight);

// Append the axes as G

svg.append('svg:g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
  .call(xAxis);

svg.append('svg:g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(' + (margin.left) + ',0)')
  .call(yAxisLeft);

svg.append('svg:g')
  .attr('class', 'y axis right')
  .attr('transform', 'translate('+(width - margin.right)+',0)')
  .call(yAxisRight)

// Create Bars or Line function

var lineFunc = d3.line()
  .x(d => xRange(d.year))
  .y(d => yRangeLeft(d.points));

function showTooltip(d,i) {
  const tooltip = document.querySelector("div.y"+d.year);
  tooltip.classList.add("tooltip-show");
}
function hideTooltip(d,i) {
  const tooltip = document.querySelector("div.y"+d.year);
  tooltip.classList.remove("tooltip-show");
}
// wins:
svg.append('svg:g')
  .selectAll('rect')
  .data(data)
  .enter()
  .append('svg:rect')
  .attr('x', d => xRange(d.year) - widthPerUnit/2)
  .attr('y', d => yRangeRight(totalGames(d)))
  .attr('width', widthPerUnit*0.9)
  .attr('height', d=> yRangeRightHeight(d.wins))
  .attr('class', d=> 'bar wins y'+d.year)
  .on('mouseover', showTooltip)
  .on('mouseout', hideTooltip);

//draws:
svg.append('svg:g')
  .selectAll('rect')
  .data(data)
  .enter()
  .append('svg:rect')
  .attr('x', d => xRange(d.year) - widthPerUnit/2)
  .attr('y', d=> yRangeRight(d.draws + d.losses))
  .attr('width', widthPerUnit*0.9)
  .attr('height', d=> yRangeRightHeight(d.draws))
  .attr('class', d=> 'bar draws y'+d.year)
  .on('mouseover', showTooltip)
  .on('mouseout', hideTooltip);

//losses:
svg.append('svg:g')
  .selectAll('rect')
  .data(data)
  .enter()
  .append('svg:rect')
  .attr('x', d => xRange(d.year) - widthPerUnit/2)
  .attr('y', d => yRangeRight(d.losses))
  .attr('width', widthPerUnit*0.9)
  .attr('height', d=> yRangeRightHeight(d.losses))
  .attr('class', d=>'bar losses y'+d.year)
  .on('mouseover', showTooltip)
  .on('mouseout', hideTooltip);

svg.append('svg:path')
  .attr('d', lineFunc(data))
  .attr('stroke', 'skyblue')
  .attr('stroke-width', 4)
  .attr('fill', 'none');

  svg.append("text")
  .attr("class", "x-label")
  .attr("text-anchor", "middle")
  .attr("x", width/2)
  .attr("y", height+2*margin.bottom)
  .text("Year");

  svg.append("text")
  .attr("class", "y-label-left")
  .attr("text-anchor", "middle")
  .attr("x", margin.left/2)
  .attr("y", height/2)
  .text("Points");

  svg.append("text")
  .attr("class", "y-label-right-wins")
  .attr("text-anchor", "middle")
  .attr("x", width - margin.right/2)
  .attr("y", height/2 - 14)
  .text("Wins");
  svg.append("text")
  .attr("class", "y-label-right-draws")
  .attr("text-anchor", "middle")
  .attr("x", width - margin.right/2)
  .attr("y", height/2)
  .text("Draws");
  svg.append("text")
  .attr("class", "y-label-right-losses")
  .attr("text-anchor", "middle")
  .attr("x", width - margin.right/2)
  .attr("y", height/2 + 14)
  .text("Losses");

// Create Circle group


// tooltip
const tooltipContainer = document.querySelector(".tooltip-container");
const titleHeight = document.querySelector("#Plot_title").offsetHeight;
console.log(titleHeight); 
for (const d of data) {
  const newTooltip = document.createElement("div");
  newTooltip.classList.add("tooltip");
  newTooltip.classList.add(`y${d.year}`)
  newTooltip.style.left = (xRange(d.year)+widthPerUnit/2)+"px";
  newTooltip.style.top = (2* margin.top+titleHeight)+"px";
  newTooltip.innerHTML = `<h2>${d.year}</h2>
<p>Coach: ${d.other.coach}</p>
<p>Placement: ${d.other.finished}</p>
<p>Points: ${d.points}</p>
<p>Wins: ${d.wins}</p>
<p>Draws: ${d.draws}</p>
<p>Losses: ${d.losses}</p>
`
  tooltipContainer.appendChild(newTooltip);

}
// Mouseover / mouseout




// Legend function

})();
