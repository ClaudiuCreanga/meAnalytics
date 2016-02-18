chrome.storage.sync.get('stored_history',function(object){
	if(chrome.runtime.lastError){
		console.log("Runtime error.");
	}
	var stored_data = object;
	if(stored_data){
		if(Object.keys(stored_data).length){
			stored_history = stored_data['stored_history'];
			console.log(stored_history);
		}
		else{
			d3.select(".main-data")
				.append("h1")
				.text("You don't have any data yet :(")
		}
	}
})	

var width = 500;
	height = 500;
	widthScale = d3.scale.linear()
					.domain([0,60])
					.range([0,height]);
	axis = d3.svg.axis()
				.ticks(5)
				.scale(widthScale);
				
	color = d3.scale.linear()
				.domain([0,60])
				.range(["red","blue"]);
				
var canvas = d3.select(".main-data")
				.append("svg")
				.attr('width',width)
				.attr('height',width)
				.append("g")
				.attr("transform","translate(50,50)")


				
var dataArray = [20,40,50,60]
var bars = canvas.selectAll("rect")
			.data(dataArray)
			.enter()
				.append("rect")
				.attr("height",function(d){
					return widthScale(d);
				})
				.attr("width",50)
				.attr("fill",function(d){
					return color(d);
				})
				.attr("x",function(d,i){
					return i * 100;
				});
	canvas.append("g")
		.attr("transform","translate(0,400)")
	    .attr("transform", "rotate(90)")
		.call(axis);
			
/*
var circle = canvas.append("circle")
				.attr("cx",250)
				.attr("cy",250)
				.attr("r",50)
				.attr("fill","red")
*/
	
