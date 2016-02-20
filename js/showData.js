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
				console.log(stored_history)
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
	
	for (key of Object.keys(stored_history[today])) {
		val = stored_history[today][key]['time'];
	    time.push(val);
	}
	
	createCharts(time);
	
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
	
	var data = time;
	var height = 400;
	var width = 600;
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
			return getWebsiteColor(Object.keys(stored_history[today])[i])
		})
		.attr("height", 0)
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
