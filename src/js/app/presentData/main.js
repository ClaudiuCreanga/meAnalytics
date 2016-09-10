define([
		"helpers",
		"mainBarChart"
	], 
	function (helpers,mainBarChart) {
		/********** SHOW THE DATA *************/
		
		//set up the globals
	 	window.settings = {};
		window.stored_history = {};
		window.ignored_websites = ['newtab','extensions','history','settings'];
		window.good_websites = [];
		window.bad_websites = [];
			
		//helpers.clearSavedData("stored_history");
		
		/*
		 * @desc boot up the whole thing
		*/
		function start(){
			getStoredHistory();
			getUserSettings();
			getWebsiteTypes();
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
					console.log(stored_data)
					if(Object.keys(stored_data).length){
						window.stored_history = stored_data['stored_history'];
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
		 * @desc gets websites types set up by user in settings.
		 * Pusshes the websites into a global array ignored_websites
		 * @requires object settings from main.js
		 * @return void
		*/
		function getWebsiteTypes(){
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
									window.ignored_websites.push(stored_settings[i][key]["website"]);
								}
								else if(stored_settings[i][key]['type'] == 'good'){
									window.good_websites.push(stored_settings[i][key]["website"]);
								}
								else if(stored_settings[i][key]['type'] == 'bad'){
									window.bad_websites.push(stored_settings[i][key]["website"]);
								}
							}
						}
					}
				}
			})
		}
		
		/*
		 * @desc gets the user settings from the stored_settings object
		 * @return null
		*/	
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
		 * @desc process the user history and gets time spent on websites
		 * @param stored_history
		 * @calls createCharts()
		*/
		function getTimeSpentOnWebsites(){	
			var time = new Array;
			var today = helpers.getToday();
			mainBarChart.createCharts(d3.entries(window.stored_history[today]));
		}
	}
);
