/********** HANDLE THE DATA *************/

var history = {};
	activeUrl = "";
	ignored_websites = new Array();
	isUserActive = true;
	timeOnWebsite = 0;
	
function start(){
	getToday();
}
function getToday(){
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	var today = day+"/"+month+"/"+year;
	return today;
}
var today = getToday();

function checkDate(activeTab){
	if(activeTab){
		console.log(timeOnWebsite)
		if(history[today]){
			if(history[today][getBaseDomain(activeTab.url)] == activeTab.url){
				history[today][getBaseDomain(activeTab.url)]['url'] = getBaseDomain(activeTab.url);
				history[today][getBaseDomain(activeTab.url)]['time'] = parseInt(history[today][getBaseDomain(activeTab.url)]['time'])+timeOnWebsite;
			}
			else{
				history[today][getBaseDomain(activeTab.url)] = {};
				history[today][getBaseDomain(activeTab.url)]['url'] = getBaseDomain(activeTab.url);
				history[today][getBaseDomain(activeTab.url)]['time'] = timeOnWebsite;
			}
		}else{
			history[today] = {};
			history[today][getBaseDomain(activeTab.url)] = {};
			history[today][getBaseDomain(activeTab.url)]['url'] = getBaseDomain(activeTab.url);
			history[today][getBaseDomain(activeTab.url)]['time'] = timeOnWebsite;
		}
	}
	saveHistory()
}

function getActiveTab(){
	chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
	
		var activeTab = arrayOfTabs[0];
		checkDate(activeTab);	
		
	});
}

function saveHistory(){
	chrome.storage.sync.set({'history':history}, function () {
        console.log('Saved', history);
        timeOnWebsite = 0;
    });
}

registerEvents();
function registerEvents(){
    chrome.tabs.onActivated.addListener(function(activeInfo) {
		getActiveTab();
    });

    // Registering for onChanged event
    // This is fired when the url of a tab changes
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		getActiveTab();
    });

    // Registering for onFocusChanged event
    // This is fired when the active chrome window is changed.
    chrome.windows.onFocusChanged.addListener(function(windowId) {
        // This happens if all the windows are out of focus
        // Using this condition to infer that the user is inactive
        if (windowId === chrome.windows.WINDOW_ID_NONE) {
            //	isUserActive = false;
        } else {
            isUserActive = true;
        }
		getActiveTab();
    });
    
    window.setInterval(updateTime, 1000);  
}

function getActiveWebsite() {
    return getBaseDomain(activeUrl);
}


function updateTime() {
    var current_website = getActiveWebsite();  
    if(isUserActive && !isInArray(current_website,ignored_websites)){
        timeOnWebsite += 1; 
    }
}

function getIgnoredWebsites(){
	chrome.storage.sync.get('settings',function(object){
		if(chrome.runtime.lastError){
			console.log("Runtime error.");
		}
		var stored_data = object.settings;
		if(Object.keys(stored_data).length){
			for(var key in stored_data){
				if(stored_data[key]['type'] == 'ignore'){
					ignored_websites.push(stored_data[key]["website"]);
				}
			}
		}
		ignoreWebsites(ignored_websites)
	})	
}
getIgnoredWebsites()

function ignoreWebsites(ignored_websites){
	console.log(ignored_websites);
}

//get the domain name from string
function getBaseDomain(url) {
    // Remove http and www
    var strList = url.split(":\/\/");
    if (strList.length > 1) {
        url = strList[1];
    } else {
        url = strList[0];
    }
    url = url.replace(/www\./g,'');
    
    // Return just the domain
    var domainName = url.split('\/');
    return domainName[0];
}

//check if element is in array
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}