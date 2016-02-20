var today = getToday();
	settings = {};

chrome.storage.sync.get('stored_history',function(object){
	if(chrome.runtime.lastError){
		console.log("Runtime error.");
	}
	var stored_data = object;
	if(stored_data){
		if(Object.keys(stored_data).length){
			var stored_history = stored_data['stored_history'];
			console.log(stored_history)
			relevant_time(stored_history);
		}
		else{
			d3.select(".main-data")
				.append("h1")
				.text("You don't have any data yet today. Get on the net!")
		}
	}
})

chrome.storage.sync.get('settings',function(object){
	if(chrome.runtime.lastError){
		console.log("Runtime error.");
	}
	var stored_settings = object;
	if(stored_settings){
		if(Object.keys(stored_settings).length){
			settings = stored_settings['settings'];
			console.log(settings)
		}
	}
})
	
function getToday(){
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	var today = day+"/"+month+"/"+year;
	return today;
}

function relevant_time(stored_history){
	
	var time = new Array;
	
	for (key of Object.keys(stored_history[today])) {
		val = stored_history[today][key]['time'];
	    time.push(val);
	}
	
	createCharts(time);
	
}

function columnColor(){
	var good = "#418486";
	var bad = "#9A3334";
	var neutral = "#EFEFEF";
}

function createCharts(time){
	
	var data = time;
	var height = 400;
	var width = 600;
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
			return '#418486'
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
