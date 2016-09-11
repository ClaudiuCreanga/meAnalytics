"use strict";
define([
		"helpers",
		"chromeManageTabs"
	], 
	function (helpers,chromeManageTabs) {
		return{
			/*
			 * @desc registers user action events on browser: changing tab, changing window, browser out of focus 
			 * has an interval of 1 second where it checks if the browser is focused and updates the timeOnWebsite
			 * @return void 
			*/
			registerEvents: function(){
				var _this = this;

				// Fired when the active tab in a window changes
			    chrome.tabs.onActivated.addListener(function() {
			        window.isUserActive = true;
					chromeManageTabs.getActiveTab();
			    });
			
			    // Fired when the url of a tab changes
			    chrome.tabs.onUpdated.addListener(function() {
			        window.isUserActive = true;
					chromeManageTabs.getActiveTab();
			    });
			
			    // Fired when the active chrome window is changed.
			    chrome.windows.onFocusChanged.addListener(function(windowId) {
					//getActiveTab();
			    });
			    
/*
			    window.setInterval(function(){
				    helpers.getToday()
			    }, 60000);  
*/
			    
			    window.setInterval(
			    	function(){
					    chromeManageTabs.checkBrowserFocus();
					    _this.updateTime();
			    	},
			    1000);  
			},
			/*
			 * @desc called every second in registerEvents(). 
			 * Gets the active website and checks if it is in the ignore list. 
			 * If not, it updates the timeOnWebsite every second. 
			 * @return void
			*/
			updateTime: function() {
			    var current_website = chromeManageTabs.getActiveWebsite();  
			    if(window.isUserActive && !helpers.isInArray(current_website,ignored_websites)){
			        window.timeOnWebsite += 1; 
			        console.log(window.timeOnWebsite)
			    }
			}
		}
	}
)