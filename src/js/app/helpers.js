define(function () {
    return {
	    /*
		 * @desc saves the object in local storage
		 * @params string, object
		 * @return void 
		*/
		saveChromeLocalStorage: function(objectName,objectData){
			chrome.storage.local.set({objectName:objectData}, function () {
		        console.log('Saved', objectData);
		    });
		},
        getModernCheckedByName: function(context,name){
		    return Array.prototype.slice.call(document.getElementsByName(name)).filter(function(e){
		        return e.checked;
		    });
		},
		clearSavedData: function(object){
			chrome.storage.local.clear();
			chrome.storage.local.set({object:{}}, function () {
		        console.log('Saved', object);
		    });
		},
		/*
		 * @desc sorts an array by date desc.
		 * @param array
		*/
		sortByDateAscending: function(a, b) {
		    return a.date - b.date;
		},
		/*
		 * @desc check if element is in array
		 * @param string,array
		 * @return true/false
		*/
		isInArray: function(value, array) {
		  return array.indexOf(value) > -1;
		},
		/*
		 * @desc calculate today
		 * @return a date as 15/2/2016
		*/	
		getToday: function(){
			var currentDate = new Date();
			var day = currentDate.getDate();
			var month = currentDate.getMonth() + 1;
			var year = currentDate.getFullYear();
			var today = year+"/"+month+"/"+day;
			return today;
		},
		/*
		 * @desc creates an object of hours from 0 to 23
		 * @return object
		*/
		createHoursObject: function(){
			var hours = {}
			for(var i = 0; i < 24; i++){
				hours[i] = 0;
			}
			return hours;	
		},
		/*
		 * @desc gets the current hour from date
		 * @return int
		*/
		getCurrentHour: function(){
			var currentDate = new Date();
			var hour = currentDate.getHours();
			return hour;
		},	
		/*
		 * @desc get the domain name from string.
		 * http://github.com/ClaudiuCreanga becomes github.com
		 * @param string url
		 * @return string
		*/
		getBaseDomain: function(url) {
		    // Remove http and www
		    var strList = url.split(":\/\/");
		    (strList.length > 1) ? url = strList[1] : url = strList[0];
		    url = url.replace(/www\./g,'');
		    
		    // Return just the domain
		    var domainName = url.split('\/');
		    return domainName[0];
		}

    };
});