define(function () {
    return {
        storeData: function(){
			chrome.storage.local.set({'settings':settings}, function () {
		        console.log('Saved', settings);
		    });
		}
    };
});