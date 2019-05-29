// map viewport dimensions
var width = 800,
	height = 600,
	scale = 270000, 
	latitude = 37.7750,
	longitude = -122.4183;

// creating svg
var svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// set up map projection, position map
var projection = d3.geoAlbers()
	.center([0, latitude]) // sets single standard parallel at latitude
	.rotate([-longitude, 0]) // sets longitude of origin
	.parallels([24.6, 43.6])
	.scale(scale)
	.translate([width / 2, height / 2]);

var path = d3.geoPath()
	.projection(projection);

/* ZOOM
var g = svg.apppend("g")
	.call(d3.zoom()
	.scaleExtent([1, 10])
	.on("zoom", zoomHandler));
*/

d3_queue.queue()
	.defer(d3.json, "data/bay-area-topo.json")
	.defer(d3.csv, "data/test-data.csv")
	.await(function(error, map_json, data_csv) {
		console.log(map_json)
	});