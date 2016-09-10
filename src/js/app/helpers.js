define(function () {
    return {
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
		}
    };
});