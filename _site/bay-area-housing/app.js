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

// tooltip
tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);


// legend
var legendText = ["0", "25", "50", "75", "100"];
var legendColors = ["#7a0177", "#c51b8a", "#f768a1", "#fbb4b9", "#feebe2"];


// creating svg
var svg = d3.select("#map")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// zoom function from D3 Cookbook

var g = svg.append("g")
	.call(d3.zoom()
	.scaleExtent([1, 15])
	.on("zoom", zoomHandler));

function zoomHandler() { 
    var transform = d3.event.transform; 
    g.attr("transform", "translate(" + transform.x + "," + transform.y 
            + ")scale(" + transform.k + ")"); 
} 


// loading geojson data for Bay Area zips
d3.json("data/bay-area-zips.geojson").then(function(geojson) {

	// reading in housing wage data
	d3.csv("data/data.csv").then(function(data) {
		
		data.forEach(function(d) { // iterate over data array to get numbers
			d.year = +d.year;
			d.zip = +d.zip;
			d["1br"] = +d["1br"];
			d["2br"] = +d["2br"];
			d["3br"] = +d["3br"];
			d["4br"] = +d["4br"];
			d["1br-hw"] = +d["1br-hw"];
			d["2br-hw"] = +d["2br-hw"];
			d["3br-hw"] = +d["3br-hw"];
			d["4br-hw"] = +d["4br-hw"];
			d.county = d.county;
			d.city = d.city;
		});
		/*
		TODO: Create a json object with mulltiple levels
		of nesting

		{ 2011: { 
			94941: { <stuff> },
			95932: { <stuff> }
			}
          2012: { etc. etc.}
		}

		*/
		var dataByZipByYear = d3.nest()
			.key(function(d) { return d.zip; })
			.key(function(d) { return d.year; })
			.entries(data);
			//.map(data);
		
		console.log(dataByZipByYear);

		// map colors
		var color = d3.scaleThreshold()
			.domain([10, 25, 50, 75, 100])
			.range(legendColors);

		var zips = g.selectAll("path")
		.data(geojson.features)
		.enter()
		.append("path")
		.attr("d", path)

		.on("mouseover", function(d) {
			tooltip.transition()
			.duration(200)
			.style("opacity", 1)
			.text("test")
			.style("left", (d3.event.pageX + 15) + "px")
			.style("top", (d3.event.pageY - 30) + "px");
		})
		.on("mouseout", function(d) {
			tooltip.transition()
			.duration(200)
			.style("opacity", 0);
		})

	function update(year){
		slider.property("value", year);
		d3.select(".year").text(year);
		//zips.style("fill", function(d) {
		//	console.log(d.properties.years[year]) // FILL THIS IN
		//});
	}

	var slider = d3.select(".slider")
		.append("input")
		.attr("type", "range")
		.attr("min", 2011)
		.attr("max", 2019)
		.attr("step", 1)
		.on("input", function() {
			var year = this.value;
			update(year);
		});

		update(2011);
	});

});