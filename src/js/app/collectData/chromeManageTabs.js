define([
		"helpers",
		"timeOnWebsiteManager"
	], 
	function (helpers,timeOnWebsiteManager) {
		return {
			/*
			 * @desc get previous tab url and set it to the global previous_tab variable
			*/
			getPreviousTab: function(){
				chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {	
					if(arrayOfTabs[0]){
						window.previous_tab = arrayOfTabs[0].url;
					}
					else{
						window.previous_tab = "";
					}
				});
			},
			/*
			 * @desc main function called by the events on user action. 
			 * gets activeTab object containing data about the active tab and calls timeOnWebsiteManager.checkDate()
			 * @return void 
			*/
			getActiveTab: function (){
				chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {	
					var activeTab = arrayOfTabs[0];
					timeOnWebsiteManager.checkDate(activeTab);			
				});
			},
			/*
			 * @desc gets the domain of the active website 
			 * @return string 
			*/
			getActiveWebsite: function () {
			    return helpers.getBaseDomain(window.activeUrl);
			},
			/*
			 * @desc check every second if the browser is in focus and sets the isUserActive to false or true
			 * @return void
			*/
			checkBrowserFocus: function (){
				chrome.windows.getCurrent(function(windows){
					(windows.focused == false) ? window.isUserActive = false : window.isUserActive = true;
				})
			}
		}
	}
)