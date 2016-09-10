//removing a property from stored_history
stored_history = {}
function getStoredHistory(){
	chrome.storage.local.get('stored_history',function(object){
		if(chrome.runtime.lastError){
			console.log("Runtime error.");
		}
		var stored_data = object;
		if(stored_data){
			if(Object.keys(stored_data).length){
				stored_history = stored_data['stored_history'];
				for(i in stored_history){
					for(key of Object.keys(stored_history[i])){
						if(stored_history[i][key]['timeframe']){
							stored_history[i][key]['timeframe'] = []
						}
					}
				}
				savestored_history()
			}
		}
	})
}
function savestored_history(){
	chrome.storage.local.set({'stored_history':stored_history}, function () {
        console.log('Saved', stored_history);
    
    });
}