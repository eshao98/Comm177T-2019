var width = 700;
var height = 580;

// creating svg
var svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// append empty placeholder g element to svg
// g will contain geometry elements
var g = svg.append("g")