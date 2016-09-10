define([
		"helpers"
	], 
	function (helpers) {
	    return {
			/*
			 * @desc build the insights chart
			 * @return null
			*/	
			buildInsights: function(){
				d3.select("#insights")
					.append("p")
					.text("this is interesting data")
			}
		};
	}
);