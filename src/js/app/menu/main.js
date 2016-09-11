"use strict";
define([
		"createMenu",
		"eventListeners"
	], 
	function (createMenu,eventListeners) {

			window.settings = {};
			//get previously saved websites
			function getData(){
				chrome.storage.local.get('settings',function(object){
					if(chrome.runtime.lastError){
						console.log("Runtime error.");
					}
					var stored_data = object;
					if(stored_data){
						if(Object.keys(stored_data).length){
							settings = stored_data['settings'];
							createMenu.createFromSettings(settings);
						}
						else{
							console.log(settings)
							settings.website1 = {};
							eventListeners.listenToNewWebsite(document.querySelector('.list-items .website-1'));
						}
					}
				});	
			}
			getData();
			eventListeners.menuToggle();
			eventListeners.attachClickEventsOnInputs();
	}
);