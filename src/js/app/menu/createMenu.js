define([
		"removeItem",
		"eventListeners"
	], 
	function (removeItem,eventListeners) {
	    return {
	        getHello: function () {
	            return 'Hello World';
	        },
			createFromSettings: function(settings){
		        //create the fields from previous saved settings
				document.querySelector('.list-items').innerHTML= "";
				for(var key in settings){
					var div_name = settings[key].key;
					var type = settings[key].type;
					var website_name = settings[key].website;
					this.createElements(key,div_name,type,website_name);
				}
			},		
			createElements: function(key,div_name,type,website_name){
				var div = document.createElement('div');
				document.querySelector('.list-items').appendChild(div);
				var item_number = key.match(/\d+$/);
				div.className = div_name;
				var input = document.createElement('input');
				div.appendChild(input);
				input.className = 'website';
				input.value = website_name;
				var div_switch = document.createElement('div');
				div.appendChild(div_switch);
				div_switch.className = 'switch';
				var options = ["good","ignore","bad"];
				
				for(var i, i = 0; i < options.length; i++){
					var input = document.createElement('input');
					div_switch.appendChild(input);
					var label = document.createElement('label');
					div_switch.appendChild(label);
					input.className = options[i];
					input.name = "state-"+item_number;
					input.type = "radio";
					label.innerHTML = options[i].toUpperCase();
					if(i === 0){
						input.id = "on-"+item_number;
						label.htmlFor = "on-"+item_number;
						if(type == "good"){
							input.checked = true;
						}
					}
					else if(i == 1){
						input.id = "no-"+item_number;
						label.htmlFor = "no-"+item_number;
						if(type == "ignore"){
							input.checked = true;
						}
					}
					else{
						input.id = "off-"+item_number;
						label.htmlFor = "off-"+item_number;
						if(type == "bad"){
							input.checked = true;
						}
					}
				}
				var link = document.createElement('a');
				div_switch.appendChild(link);
				var remove = document.createElement('div');
				div.appendChild(remove);
				remove.className = 'remove-item';
				eventListeners.listenToNewWebsite(div,'website'+item_number);	
				removeItem.remove_item(remove,'website'+item_number);
			}
	    };
	}
);