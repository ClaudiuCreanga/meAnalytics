define([
		"helpers"
	], 
	function (helpers) {
		return {
			/*
			 * @desc checks the date and processes the data, url and time, calls saveChromeLocalStorage()
			 * the object looks like this:
			 * {
			 *	app.gistboxapp.com:Object
			 *	 	time:41
			 *		timeframe:Object (Array 0-23)
			 *		url:"app.gistboxapp.com"
			 *	developer.chrome.com:Object
			 *		time:690
			 *		timeframe:Object (Array 0-23)
			 *		url:"developer.chrome.com"
			 *	}
			 * @param object activeTab - the currently actived tab
			*/
			checkDate: function(activeTab){
			
				if(activeTab){
					var base_url = helpers.getBaseDomain(window.previous_tab);
					var today = helpers.getToday();
					var hours = helpers.createHoursObject();
					if(window.stored_history[today]){
						var currentHour = helpers.getCurrentHour();
						if(window.stored_history[today][base_url]){
							window.stored_history[today][base_url]['url'] = base_url;
							window.stored_history[today][base_url]['time'] = parseInt(window.stored_history[today][base_url]['time'])+window.timeOnWebsite;
							window.stored_history[today][base_url]['timeframe'][currentHour] = parseInt(window.stored_history[today][base_url]['timeframe'][currentHour])+window.timeOnWebsite;
						}
						else{
							window.stored_history[today][base_url] = {};
							window.stored_history[today][base_url]['url'] = base_url;
							window.stored_history[today][base_url]['time'] = window.timeOnWebsite;
							window.stored_history[today][base_url]['timeframe'] = hours;
							window.stored_history[today][base_url]['timeframe'][currentHour] = parseInt(window.stored_history[today][base_url]['timeframe'][currentHour])+window.timeOnWebsite;
						}
					}else{
						window.stored_history[today] = {};
						window.stored_history[today][base_url] = {};
						window.stored_history[today][base_url]['url'] = base_url;
						window.stored_history[today][base_url]['time'] = window.timeOnWebsite;
						window.stored_history[today][base_url]['timeframe'] = hours;
						
					}
					if(!helpers.isInArray(base_url,ignored_websites)){
						helpers.saveChromeLocalStorage("stored_history",window.stored_history);
				        window.timeOnWebsite = 0;
					}
					window.previous_tab = activeTab.url;
				}
			}
		}
	}
)