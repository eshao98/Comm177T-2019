/* 
=============================================================================
MULTISERIES/DROPDOWN LINE PLOT
=============================================================================
*/

// set up margin using Mike Bostock's margin convention

var margin = {top: 20, right: 75, bottom: 30, left: 40},
	width = 800 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom,
	// set the ranges
	xScale = d3.scaleTime().range([0, width]),
	yScale = d3.scaleLinear().range([height, 0]),
	// parse year and format the dollars
	formatYear = d3.timeFormat("%Y"),
	parseDate = d3.timeParse("%Y"),
	formatDollar = d3.format("($.2f");

var hwData,
	filtered,
	transpose;

var line = d3.line()
	.x(function(d) { return xScale(d.year); })
	.y(function(d) { return yScale(d.wage); })
	.curve(d3.curveBasis);

var linesvg = d3.select("#line")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis = d3.axisBottom()
	.scale(xScale)
	linesvg.append("g")
		.attr("class", "x axis");

var yAxis = d3.axisLeft()
	.scale(yScale)
	.ticks(5)
	.tickFormat(formatDollar)
	.tickSize(-width - margin.left - margin.right)

linesvg.append("g")
	.attr("class", "y axis");

d3.select("#select")
	.on("change", change);


// READING HW DATA FOR LINE CHART
d3.csv("data/hw-by-city.csv").then(function(csv) {
	hwData = csv;
	update();
});

// READING RHNA DATA FOR BAR CHARTS
d3.csv("data/rhna-data.csv").then(function(csv) {
	rhnaData = csv;
});

function change() {
	d3.transition()
		.duration(500)
		.each(update);
}

function update() {
	d3.selectAll(".city")
	.remove();
	//var selectedType = document.getElementById("select").value;

	var nested = d3.nest()
		.key(function(d) { return d.type; })
		.map(hwData);
    
    var selectedType = document.getElementById("select").value
    var series = selectedType;

    var data = nested["$"+series];

    var typenames = d3.keys(data[0]).filter(function(key) {
		return (key !== "typename" && key !== "type" && key !== "year");
	});

    var transpose = typenames.map(function(name) {
		return {
			name: name,
			values: data.map(function(d) {
			return {year: parseDate(d.year), wage: +d[name]};
			})
		};
	});


    //var ymin = d3.min(transpose, function(c) { return d3.min(c.values, function(v) { return v.wage; }); });
    //var ymax = d3.max(transpose, function(c) { return d3.max(c.values, function(v) { return v.wage; }); });

	xScale.domain([
		d3.min(transpose, function(c) { return d3.min(c.values, function(v) { return v.year; }); }),
		d3.max(transpose, function(c) { return d3.max(c.values, function(v) { return v.year; }); })
	]);

    //yScale.domain([0.95*ymin,1.1*ymax]);
    yScale.domain([0,140]);

	var cities = linesvg.selectAll(".city")
		.data(transpose);

	var citiesEnter = cities.enter().append("g")
		.attr("class", "city")
		.attr("id", function(d) { return d.name; });

	citiesEnter.append("path")
		.attr("class", "line")
		.style("stroke", "#aaa")
		.attr("d", function(d) { return line(d.values); });

	citiesEnter.append("text")
		.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
		.attr("x", 4)
		.attr("dy", ".35em")
		.text(function(d) { return d.name; });

    var citiesUpdate = d3.selectAll(".city").transition(cities);

	citiesUpdate.select("path")
		.attr("d", function(d) { return line(d.values); });

    citiesUpdate.select("text")
		.attr("transform", function(d) { return "translate(" + xScale(d.values[d.values.length - 1].year) + "," + yScale(d.values[d.values.length - 1].wage) + ")"; });

	d3.transition(linesvg).select(".y.axis")
		.call(yAxis);

	d3.transition(linesvg).select(".x.axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	linesvg.selectAll("g")
		.classed("g-baseline", function(d) { return d == 0 });

/*
	d3.select("#Annualavg .line")
		.style("stroke", "#2980B9")
		.style("opacity", "1")
		.style("stroke-width", "2px");

	d3.select("#Annualavg text")
		.text("Annual avg")
		.style("display", "block");

	d3.select("#January text")
		.style("display", "block");

	d3.select("#May text")
		.style("display", "block");

	d3.select("#January .line")
		.style("opacity", "1")
		.style("stroke", "#3498DB");

	d3.select("#May .line")
		.style("opacity", "1")
		.style("stroke", "#3498DB");
*/
}

/* 
=============================================================================
BAR CHART
=============================================================================
*/


