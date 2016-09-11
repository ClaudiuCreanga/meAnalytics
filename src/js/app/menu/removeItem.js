"use strict";
define([
		"helpers"
	], 
	function (helpers) {
	    return {
	        remove_item: function(removable_item,index){
				removable_item.addEventListener('click', function(e){
					removable_item.parentElement.remove();
					var key = removable_item.parentElement.className;
					delete settings[index];
					helpers.saveChromeLocalStorage('settings',settings);
				},false);
			}
	    };
	}
);