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

// LINKED HOVERING
var activeCity = 'Emeryville';

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
		.style("stroke", "#eda1ab")
		.attr("d", function(d) { return line(d.values); });

	citiesEnter.append("text")
		.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
		.attr("x", 4)
		.attr("dy", ".35em")
		.text(function(d) { return d.name; });

	citiesEnter.on("mouseover", function(d) {
		activeCity = d.name;
	})

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
	d3.select("#one .line")
		.style("stroke", "#2980B9")
		.style("opacity", "1")
		.style("stroke-width", "2px");

	d3.select("#one text")
		.text("one")
		.style("display", "block");

	d3.select("#two text")
		.style("display", "block");

	d3.select("#three text")
		.style("display", "block");

	d3.select("#two .line")
		.style("opacity", "1")
		.style("stroke", "#3498DB");

	d3.select("#three .line")
		.style("opacity", "1")
		.style("stroke", "#3498DB");
*/
}


/* 
=============================================================================
BAR CHART
=============================================================================
*/

// READING RHNA DATA FOR BAR CHARTS

var rhnaFields = ["vlpercent", "lowpercent", "modpercent", "abovepercent", "totalpercent"];

d3.csv("data/rhna-data.csv").then(function(data) {
	var juris = {};
	
	data.forEach(function(d) { 
		var jurisdiction = d.jurisdiction;
		juris[jurisdiction] = [];

		rhnaFields.forEach(function(field) {
			juris[jurisdiction].push( +d[field].slice(0, -1));
		});
		/*
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
		*/
	});
	drawGraph(juris);
});


// BEGIN DRAWGRAPH FUNCTION

var drawGraph = function(juris) {

	// x scale
	var xScale = d3.scaleBand()
		.domain(rhnaFields)
		.rangeRound([0, width])
		.padding(0.1);

	var yScale = d3.scaleLinear()
		.range([height, 0]);

	var canvas = d3.select("#bar")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// x-axis
	var xAxis = d3.axisBottom()
		.scale(xScale);

	canvas.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// y-axis
	var yAxis = d3.axisLeft()
		.scale(yScale);

	var yAxisHandleForUpdate = canvas.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	yAxisHandleForUpdate.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Value");

	// HANDLES UPDATE DATA
	var updateBars = function(data) {
		
		//yScale.domain( d3.extent(data) );// dynamically scales
		yScale.domain([0,100])
		yAxisHandleForUpdate.call(yAxis);
		
		var bars = canvas.selectAll(".bar").data(data);

		/*
		var tooltip = bars.append("g")
		  .attr("class", "tooltip")
		  .style("display", "none");
		    
		tooltip.append("rect")
		  .attr("width", 30)
		  .attr("height", 20)
		  .attr("fill", "white")
		  .style("opacity", 0.5);

		tooltip.append("text")
		  .attr("x", 15)
		  .attr("dy", "1.2em")
		  .style("text-anchor", "middle")
		  .attr("font-size", "12px")
		  .attr("font-weight", "bold");
		 */

		// update with new data bars
		bars.enter()
			.append("rect")
				.attr("class", "bar")
				.style("fill", "#eda1ab")
				.attr("x", function(d, i) { return xScale( rhnaFields[i] ); })
				.attr("width", xScale.bandwidth())
				.attr("y", function(d, i) { return yScale(d); })
				.attr("height", function(d, i) { return height - yScale(d); });

		/*
		bars
			.on("mouseover", function() { tooltip.style("display", null); })
			.on("mouseout", function() { tooltip.style("display", "none"); })
			.on("mousemove", function(d) {
				var xPosition = d3.mouse(this)[0] - 15;
				var yPosition = d3.mouse(this)[1] - 25;
				tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
				tooltip.select("text").text(d.y);
			})
		*/

		bars.transition()
			.duration(250)
			.attr("y", function(d) { return yScale(d); })
			.attr("height", function(d) { return height - yScale(d); });

		// clear
		bars.exit().remove();
	};

	var dropdownChange = function() {
		var selectedJurisdiction = d3.select(this).property("value"),
			selectedData = juris[selectedJurisdiction];
		updateBars(selectedData);
	};

	// dropdown
	var jurisdictions = Object.keys(juris).sort();
	var dropdown = d3.select("#bar")
		.insert("select", "svg")
		.on("change", dropdownChange);


	dropdown.selectAll("option")
		.data(jurisdictions)
		.enter().append("option")
		.attr("value", function(d) { return d; })
		.text(function (d) {
			return d;
		});

	var initialData = juris[ jurisdictions[0] ];
	console.log(initialData)
	updateBars(initialData);

	var linesvg = d3.select("#line")
	var cities = linesvg.selectAll(".city")
	cities.on("mouseover", function(d) {
		activeCity = d.name;
		dropdown.property("value", activeCity)
		updateBars(juris[activeCity]);
	})
};

