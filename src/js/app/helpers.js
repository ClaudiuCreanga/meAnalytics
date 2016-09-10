define(function () {
    return {
        getModernCheckedByName: function(context,name){
		    return  Array.prototype.slice.call(document.getElementsByName(name)).filter(function(e){
		        return e.checked;
		    });
		},
		clearSavedData: function(object){
			chrome.storage.local.clear();
			chrome.storage.local.set({object:{}}, function () {
		        console.log('Saved', object);
		    });
		}
    };
});