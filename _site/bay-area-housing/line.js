// storing line plot dimensions
var wLine =  550,
	hLine = 500,
	marginLine = {top: 40, right: 10, bottomM:20, left:50};

var dataFormat = d3.time.format("%Y"),
	// scaling width and height
	xScaleLine = d3.time.scale()
				.range([marginLine.left, wLine - marginLine.right - marginLine.left]),
	yScaleLine = d3.scale.line()
				.range([marginLine.top, hLine - marginLine.bottom]),
	//create axes
	xAxisLine = d3.svg.axis()
				.scale(xScaleLine)
				.orient("bottom")
				.ticks(5)
				.tickFormat(function(d) {
					return dateFormat(d);
				}),
	yAxisLine = d3.svg.axis()
				.scale(yScaleLine)
				.orient("left");

// line labels
var xLabelLine = wLine - marginLine.right - marginLine.left;

// config line generator
var line = d3.svg.line()
	.x(function(d) {
		return xScaleLine(dateFormat.parse(d.year)); // REPLACE YEAR
	})
	.y(function(d) {
		return yScaleLine(+d.amount); // REPLACE AMOUNT
	})

// empty svg

var linechart = d3.select("#line")
				.append("svg")
				.attr("width", wLine)
				.attr("height",hLine);

var dataset;
var activeCity;

// loading data

d3.csv("hw-by-city.csv", function(data) {

	var years = ["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];
	dataset = [];

	for (var i=0; i < data.length; i++ {
		// creating new object with city name & empty array
		dataset[i] = {
			district: data[i].district,
			
		}
	})
});