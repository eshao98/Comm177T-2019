// map viewport dimensions
var width = 800,
	height = 600,
	scale = 60000, 
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

var svg = d3.select("#map")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// zoom function from D3 Cookbook
var g = svg.append("g")
	.call(d3.zoom()
	.scaleExtent([1, 10])
	.on("zoom", zoomHandler));

function zoomHandler() { 
    var transform = d3.event.transform; 
    g.attr("transform", "translate(" + transform.x + "," + transform.y 
            + ")scale(" + transform.k + ")"); 
}; 

// tooltip
tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

// map colors
var color = d3.scaleThreshold()
	.domain([10, 25, 50, 75, 100])
	.range(["#7a0177", "#c51b8a", "#f768a1", "#fbb4b9", "#feebe2"]);

// creates basic map from geojson
d3.json("data/bay-area-zips.geojson").then(function(geojson) {
		// reading in csv data
	d3.csv("data/hwdata.csv").then(function(data) {
		data.forEach(function(d) { // iterate over data array to get numbers
				d.year = +d.year;
				d.zip = +d.zip;
				d.onebr = +d.onebr;
				d.twobr = +d.twobr;
				d.threebr = +d.threebr;
				d.fourbr = +d.fourbr;
				d.onehw = +d.onehw;
				d.twohw = +d.twohw;
				d.threehw = +d.threehw;
				d.fourhw = +d.fourhw;
		});
		initialData = data;
		drawBase();
		drawMap();
	});

	// drawing the base map

	function drawBase() {
		svg.selectAll("path")
		.data(geojson.features)
		.enter()
		.append("path")
			.attr("d", path)
			.attr("class", "zip")
	};

	function drawMap() {
		d3.selectAll(".zip")
		.remove();

		var selectedYear = document.getElementById("menu").value;
		var filteredData = initialData.filter(function(d){ return d.year == selectedYear; });

		var zips = svg.selectAll(".zip")
			.data(geojson.features)
			//.data(filteredData)
			.enter()
			.append("path")
				.attr("d", path)
				.attr("class", "zip");

		zips
		.data(filteredData)
		.style("fill", function(filteredData) {
			return color(filteredData.twohw)
		});

		d3.select(".year").text(selectedYear);

		};

	d3.select("#menu")
	.on("input", function() {
		drawMap();
	});

});