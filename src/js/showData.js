/********** SHOW THE DATA *************/

//set up the globals
var settings = {}
	stored_history = {}
	
/*
 * @desc boot up the whole thing
*/
function start(){
	getStoredHistory();
	getUserSettings();
}
start();

/*
 * @desc gets the stored history.
 * calls getTimeSpentOnWebsites()
 * @requires object stored_history from collectData.js
 * @return void
*/
function getStoredHistory(){
	chrome.storage.sync.get('stored_history',function(object){
		if(chrome.runtime.lastError){
			console.log("Runtime error.");
		}
		var stored_data = object;
		if(stored_data){
			if(Object.keys(stored_data).length){
				stored_history = stored_data['stored_history'];
				console.log(d3.entries(stored_history[getToday()]))
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
function getUserSettings(){
	chrome.storage.sync.get('settings',function(object){
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
	var today = day+"/"+month+"/"+year;
	return today;
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
				data.push({'date':i,'time':stored_history[i][key]['url']});
			}
		}
	}
	return data;
	
}

function getIndividualWebsiteGraph(website){
	
	var data = getSpecificWebsiteData(website)
		console.log(data);
	
	
	var margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	//var parse = d3.time.format("%b %Y").parse;
	var parse = d3.time.format("%d/%m/%Y").parse;

	
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
	
	data.forEach(type);
	
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
  
  // Parse dates and numbers. We assume values are sorted by date.
// Also filter to one symbol; the S&P 500.
function type(d) {
  d.date = parse(d.date);
  d.time = +d.time;
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
function createCharts(time){
	
	var data = time.map(function(obj){ 
		return obj.value.time 
	});
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
			return getWebsiteColor(time[i].key)
		})
		.attr("height", 0)
		.on('mouseover', function(d,i){
		    d3.select(this)
		    	.classed("hover",true)
	    	d3.select(".info p").remove()
		    d3.select(".info")
		    	.append("p")
		    	.text(time[i].key)
		    	.append("p")
		    	.text(time[i].value.time)
		    	.append("div")
		    	.attr("id","individual-website")
		    	.call(getIndividualWebsiteGraph(time[i].key))
		})
		.on('mouseout', function(d){
		    d3.select(this).attr("class","normal")
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
}

/*
 * @desc check if element is in array
 * @param string,array
 * @return true/false
*/
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
