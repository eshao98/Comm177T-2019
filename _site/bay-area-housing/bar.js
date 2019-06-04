/* 
=============================================================================
BAR CHART
=============================================================================
*/

// READING RHNA DATA FOR BAR CHARTS

var rhnaFields = ["vlpercent", "lowpercent", "modpercent", "abovepercent", "totalpercent"];

d3.csv("data/rhna-data.csv").then(function(data) {
	var jurisMap = {};
	
	data.forEach(function(d) { 
		var jurisdiction = d.jurisdiction;
		jurisMap[jurisdiction] = [];

		rhnaFields.forEach(function(field) {
			jurisMap[jurisdiction].push( +d[field].slice(0, -1));
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
	drawGraph(jurisMap);
});

var drawGraph = function(jurisMap) {
	// graph dimensions using Bostock's convention
	var margin = { top: 30, right: 50, bottom: 30, left: 50 },
		width = 550 - margin.left - margin.right,
		height = 250 - margin.top - margin.bottom;

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
		
		//yScale.domain( d3.extent(data) ); // dynamically scales
		yScale.domain([0,260])
		yAxisHandleForUpdate.call(yAxis);
		
		var bars = canvas.selectAll(".bar").data(data);

		// update with new data bars
		bars.enter()
			.append("rect")
				.attr("class", "bar")
				.style("fill", "purple")
				.attr("x", function(d, i) { return xScale( rhnaFields[i] ); })
				.attr("width", xScale.bandwidth())
				.attr("y", function(d, i) { return yScale(d); })
				.attr("height", function(d, i) { return height - yScale(d); });

		bars
			.on("mouseover", function() { tooltip.style("display", null); })
			.on("mouseout", function() { tooltip.style("displey", "none"); })
			.on("mousemove", function(d) {
				var xPosition = d3.mouse(this)[0] - 15;
				var yPosition = d3.mouse(this)[1] - 25;
				tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
				tooltip.select("text").text(d.y);
			})

		bars.transition()
			.duration(250)
			.attr("y", function(d) { return yScale(d); })
			.attr("height", function(d) { return height - yScale(d); });

		// clear
		bars.exit().remove();
	};

	var dropdownChange = function() {
		var selectedJurisdiction = d3.select(this).property("value"),
			selectedData = jurisMap[selectedJurisdiction];

		updateBars(selectedData);
	};

	// dropdown
	var jurisdictions = Object.keys(jurisMap).sort();
	var dropdown = d3.select("#bar")
		.insert("select", "svg")
		.on("change", dropdownChange);

	dropdown.selectAll("option")
			.data(jurisdictions)
		.enter().append("option")
			.attr("value", function(d) { return d; })
			.text(function (d) {
				return d[0].toUpperCase() + d.slice(1, d.length); // capitalize first letter
			});

	var initialData = jurisMap[ jurisdictions[0] ];
	updateBars(initialData);
};

