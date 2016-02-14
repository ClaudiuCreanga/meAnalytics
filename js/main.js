var menu = document.querySelector('.menu');
	menu_container = document.querySelector('.menu-container');
	websites = document.querySelector('.websites');
	add_item = document.querySelector('.add-item');
	container_items = document.querySelector('.list-items');
	first_item = document.querySelector('.list-items .website-1');
	
//toggle the menu
menu_container.addEventListener("click",function(e){
	var isOpen = websites.classList.contains('slide-in');
	var isClosed = websites.classList.contains('slide-out');
	menu.classList.toggle('active');
	websites.className = isOpen || isClosed ? websites.className += ' active' : '';
    websites.className = isOpen ? websites.className.replace('slide-in','slide-out') : websites.className.replace('slide-out','slide-in');
},false);

//store the websites
function storeData(){
	chrome.storage.sync.set({'settings':settings}, function () {
        console.log('Saved', settings);
    });
}

//create the fields from previous saved settings
function createFromSettings(settings){
	container_items.innerHTML= "";
	console.log(settings)
	for(var key in settings){
		var div_name = settings[key]["key"];
		var type = settings[key]["type"];
		var website_name = settings[key]["website"];
		createElements(key,div_name,type,website_name);
		console.log(website_name)
	}
}
function createElements(key,div_name,type,website_name){
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
		if(i == 0){
			input.id = "on-"+item_number;
			label.htmlFor = "on-"+item_number;
			if(type == "good"){
				input.checked = true
			}
		}
		else if(i == 1){
			input.id = "no-"+item_number;
			label.htmlFor = "no-"+item_number;
			if(type == "ignore"){
				input.checked = true
			}
		}
		else{
			input.id = "off-"+item_number;
			label.htmlFor = "off-"+item_number;
			if(type == "bad"){
				input.checked = true
			}
		}
	}
	var link = document.createElement('a');
	div_switch.appendChild(link);
	var remove = document.createElement('div');
	div.appendChild(remove);
	remove.className = 'remove-item';
	listenToNewWebsite(div,'website'+item_number);	
	remove_item(remove,'website'+item_number);
}

//get previously saved websites
function getData(){
	chrome.storage.sync.get('settings',function(object){
		if(chrome.runtime.lastError){
			console.log("Runtime error.");
		}
		var stored_data = object;
		console.log(Object.keys(stored_data).length)
		if(Object.keys(stored_data).length){
			settings = stored_data['settings'];
			createFromSettings(settings);
		}
		else{
			settings = {};
			settings['website1'] = {};
			listenToNewWebsite(first_item);
		}
	})	
}
getData()

//chrome.storage.sync.clear()

//listen to inputs and save the data
var listenToNewWebsite = function(new_item,index){
	
	if (typeof index === 'undefined'){
		index = 'website1';
	}
	
	var new_website = new_item.querySelector('.website');
		
	new_website.addEventListener('keyup', function(){
		var input_value = this.value;
		var key = this.parentElement.className;
		settings[index]["key"] = key;
		settings[index]["website"] = input_value;
		storeData();
	},false);
	
	var options = ["good","ignore","bad"];
	
	for(var i, i = 0; i < options.length; i++){
		new_item.querySelector('.'+options[i]).addEventListener('click', function(){
			if(this.checked){
				settings[index]["type"] = this.className;
				storeData();
			}
		})
	}
}

//remove the input fields and delete the data associated with that input
var remove_item = function(removable_item,index){
	removable_item.addEventListener('click', function(e){
		removable_item.parentElement.remove();
		var key = removable_item.parentElement.className;
		console.log(key);
		delete settings[index];
		storeData();
	},false);
}

//attach click events to inputs
add_item.addEventListener("click", function(e){
	
	var items = document.querySelectorAll('.item');
		item = items[items.length - 1];
		item_number = parseInt(item.className.match(/\d+$/));
		index = "website"+(item_number+1);
		new_item = item.cloneNode(true);
		
	settings[index] = {};
	
	new_item.className = new_item.className.replace(/[0-9]/g,item_number+1);
	var labels_inputs = new_item.querySelector('.switch');
		labels = labels_inputs.getElementsByTagName('label');
		inputs = labels_inputs.getElementsByTagName('input');
		removable_item = new_item.querySelector('.remove-item');
	remove_item(removable_item,index);
	
	new_item.querySelector('.website').value = ''; //don't copy input value
	for(var i, i = 0; i < labels.length; i++){
		inputs[i].id = inputs[i].id.replace(/[0-9]/g, item_number+1);
		inputs[i].name = inputs[i].name.replace(/[0-9]/g, item_number+1);
		labels[i].htmlFor = inputs[i].id;
	}
	container_items.appendChild(new_item);
	listenToNewWebsite(new_item,index);
		
},false);

