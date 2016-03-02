/********** SHOW THE DATA *************/

//set up the globals
var settings = {}
	stored_history = {}
	ignored_websites = ['newtab','extensions','history','settings','']
	good_websites = []
	bad_websites = []
	
/*
 * @desc boot up the whole thing
*/
function start(){
	getStoredHistory();
	getUserSettings();
	getIgnoredWebsites();
}
start();

/*
 * @desc gets the stored history.
 * calls getTimeSpentOnWebsites()
 * @requires object stored_history from collectData.js
 * @return void
*/
function getStoredHistory(){
	chrome.storage.local.get('stored_history',function(object){
		if(chrome.runtime.lastError){
			console.log("Runtime error.");
		}
		var stored_data = object;
		if(stored_data){
			if(Object.keys(stored_data).length){
				stored_history = stored_data['stored_history'];
				getTimeSpentOnWebsites();
			}
			else{
				d3.select(".main-data")
					.append("h1")
					.text("You don't have any data yet today. Get on the net!")
			}
		}
	})
}

/*
 * @desc gets the ignored websites set up by user in settings.
 * Pusshes the websites into a global array ignored_websites
 * @requires object settings from main.js
 * @return void
*/
function getIgnoredWebsites(){
	chrome.storage.local.get('settings',function(object){
		if(chrome.runtime.lastError){
			console.log("Runtime error.");
		}
		var stored_settings = object;
		if(stored_settings){
			if(Object.keys(stored_settings).length){
				for(i in stored_settings){
					for(var key in stored_settings[i]){	
						if(stored_settings[i][key]['type'] == 'ignore'){
							ignored_websites.push(stored_settings[i][key]["website"]);
						}
						else if(stored_settings[i][key]['type'] == 'good'){
							good_websites.push(stored_settings[i][key]["website"]);
						}
						else if(stored_settings[i][key]['type'] == 'bad'){
							bad_websites.push(stored_settings[i][key]["website"]);
						}
					}
				}
			}
		}
	})
}

//get user settings
function getUserSettings(){
	chrome.storage.local.get('settings',function(object){
		if(chrome.runtime.lastError){
			console.log("Runtime error.");
		}
		var stored_settings = object;
		if(stored_settings){
			if(Object.keys(stored_settings).length){
				settings = stored_settings['settings'];
			}
		}
	})
}

/*
 * @desc calculate today
 * @return a date as 15/2/2016
*/	
function getToday(){
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	var today = year+"/"+month+"/"+day;
	return today;
}

//attach click event on insights
var insights = document.querySelector(".bubble-container");
insights.addEventListener("click", function(e){
	d3.select("body")
		.append("div")
		.attr("id","insights")
		.append("p")
		.text("meAnalytics")
		.call(function(){
	    	buildInsights()
		});
    d3.select("#insights")
	.append("button")
	.classed("close",true)
	.on('click',function(){
    	d3.select("#insights").transition()
	    	.duration(1500)
	    	.style('opacity',0)
	    	.remove()
	});
	d3.select("#insights").transition()
		.duration(1500)
		.style('opacity',1);
		
},false);

//build insights meAnalytics
function buildInsights(){
	d3.select("#insights")
		.append("p")
		.text("this is interesting data")
}

//attach click on close
var close_insights = document.querySelector(".bubble-container .close");
close_insights.addEventListener("click", function(e){
	insights.style.display = "none";
},false)


//attach click event on general graph
var general_graphs = document.querySelector(".general-charts");
general_graphs.addEventListener("click", function(e){
	d3.select("#good-bad-chart").remove()
	d3.select("body")
		.append("div")
		.attr("id","good-bad-chart")
		.append("p")
		.text("good vs bad websites")
		.call(function(){
	    	getGoodBadGraph()
		})
    d3.select("#good-bad-chart")
	.append("button")
	.classed("close",true)
	.on('click',function(){
    	d3.select("#good-bad-chart").transition()
	    	.duration(1500)
	    	.style('opacity',0)
	    	.remove()
	})
	d3.select("#good-bad-chart").transition()
		.duration(1500)
		.style('opacity',1);
		
	setTimeout(function(){
		d3.select(".bubble-container").transition()
			.duration(1000)
			.style('display','block')
	}, 2000);
	
},false)

//process data for good vs bad websites
function getGoodBadWebsitesData(){
	
	var data = [];
	for(i in stored_history){
		time_spent_on_good_websites = 0;
		time_spent_on_bad_websites = 0;
		console.log(i)
		for(key of Object.keys(stored_history[i])){			
			if(isInArray(stored_history[i][key]['url'],good_websites)){
				time_spent_on_good_websites += stored_history[i][key]['time']
			}
			else if(isInArray(stored_history[i][key]['url'],bad_websites)){
				time_spent_on_bad_websites += stored_history[i][key]['time']
			}
		}
		data.push({'date':new Date(i),'Good Websites':+(time_spent_on_good_websites / 3600).toFixed(1), 'Bad Websites':+(time_spent_on_bad_websites / 3600).toFixed(1)});
	}
	return data.sort(sortByDateAscending);
	
}
function sortByDateAscending(a, b) {
    return a.date - b.date;
}

//build the good bad graph
function getGoodBadGraph(){
	
	var	margin = {top: 20, right: 20, bottom: 20, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
		
	var	data = getGoodBadWebsitesData();
	
	var x = d3.time.scale()
	    .range([0, width]);
	
	var y = d3.scale.linear()
	    .range([height, 0]);
	
	var color = d3.scale.category10();
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");
	
	var line = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.time); });
	
	var svg = d3.select("#good-bad-chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
	
	  var cities = color.domain().map(function(name) {
	    return {
	      name: name,
	      values: data.map(function(d) {
	        return {date: d.date, time: +d[name]};
	      })
	    };
	  });
	
	  x.domain(d3.extent(data, function(d) { return d.date; }));
	
	  y.domain([
	    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.time; }); }),
	    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.time; }); })
	  ]);
	
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);
	
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Hours spent");
	
	  var website_type = svg.selectAll(".website_type")
	      .data(cities)
	    .enter().append("g")
	      .attr("class", "website_type");
	
	  website_type.append("path")
	      .attr("class", "line")
	      .attr("d", function(d) { return line(d.values); })
	      .style("stroke", function(d) { return color(d.name); });
	
	  website_type.append("text")
	      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
	      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.time) + ")"; })
	      .attr("x", -90)
	      .attr("dy", ".35em")
	      .text(function(d) { return d.name; });
	
}
/*
 * @desc process the user history and gets time spent on websites
 * @param stored_history
 * @calls createCharts()
*/
function getTimeSpentOnWebsites(){
	
	var time = new Array;
	var today = getToday();
	
/*
	
	for (key of Object.keys(stored_history[today])) {
		val = stored_history[today][key]['time'];
	    time.push(val);
	}
*/
	createCharts(d3.entries(stored_history[today]));
	
}

/*
 * @desc process the website and gives the color based on type property.
 * @param string
 * @return string
*/
function getWebsiteColor(website){
	for(key of Object.keys(settings)){
		if(settings[key]['website'] == website){
			color = settings[key]['type'];
			break;
		}
		else{
			color = "neutral";
		}
	}
	return processColors(color);
}

function getSpecificWebsiteData(website){
	
	var data = [];
	for(i in stored_history){
		for(key of Object.keys(stored_history[i])){
			if(stored_history[i][key]['url'] == website){
				if(stored_history[i][key]['timeframe']){
					var time_periods = stored_history[i][key]['timeframe'];
					for(var a = 0; a < time_periods.length; a++){
						var time_period = time_periods[a].toString().split("-");
						if(time_period.length > 1){
							var time_spent = +time_period[1] - +time_period[0];
							console.log(time_spent)
							var specific_date = +time_period[0] + +time_spent / 2;
							data.push({'date':new Date(specific_date),'time':time_spent / 1000});
						}					
					}
				}

				//console.log(i+" "+stored_history[i][key]['timeframe'])
			}
		}
	}
	console.log(data)
	return data;
	
}

function getIndividualWebsiteGraph(website){
	
	var data = getSpecificWebsiteData(website);		
		margin = {top: 20, right: 40, bottom: 20, left: 20},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
		//parse = d3.time.format("%Y/%m/%d").parse;
		
		//console.log(data.)
		
	data.forEach(type);

	var x = d3.time.scale()
	    .range([0, width]);
	
	var y = d3.scale.linear()
	    .range([height, 0]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .tickSize(-height);
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .ticks(4)
	    .orient("right");
	    
	var area = d3.svg.area()
		.interpolate("monotone")
		.x(function(d) { return x(d.date); })
		.y0(height)
		.y1(function(d) { return y(d.time); });
		
	var line = d3.svg.line()
	    .interpolate("monotone")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.time); });
	
	var svg = d3.select("#individual-website").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	svg.append("clipPath")
	    .attr("id", "clip")
	    .append("rect")
	    .attr("width", width)
	    .attr("height", height);
	
	// Compute the minimum and maximum date, and the maximum time.
	x.domain([data[0].date, data[data.length - 1].date]);
	y.domain([0, d3.max(data, function(d) { return d.time; })]).nice();
	
	svg
	  .datum(data)
	  .on("click", click);
	
	svg.append("path")
	  .attr("class", "area")
	  .attr("clip-path", "url(#clip)")
	  .attr("d", area);
	
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);
	
	svg.append("g")
	  .attr("class", "y axis")
	  .attr("transform", "translate(" + width + ",0)")
	  .call(yAxis);
	
	svg.append("path")
	  .attr("class", "line")
	  .attr("clip-path", "url(#clip)")
	  .attr("d", line);
	
	svg.append("text")
	  .attr("x", width - 6)
	  .attr("y", height - 6)
	  .style("text-anchor", "end")
	
	// On click, update the x-axis.
	function click() {
		var n = data.length - 1,
		    i = Math.floor(Math.random() * n / 2),
		    j = i + Math.floor(Math.random() * n / 2) + 1;
		x.domain([data[i].date, data[j].date]);
		var t = svg.transition().duration(750);
		t.select(".x.axis").call(xAxis);
		t.select(".area").attr("d", area);
		t.select(".line").attr("d", line);
	}
	
	// Parse dates, returns minutes from seconds. Assume values are sorted by date.
	function type(d) {
		d.time = d.time / 60;
		return d;
	}	

}

 		

/*
 * @desc process the column colors.
 * @param string
 * @return string
*/
function processColors(color){
	var good = "#418486";
	var bad = "#9A3334";
	var neutral = "#EFEFEF";
	type = color == "bad" ? bad : (color == "good" ? good : neutral);
	return type; 
}

/*
 * @desc creates the charts from variable time.
 * @param array
 * @return void
*/
function createCharts(all_data){
console.log(all_data)
	//remove ignored websites
	for(var key in all_data){
		if(isInArray(all_data[key]['key'],ignored_websites)){
			all_data.splice(key,1);
		}
	}
	
	//build an array with the time
	var data = all_data.map(function(obj){ 
		return obj.value.time 
	});
	
	//create the chart
	var height = 500;
	var width = 800;
	var today = getToday();
	var barPadding = 2;
	var barWidth = (width / data.length) - barPadding;
	
	var yScale = d3.scale.linear()
		.domain([0, d3.max(data)])
		.range([0, height]);
	
	var xScale = d3.scale.ordinal()
		.domain(data)
		.rangeBands([0, width], 0.1, 0.3);
	
	var svg = d3.select("#chartarea")
		.style('width', width + 'px')
		.style('height', height + 'px');
	
	svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr("x", function (d, i) {
			return xScale(d);
		})
		.attr("y", function (d, i) {
			return height;
		})
		.attr("width", function (d, i) {
			return xScale.rangeBand()
		})
		.attr("fill", function (d, i) {
			return getWebsiteColor(all_data[i].key)
		})
		.attr("height", 0)
		.on('mouseover', function(d,i){
		    d3.select(this)
		    	.classed("hover",true)
	    	d3.select(".info p").remove()
		    d3.select(".info")
		    	.append("p")
		    	.text(all_data[i].key + " (today "+ +(all_data[i].value.time / 60).toFixed(1)+" minutes)")
		})
		.on('click',function(d,i){
	    	d3.select("#individual-website").remove()
		    d3.select("body")
		    	.append("div")
		    	.attr("id","individual-website")
		    	.append("p")
		    	.text(all_data[i].key +" ("+ +(all_data[i].value.time / 60).toFixed(1)+" minutes today, you can click on this graph to zoom)")
		    	.call(function(){
			    	getIndividualWebsiteGraph(all_data[i].key)
		    	})
		    d3.select("#individual-website")
		    	.append("button")
		    	.classed("close",true)
		    	.on('click',function(){
    		    	d3.select("#individual-website").transition()
	    		    	.duration(1500)
				    	.style('opacity',0)
				    	.remove()
		    	})
		    d3.select("#individual-website").transition()
		    	.duration(1500)
		    	.style('opacity',1)
		})
		.on('mouseout', function(d){
		    d3.select(this).attr("class","normal")
		    d3.select(".info p").text("Click on a column")
		})
		.transition()
		.duration(200)
		.delay(function (d, i) {
			return i * 50;
		})
		.attr("y", function (d, i) {
			return height - yScale(d);
		})
		.attr("height", function (d, i) {
			return yScale(d);
		});
	
	//add numbers on columns
	svg.selectAll("text#chartarea")
		.data(data)
		.enter()
		.append('text')
		.attr('class', 'bar')
		.attr("text-anchor", "middle")
		.attr("x", function(d) { return xScale(d) + xScale.rangeBand()/2})
		.attr("y", function(d) { return height - yScale(d) - 5; })
		.text(function(d){ return +(d / 60).toFixed(1) })
		
	//add text on columns
	svg.selectAll("text#chartarea")
		.data(data)
		.enter()
		.append('text')
		.attr('class', 'website-name')
		.attr("text-anchor", "middle")
		.text(function(d,i){ return all_data[i].key })
		.attr("x", function(d) { 
			if(this.getBBox().width < (yScale(d) - 8)){
				return height - this.getBBox().width / 2 - 10 
			}
			else{
				return -999999
			}
		})
		.attr("y", function(d) { return -xScale(d) - xScale.rangeBand()/2 + 3; })
		.attr("transform","rotate(90)")
}

/*
 * @desc check if element is in array
 * @param string,array
 * @return true/false
*/
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
