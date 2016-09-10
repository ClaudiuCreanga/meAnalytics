define([
		"helpers"
	], 
	function (helpers) {
	    return {
		    getGoodBadWebsitesData: function(){
			    //process data for good vs bad websites
		    	var data = [];
				for(i in stored_history){
					time_spent_on_good_websites = 0;
					time_spent_on_bad_websites = 0;
					for(key of Object.keys(stored_history[i])){			
						if(helpers.isInArray(stored_history[i][key]['url'],good_websites)){
							time_spent_on_good_websites += stored_history[i][key]['time']
						}
						else if(helpers.isInArray(stored_history[i][key]['url'],bad_websites)){
							time_spent_on_bad_websites += stored_history[i][key]['time']
						}
					}
					data.push({'date':new Date(i),'Good Websites':+(time_spent_on_good_websites / 3600).toFixed(1), 'Bad Websites':+(time_spent_on_bad_websites / 3600).toFixed(1)});
				}
				return data.sort(sortByDateAscending);	
			},
	        getGoodBadGraph: function(){
				/*
				 * @desc builds the good/bad chart
				 * @calls getGoodBadWebsitesData()
				*/
				var	margin = {top: 20, right: 20, bottom: 20, left: 40},
					width = 960 - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom;
					
				var	data = this.getGoodBadWebsitesData();
				if(data.length < 2){
					d3.select("#good-bad-chart")
						.append("h1")
						.text("Not enough data. Did you insert the websites in the menu? This graph needs at least 2 days of data.")
				}
				
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
			}
	    };
	}
);