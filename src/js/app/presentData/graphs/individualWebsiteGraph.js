define([
		"helpers"
	], 
	function (helpers) {
	    return {
		    /*
			 * @desc process the time from timeframe property and ads classifies it for every hour in the day.
			 * @param string
			 * @return array of objects
			*/
			getSpecificWebsiteData: function(website){	
				var data = [];
				for(i in window.stored_history){
					var newDateFormat = i.split("/");
					for(key of Object.keys(window.stored_history[i])){
						if(window.stored_history[i][key]['url'] == website){
							if(window.stored_history[i][key]['timeframe']){
								var time_periods = window.stored_history[i][key]['timeframe'];
								for(var j = 0; j < Object.keys(time_periods).length; j++){
									data.push({'date':new Date(newDateFormat+", "+j+":0:0"),'time':time_periods[j]});	
								}
							}
						}
					}
				}	
				return data;	
			},
		    /*
			 * @desc creates the chart for a specific website. values are taken from @getSpecificWebsiteData
			 * @param string
			 * @return void
			*/
			getIndividualWebsiteGraph: function(website){
				
				var data = this.getSpecificWebsiteData(website)
					margin = {top: 20, right: 40, bottom: 20, left: 20},
					width = 960 - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom;
			console.log(data)
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
					d.date = new Date(d.date);
					return d;
				}	
			}
		};
	}
);