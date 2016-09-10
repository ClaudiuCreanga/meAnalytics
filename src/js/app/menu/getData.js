define([
		"storeData"
	], 
	function (storeData) {
	    return {
			getData: function(){
		        //get previously saved websites
				chrome.storage.local.get('settings',function(object){
					if(chrome.runtime.lastError){
						console.log("Runtime error.");
					}
					var stored_data = object;
					if(stored_data){
						if(Object.keys(stored_data).length){
							settings = stored_data['settings'];
							createFromSettings(settings);
						}
						else{
							settings.website1 = {};
							listenToNewWebsite(first_item);
						}
					}
				});	
			}	    
		};
	}
);