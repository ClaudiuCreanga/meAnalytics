"use strict";
define([
		"removeItem",
		"helpers",
		"goodBadGraph",
		"insightsChart"
	], 
	function (removeItem,helpers,goodBadGraph,insightsChart) {
	    return {
		    /*
			 * @desc attach click events on general graph
			 * @return null
			*/	
			attachClickOnGeneralGraph: function(){
				var general_graphs = document.querySelector(".general-charts");
				general_graphs.addEventListener("click", function(e){
					d3.select("#good-bad-chart").remove()
					d3.select("body")
						.append("div")
						.attr("id","good-bad-chart")
						.append("p")
						.text("good vs bad websites")
						.call(function(){
					    	goodBadGraph.getGoodBadGraph()
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
			},
			/*
			 * @desc attach click event on close button
			 * @return null
			*/	
			attachClickOnClose: function(){
				var close_insights = document.querySelector(".bubble-container .close");
				close_insights.addEventListener("click", function(e){
					var insights = document.querySelector(".bubble-container");
					insights.style.display = "none";
				},false);
			},
			/*
			 * @desc attach click events on insights graph
			 * @return null
			*/	
			attachClickOnInsights : function(){
				var insights = document.querySelector(".bubble-container");
				insights.addEventListener("click", function(e){
					d3.select("body")
						.append("div")
						.attr("id","insights")
						.append("p")
						.text("meAnalytics")
						.call(function(){
					    	insightsChart.buildInsights()
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
					d3.select("#good-bad-chart").transition()
				    	.duration(1500)
				    	.style('opacity',0)
				    	.remove()
						
				},false);
			}
	    };
	}
);