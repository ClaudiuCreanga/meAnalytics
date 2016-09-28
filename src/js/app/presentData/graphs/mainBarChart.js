"use strict";
define([
		"helpers",
		"individualWebsiteGraph"
	], 
	function (helpers,individualWebsiteGraph) {
	    return {
		    /*
			 * @desc process the website and gives the color based on type property.
			 * @param string
			 * @return string
			*/
			getWebsiteColor: function(website){
				console.log(window.settings)
				for(var key of Object.keys(window.settings)){
					console.log(window.settings[key]['website']);
					if(window.settings[key]['website'] == website){
						var color = window.settings[key]['type'];
						break;
					}
					else{
						var color = "neutral";
					}
				}
				return this.processColors(color);
			},			
			/*
			 * @desc process the column colors.
			 * @param string
			 * @return string
			*/
			processColors: function(color){
				var good = "#418486";
				var bad = "#9A3334";
				var neutral = "#EFEFEF";
				var type = color == "bad" ? bad : (color == "good" ? good : neutral);
				return type; 
			},
			/*
			 * @desc creates the charts from variable time.
			 * @param array
			 * @return void
			*/
			createCharts: function(all_data){
			
				var _this = this;
				//remove ignored websites
				for(var key in all_data){
					if(helpers.isInArray(all_data[key]['key'],window.ignored_websites)){
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
				var today = helpers.getToday();
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
						return _this.getWebsiteColor(all_data[i].key)
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
						    	individualWebsiteGraph.getIndividualWebsiteGraph(all_data[i].key)
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
	    };
	}
);