// map viewport dimensions
var wMap = 900,
	hMap = 700,
	scale = 50000, 
	// centered on SF (approximately)
	latitude = 37.7347,
	longitude = -122.2455,
	lowColor = "#edf8b1",
	highColor = "#c51b8a",
	rate = "twohw", // rate you want to test
	minVal = d3.format("$,")(0),
	maxVal = d3.format("$,")(100);

// set up map projection, position map
var projection = d3.geoMercator()
	.center([longitude, latitude])
	//.rotate([-longitude, 0]) 
	//.parallels([24.6, 43.6])
	.scale(scale)
	.translate([wMap / 2, hMap / 2]);

var path = d3.geoPath()
	.projection(projection);

var map = d3.select("#map")
	.append("svg")
	.attr("width", wMap)
	.attr("height", hMap);

// tooltip
tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

// map colors
var color = d3.scaleLinear()
	.domain([10, 100])
	.range([lowColor, highColor]);

// legend
var w = 130, h = 200;

var key = d3.select("#map")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
	.attr("class", "legend");

var legend = key.append("defs")
	.append("svg:linearGradient")
	.attr("id", "gradient")
	.attr("x1", "100%")
	.attr("y1", "0%")
	.attr("x2", "100%")
	.attr("y2", "100%")
	.attr("spreadMethod", "pad");

legend.append("stop")
	.attr("offset", "0%")
	.attr("stop-color", highColor)
	.attr("stop-opacity", 1);
legend.append("stop")
	.attr("offset", "100%")
	.attr("stop-color", lowColor)
	.attr("stop-opacity", 1);

key.append("rect")
	.attr("width", w-100)
	.attr("height", h)
	.style("fill", "url(#gradient)")
	.attr("transform", "translate(30,10)");

var y = d3.scaleLinear()
	.range([h, 0])
	.domain([0, 100]);

var yAxisMap = d3.axisLeft(y)
	.scale(y)
	.ticks(5);

key.append("g")
	//.attr("class", "y axis")
	.attr("transform", "translate(25,10)")
	.call(yAxisMap);


// creates basic map from geojson
d3.json("data/bay-area-zips.geojson").then(function(geojson) {
		// reading in csv data
	d3.csv("data/data.csv").then(function(data) {
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
				d.vlrhna = +d.vlrhna;
				d.vltotal = +d.vltotal;
				d.vlpercent = +d.vlpercent.slice(0, -1);
				d.lowrhna = +d.lowrhna;
				d.lowtotal = +d.lowtotal;
				d.lowpercent = +d.lowpercent.slice(0, -1);
				d.modrhna = +d.modrhna;
				d.modtotal = +d.modtotal;
				d.modpercent = +d.modpercent.slice(0, -1);
				d.aboverhna = +d.aboverhna;
				d.abovetotal = +d.abovetotal;
				d.abovepercent = +d.abovepercent.slice(0, -1);
				d.totalrhna = +d.totalrhna;
				d.totaltotal = +d.totaltotal;
				d.totalpercent = +d.totalpercent.slice(0, -1);
				
		});
		//console.log(data)
		initialData = data;
		drawBase();
		drawMap();
	});

	// drawing the base map with no colors (prep for case if zip code has no data)
	function drawBase() {
		map.selectAll("path")
		.data(geojson.features)
		.enter()
		.append("path")
			.attr("d", path)
			.attr("stroke", "#fff")
			.attr("stroke-width", "1")
			//.attr("class", "zip")
			.attr("fill", "#f6f6f6")
	};

	function drawMap() {
		d3.selectAll(".zip")
		.remove(); // clears prev year data

		var selectedYear = document.getElementById("slider").value;
		//var filteredData = initialData.filter(function(d){ return d.year == selectedYear; });

		var nested = d3.nest()
			.key(function(d) { return d.year; })
			.map(initialData);

		var filteredData = nested['$'+selectedYear]

		var zips = map.selectAll(".zip")
			.data(geojson.features)
			//.data(filteredData)
			.enter()
			.append("path")
				.attr("d", path)
				.attr("class", "zip")
				.attr("fill", "#f6f6f6");

		// updates colors and tooltip
		zips
		.data(filteredData)
		.style("fill", function(filteredData) {
			return color(filteredData[rate])
		})

		.on("mouseover", function(filteredData) {
			tooltip.transition()
			.duration(200)
			.style("opacity", 1);
			tooltip.html(
				"<b>" + filteredData.zip + "</b><br>"
				+ "<p><b>" + filteredData.city + ", " + filteredData.county + "</b><br>" 
				+ filteredData.year + " Housing Wage: $" + filteredData[rate]
				)
			.style("left", (d3.event.pageX - 20) + "px")
			.style("top", (d3.event.pageY + 20) + "px");
		})

		.on("mouseout", function(d) {
			tooltip.transition()
			.duration(200)
			.style("opacity", 0);
		});

		d3.select(".year").text(selectedYear);
		};

	d3.select("#slider")
	.on("input", function() {
		drawMap();
	});

});
