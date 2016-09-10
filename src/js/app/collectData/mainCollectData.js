/********** COLLECT AND HANDLE THE DATA *************/
define([
		"helpers",
		"registerEvents",
		"chromeManageTabs",
		"notifications"
	], 
	function (helpers,registerEvents,chromeManageTabs,notifications) {
//helpers.clearSavedData("stored_history")
		/*
		 * @desc set up the globals
		*/
		window.activeUrl = "";
		window.ignored_websites = ['newtab','extensions','history','settings'];
		window.isUserActive = true;
		window.timeOnWebsite = 0;
		window.previous_tab = "";
		window.stored_history = {};
		window.notification_info = {};
			
		/*
		 * @desc boot up the whole thing
		*/
		function start(){
			getSavedData();
			getIgnoredWebsites();
			registerEvents.registerEvents();
			chromeManageTabs.getPreviousTab();
			notifications.scheduleNotifications()
		}
		start();
		
		/*
		 * @desc get saved data from object stored_history
		*/
		function getSavedData(){
			chrome.storage.local.get('stored_history',function(object){
				if(chrome.runtime.lastError){
					console.log("Runtime error.");
				}
				var stored_data = object;
				console.log(stored_data)
				if(stored_data){
					Object.keys(stored_data).length ? window.stored_history = stored_data['stored_history'] : '';
				}
			})
		}
		
		/*
		 * @desc gets the ignored websites set up by user in settings.
		 * Pusshes the websites into a global array ignored_websites
		 * @requires object settings from main.js
		 * @return void
		*/
		function getIgnoredWebsites(){
			chrome.storage.local.get('settings',function(object){
				if(chrome.runtime.lastError){
					console.log("Runtime error.");
				}
				var stored_data = object.settings;
				if(stored_data){
					if(Object.keys(stored_data).length){
						for(var key in stored_data){
							if(stored_data[key]['type'] == 'ignore'){
								ignored_websites.push(stored_data[key]["website"]);
							}
						}
					}
				}
			})	
		}
	}
);