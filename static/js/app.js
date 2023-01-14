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
    console.log(data);
    resolve();
  });
});
req.open("GET", "/data/data.json");
req.send();
await reqDone;

// Set scales

// X axis: from min year to max year, inclusive
// left Y axis: from zero to maxTotalGames, inclusive
// right Y axis: from minPoints to maxPoints
minYear = null;
maxYear = null;
maxTotalGames = null;
minPoints = null;
maxPoints = null;
for (season of data) {
  if (minYear === null || minYear > season.year) minYear = season.year;
  if (maxYear === null || maxYear < season.year) maxYear = season.year;
  const seasonGames = season.wins + season.draws + seasons.losses;
  if (maxTotalGames === null || maxTotalGames < seasonGames) maxTotalGames = seasonGames;
  if (minPoints === null || season.points < minPoints) minPoints = season.points;
  if (maxPoints === null || season.points > maxPoints) maxPoints = season.points;
}

// Create axes



// Append the axes as G





// Create Bars or Line function




// Create Circle group




// Mouseover / mouseout



// tooltip



// Legend function

})
