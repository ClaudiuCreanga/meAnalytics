/********** COLLECT AND HANDLE THE DATA *************/

/*
 * @desc set up the globals
*/
var	activeUrl = "";
	ignored_websites = ['newtab','extensions','history','settings'];
	isUserActive = true;
	timeOnWebsite = 0;
	today = "";
	previous_tab = "";
	stored_history = {};
	notification_info = {};
	
/*
 * @desc boot up the whole thing
*/
function start(){
	getSavedData();
	getToday();
	registerEvents();
	getIgnoredWebsites();
	getPreviousTab();
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
		if(stored_data){
			Object.keys(stored_data).length ? stored_history = stored_data['stored_history'] : '';
		}
	})
}

/*
 * @desc get previous tab url and set it to the global previous_tab variable
*/
function getPreviousTab(){
	chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {	
		if(arrayOfTabs[0]){
			previous_tab = arrayOfTabs[0].url;
		}
		else{
			previous_tab = "";
		}
	});
}

/*
 * @desc saves objects based on dates
 * @return a date as 15/2/2016
*/
function getToday(){
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	today = year+"/"+month+"/"+day;
}

/*
 * @desc creates an object of hours from 0 to 23
 * @return object
*/
function createHoursObject(){
	var hours = {}
	for(var i = 0; i < 24; i++){
		hours[i] = 0;
	}
	return hours;	
}

/*
 * @desc gets the current hour from date
 * @return int
*/
function getCurrentHour(){
	var currentDate = new Date();
	var hour = currentDate.getHours();
	return hour;
}

/*
 * @desc checks the date and processes the data, url and time, calls savestored_history()
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
function checkDate(activeTab){

	if(activeTab){
		var base_url = getBaseDomain(previous_tab);
		if(stored_history[today]){
			var currentHour = getCurrentHour();
			if(stored_history[today][base_url]){
				stored_history[today][base_url]['url'] = base_url;
				stored_history[today][base_url]['time'] = parseInt(stored_history[today][base_url]['time'])+timeOnWebsite;
				stored_history[today][base_url]['timeframe'][currentHour] = parseInt(stored_history[today][base_url]['timeframe'][currentHour])+timeOnWebsite;
			}
			else{
				stored_history[today][base_url] = {};
				stored_history[today][base_url]['url'] = base_url;
				stored_history[today][base_url]['time'] = timeOnWebsite;
				stored_history[today][base_url]['timeframe'] = createHoursObject()
				stored_history[today][base_url]['timeframe'][currentHour] = parseInt(stored_history[today][base_url]['timeframe'][currentHour])+timeOnWebsite;
			}
		}else{
			stored_history[today] = {};
			stored_history[today][base_url] = {};
			stored_history[today][base_url]['url'] = base_url;
			stored_history[today][base_url]['time'] = timeOnWebsite;
			stored_history[today][base_url]['timeframe'] = createHoursObject();
			
		}
		if(!isInArray(base_url,ignored_websites)){
			savestored_history();
		}
		previous_tab = activeTab.url;
	}
}

/*
 * @desc main function called by the events on user action. 
 * gets activeTab object containing data about the active tab and calls checkDate()
 * @return void 
*/
function getActiveTab(){
	chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {	
		var activeTab = arrayOfTabs[0];
		checkDate(activeTab);			
	});
}

/*
 * @desc saves the object stored_history, organized by dates in this format
 * 15/2/2016: Object
 * 	 stackoverflow.com: Object
 *		time: 15
 *		url: "stackoverflow.com"
 * 	 github.com: Object
 * 		time: 5
 *		url: "github.com"
 * resets the timer to 0 after data is saved.
 * @return void 
*/
function savestored_history(){
	chrome.storage.local.set({'stored_history':stored_history}, function () {
        console.log('Saved', stored_history);
        timeOnWebsite = 0;
    });
}

/*
 * @desc registers user action events on browser: changing tab, changing window, browser out of focus 
 * has an interval of 1 second where it checks if the browser is focused and updates the timeOnWebsite
 * @return void 
*/
function registerEvents(){
	
	// Fired when the active tab in a window changes
    chrome.tabs.onActivated.addListener(function() {
        isUserActive = true;
		getActiveTab();
    });

    // Fired when the url of a tab changes
    chrome.tabs.onUpdated.addListener(function() {
        isUserActive = true;
		getActiveTab();
    });

    // Fired when the active chrome window is changed.
    chrome.windows.onFocusChanged.addListener(function(windowId) {
		//getActiveTab();
    });
    
    window.setInterval(function(){
	    getToday()
    }, 60000);  
    
    window.setInterval(function(){
	    checkBrowserFocus(),
	    updateTime()
    }, 1000);  
}

/*
 * @desc gets the domain of the active website 
 * @return string 
*/
function getActiveWebsite() {
    return getBaseDomain(activeUrl);
}

/*
 * @desc check every second if the browser is in focus and sets the isUserActive to false or true
 * @return void
*/
function checkBrowserFocus(){
	chrome.windows.getCurrent(function(windows){
		(windows.focused == false) ? isUserActive = false : isUserActive = true;
	})
}

/*
 * @desc called every second in registerEvents(). 
 * Gets the active website and checks if it is in the ignore list. 
 * If not, it updates the timeOnWebsite every second. 
 * @return void
*/
function updateTime() {
    var current_website = getActiveWebsite();  
    if(isUserActive && !isInArray(current_website,ignored_websites)){
        timeOnWebsite += 1; 
        console.log(timeOnWebsite)
    }
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

/*
 * @desc get the domain name from string.
 * http://github.com/ClaudiuCreanga becomes github.com
 * @param string url
 * @return string
*/
function getBaseDomain(url) {
    // Remove http and www
    var strList = url.split(":\/\/");
    (strList.length > 1) ? url = strList[1] : url = strList[0];
    url = url.replace(/www\./g,'');
    
    // Return just the domain
    var domainName = url.split('\/');
    return domainName[0];
}

/*
 * @desc check if element is in array
 * @param string,array
 * @return true/false
*/
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

/********** NOTIFICATIONS *************/

/*
 * @desc set the options for the notification
*/
var optionsExercise = {
  type: "basic",
  title: "Exercise!",
  message: "Exercise! Time to get up and move a bit.",
  iconUrl: "../../images/icon128.PNG",
  buttons: [
	  {
		  title : "Will do. I want to stay healthy.",
		  iconUrl: "../../images/yes.png"
	  },
	  {
		  title : "No! I don't care about my back.",
		  iconUrl: "../../images/no.png"
	  }
  ]
}

/*
 * @desc set the options for the notification
*/
var optionsSleep = {
  type: "basic",
  title: "Go to bed!",
  message: "Time to prepare for bed. Close your things now!!!",
  iconUrl: "../../images/icon128.PNG",
  buttons: [
	  {
		  title : "Will do. I want to stay healthy.",
		  iconUrl: "../../images/yes.png"
	  },
	  {
		  title : "No! I don't care about my head.",
		  iconUrl: "../../images/no.png"
	  }
  ]
}

/*
 * @desc creates and schedules 2 exercise notifications, 1 at lunch, 1 in the afternoon, and one sleep notification that will remind me to exercise more at a particular time of the day and to got to sleep.
*/
function scheduleNotifications(){
	var now = new Date();
	var millisTill1030 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30, 0, 0) - now;
	var millisTill1515 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 15, 0, 0) - now;
	var millisTill2340 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 40, 0, 0) - now;
	if (millisTill1030 < 0) {
	     millisTill1030 += 86400000; // it's after 10:30am, try 10:30am tomorrow.
	}
	if (millisTill1515 < 0) {
	     millisTill1515 += 86400000; // it's after 15:15am, try 15:15am tomorrow.
	}
	if (millisTill2340 < 0) {
	     millisTill2340 += 86400000; // it's after 15:15am, try 15:15am tomorrow.
	}
	setTimeout(
		function(){
			// @params string,object,function
			chrome.notifications.create('lunch', optionsExercise, notificationCallback)
		}, 
		millisTill1030
	);
	setTimeout(
		function(){
			// @params string,object,function
			chrome.notifications.create('afternoon', optionsExercise, notificationCallback)
		}, 
		millisTill1515
	);
	setTimeout(
		function(){
			// @params string,object,function
			chrome.notifications.create('sleep', optionsSleep, notificationCallback)
		}, 
		millisTill2340
	);
}
scheduleNotifications()

function notificationCallback(){
	// not needed for now	
}

/*
 * @desc ads event to the buttons in the notification
 * @param function
*/
chrome.notifications.onButtonClicked.addListener(replyBtnClick);

/*
 * @desc function called on button clicked, handles which button is clicked and then clears it
 * @param string,int
*/
function replyBtnClick(notificationId, btnIdx){
	if(btnIdx == 0){
		manageNotificationPersistence(notificationId,1)			
	} else {
		manageNotificationPersistence(notificationId,0)			
	}
	clearNotification(notificationId)
}

/*
 * @desc clears the notifications
 * @param string
*/
function clearNotification(notificationId){
	chrome.notifications.clear(notificationId)
}

/*
 * @desc saves the activity in notification_info object
 * @param string, int
*/
function manageNotificationPersistence(type,action){
	if(!notification_info[today]){
		notification_info[today] = {}
	}
	notification_info[today][type] = action;
	saveNotificationInfo();
}

/*
 * @desc saves the object notification_info, organized in this format
 * 15/2/2016: Object
 * 	 lunch: 1
 *	 afternoon: 0
 * @return void 
*/
function saveNotificationInfo(){
	chrome.storage.local.set({'notification_info':notification_info}, function () {
        console.log('Saved', notification_info);
    });
}