// map viewport dimensions
var width = 800,
	height = 600,
	scale = 80000, 
	// centered on SF (approximately)
	latitude = 37.7750,
	longitude = -122.4183;

// set up map projection, position map
var projection = d3.geoMercator()
	.center([longitude, latitude])
	//.rotate([-longitude, 0]) 
	//.parallels([24.6, 43.6])
	.scale(scale)
	.translate([width / 2, height / 2]);

var path = d3.geoPath()
	.projection(projection);

// tooltip
tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

// creating svg
var svg = d3.select("#map")
	.append("svg")
	.attr("width", "600px")
	.attr("height", height);

var g = svg.append("g")
	.call(d3.zoom()
	.scaleExtent([1, 10])
	.on("zoom", zoomHandler));

d3.json("data/bay-area-zips.geojson").then(function(geojson) {
	var zips = g.selectAll("path")
		.data(geojson.features)
		.enter().append("path")
		.attr("d", path);
})

// zoom function from D3 Cookbook
function zoomHandler() { 
    var transform = d3.event.transform; 
    g.attr("transform", "translate(" 
            + transform.x + "," + transform.y 
            + ")scale(" + transform.k + ")"); 
} 