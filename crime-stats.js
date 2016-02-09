window.onload = function init() {

	var margin = {top: 40, right: 20, bottom: 40, left: 50},
	    width = 960 - margin.left - margin.right,
	    height = 600 - margin.top - margin.bottom;
	
	graph1(seattleData, margin, width, height);
	graph2(seattleData, margin, width, height);
	graph3(seattleData, margin, width, height);
};

function graph1(seattleData, margin, width, height) {
	var x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);
	var x1 = d3.scale.ordinal();
	var y = d3.scale.linear().range([height, 0]);

	var data = prepDistrictData(seattleData);
	var districtNames = d3.keys(data[0]).filter(function(key) { return key !== "Month"; });

	data.forEach(function(d) {
		d.district = districtNames.map(function(name) {
			return {name: name, value: +d[name]};
		});
	})

	x0.domain(data.map(function(d) { return d.Month; }));
	x1.domain(districtNames).rangeRoundBands([0, x0.rangeBand()]);
	y.domain([0, d3.max(data, function(d) { return d3.max(d.district, function(d) { return d.value; }); })]);

	setupSvg1("div.graph1", data, x0, x1, y, margin, width, height, districtNames.slice());
}

function graph2(seattleData, margin, width, height) {
	var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
	var y = d3.scale.linear().range([height, 0]);
	var data = prepTimeData(seattleData);
	var hourNames = _.map(data, function(d) {
		return d.name;
	});

	x.domain(hourNames);
	y.domain([0, d3.max(data, function(d) { return d.value; })]);

	setupSvg2("div.graph2", data, x, y, margin, width, height);
}

function graph3(seattleData, margin, width, height) {
	var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
	var y = d3.scale.linear().rangeRound([height, 0]);
	var data = prepStackedTimeData(seattleData);
	var hourNames = _.map(data, function(d) {
		return d.name;
	});

	//x.domain(hourNames);
//	y.domain([0, d3.max(data, function(d) { return d.value; })]);

	setupSvg3("div.graph3", data, x, y, margin, width, height);
}

function setupSvg1 (appendPoint, data, x0, x1, y, margin, width, height, legendData) {

	var color = d3.scale.category20();

	var xAxis = d3.svg.axis()
	    .scale(x0)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(d3.format(".2s"));

	var svg = d3.select(appendPoint).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "axis-label")
		.attr("y", 40)
		.attr("x", width / 2)
		.style("text-anchor", "end")
		.text("Month");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("class", "axis-label")
		.attr("x", -height / 2.2)
		.attr("y", -40)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text("No. of Offences");

	svg.append("text")
		.attr("x", width / 2)
		.attr("y", -20)
		.style("text-anchor", "middle")
		.attr("class", "title")
		.text('Monthly Offences by Seattle District Code, Summer 2014');

	var state = svg.selectAll(".state")
		.data(data)
		.enter().append("g")
		.attr("class", "state")
		.attr("transform", function(d) { return "translate(" + x0(d['Month']) + ",0)"; });

	state.selectAll("rect")
		.data(function(d) { return d.district; })
		.enter().append("rect")
		.attr("width", x1.rangeBand())
		.attr("x", function(d) { return x1(d.name); })
		.attr("y", function(d) { return y(d.value); })
		.attr("height", function(d) { return height - y(d.value); })
		.style("fill", function(d) { return color(d.name); });

	var legend = svg.selectAll(".legend")
		.data(legendData)
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(20," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
}

function setupSvg2 (appendPoint, data, x, y, margin, width, height) {
	var color = d3.scale.category20();
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(d3.format(".2s"));

	var svg = d3.select(appendPoint).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "axis-label")
		.attr("y", 40)
		.attr("x", width / 2)
		.style("text-anchor", "end")
		.text("Hour");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("class", "axis-label")
		.attr("x", -height / 2.2)
		.attr("y", -40)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text("No. of Offences");

	svg.append("text")
		.attr("x", width / 2)
		.attr("y", -20)
		.style("text-anchor", "middle")
		.attr("class", "title")
		.text('Hourly Offences in Seattle, Summer 2014');

	svg.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { 
			return x(d.name); 
		})
		.attr("width", x.rangeBand())
		.attr("y", function(d) { 
			return y(d.value);
		})
		.attr("height", function(d) {
			return height - y(d.value); 
		})
		.style("fill", color);
}

function setupSvg3 (appendPoint, data, x, y, margin, width, height) {

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(d3.format(".0%"));

	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var color = d3.scale.category20();
	color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Hour"; }));
	data.forEach(function(d) {
		var y0 = 0;
		d.values = color.domain().map(function(name) { 
			return {name: name, y0: y0, y1: y0 += +d[name]};
		});
		d.values.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
	});

	//data.sort(function(a, b) { return b.values[0].y1 - a.values[0].y1; });

	x.domain(data.map(function(d) { return d.Hour; }));

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "axis-label")
		.attr("y", 40)
		.attr("x", width / 2)
		.style("text-anchor", "end")
		.text("Hour");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("class", "axis-label")
		.attr("x", -height / 2.2)
		.attr("y", -40)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text("% Offences");

	svg.append("text")
		.attr("x", width / 2)
		.attr("y", -20)
		.style("text-anchor", "middle")
		.attr("class", "title")
		.text('Normalised Hourly Offences in Seattle by District Code, Summer 2014');
	
	var state = svg.selectAll(".state")
		.data(data)
		.enter().append("g")
		.attr("class", "state")
		.attr("transform", function(d) { return "translate(" + x(d.Hour) + ",0)"; });

	state.selectAll("rect")
		.data(function(d) { return d.values; })
		.enter().append("rect")
		.attr("width", x.rangeBand())
		.attr("y", function(d) { return y(d.y1); })
		.attr("height", function(d) { return y(d.y0) - y(d.y1); })
		.style("fill", function(d) { return color(d.name); });


	var legend = svg.select(".state:last-child").selectAll(".legend")
		.data(function(d) { return d.values; })
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d) { return "translate(" + x.rangeBand() / 2 + "," + y((d.y0 + d.y1) / 2) + ")"; });

	legend.append("line")
		.attr("x1", 10)
		.attr("x2", 27);

	legend.append("text")
		.attr("x", 33)
		.attr("dy", ".35em")
		.text(function(d) { return d.name; });
}

function prepDistrictData (data) {
	var length = data['Month'].length;
	var months = [createMonth('June'), createMonth('July'), createMonth('August')];
	
	for (var i = 0; i < length; i++) {
		var d = data['District.Sector'][i];
		var m = data['Month'][i];
		var monthName = 'M'+m;
		if (d === '') d = 'N-A';
		_.find(months, function(month) {
				return month.Month === displayMonth(monthName);
			}
		)[d]++;

	};
	return months;
}

function prepTimeData (data) {
	var length = data['Month'].length;
	var hours = createHours();
	
	for (var i = 0; i < length; i++) {
		var date = data['Occurred.Date.or.Date.Range.Start'][i];
		var t = date.substring(11,13) + date.substring(20) 
		_.find(hours, function(hour) {
				return t === hour.name;
			}
		).value++;
	};
	return hours;
}

function prepStackedTimeData (data) {
	var length = data['Month'].length;
	var hours = [
		createDistrictHour('12AM'),
		createDistrictHour('01AM'),
		createDistrictHour('02AM'),
		createDistrictHour('03AM'),
		createDistrictHour('04AM'),
		createDistrictHour('05AM'),
		createDistrictHour('06AM'),
		createDistrictHour('07AM'),
		createDistrictHour('08AM'),
		createDistrictHour('09AM'),
		createDistrictHour('10AM'),
		createDistrictHour('11AM'),
		createDistrictHour('12PM'),
		createDistrictHour('01PM'),
		createDistrictHour('02PM'),
		createDistrictHour('03PM'),
		createDistrictHour('04PM'),
		createDistrictHour('05PM'),
		createDistrictHour('06PM'),
		createDistrictHour('07PM'),
		createDistrictHour('08PM'),
		createDistrictHour('09PM'),
		createDistrictHour('10PM'),
		createDistrictHour('11PM')
	];
	
	for (var i = 0; i < length; i++) {
		var d = data['District.Sector'][i];
		if (d === '') d = 'N/A';
		var date = data['Occurred.Date.or.Date.Range.Start'][i];
		var t = date.substring(11,13) + date.substring(20) 
		var dh = _.find(hours, function(hour) {
				return t === hour.Hour;
			}
		)[d]++;
	};
	return hours;
}

function createMonth(monthName) {
	return {
		'Month': monthName,
		'J': 0,
		'Q': 0,
		'B': 0,
		'L': 0,
		'F': 0,
		'D': 0,
		'R': 0,
		'K': 0,
		'C': 0,
		'S': 0,
		'E': 0,
		'U': 0,
		'N': 0,
		'W': 0,
		'M': 0,
		'O': 0,
		'G': 0,
		'N-A': 0,
		'99': 0
	};
}

function createHours() {
	return [
		{name: '12AM', value: 0},
		{name: '01AM', value: 0},
		{name: '02AM', value: 0},
		{name: '03AM', value: 0},
		{name: '04AM', value: 0},
		{name: '05AM', value: 0},
		{name: '06AM', value: 0},
		{name: '07AM', value: 0},
		{name: '08AM', value: 0},
		{name: '09AM', value: 0},
		{name: '10AM', value: 0},
		{name: '11AM', value: 0},
		{name: '12PM', value: 0},
		{name: '01PM', value: 0},
		{name: '02PM', value: 0},
		{name: '03PM', value: 0},
		{name: '04PM', value: 0},
		{name: '05PM', value: 0},
		{name: '06PM', value: 0},
		{name: '07PM', value: 0},
		{name: '08PM', value: 0},
		{name: '09PM', value: 0},
		{name: '10PM', value: 0},
		{name: '11PM', value: 0}
	];
}

function createDistrictHour(hourName) {
	return {
		'Hour': hourName,
		'J': 0,
		'Q': 0,
		'B': 0,
		'L': 0,
		'F': 0,
		'D': 0,
		'R': 0,
		'K': 0,
		'C': 0,
		'S': 0,
		'E': 0,
		'U': 0,
		'N': 0,
		'W': 0,
		'M': 0,
		'O': 0,
		'G': 0,
		'N/A': 0,
		'99': 0
	};
}

function displayMonth(num) {
	var displayName = '';
  	if (num === 'M6') displayName = 'June';
  	else if (num === 'M7') displayName = 'July';
  	else if (num === 'M8') displayName = 'August';
  	return displayName;
}