
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


/* 
=============================================================================
BAR CHART (DROPDOWN)
=============================================================================
*/

// BEGIN DRAWGRAPH FUNCTION

var drawGraph = function(juris) {
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
				.style("fill", "purple")
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
		updateBars(juris[jurisdictions[activeCity]]);
	})
};

