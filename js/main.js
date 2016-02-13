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

//get previously saved websites
function getData(){
	chrome.storage.sync.get('settings',function(object){
		if(chrome.runtime.lastError){
			console.log("Runtime error.");
		}
		console.log(object)
	})
}
getData();

//store the websites
function storeData(){
	chrome.storage.sync.set({'settings':settings}, function () {
        console.log('Saved', settings);
    });
}

//chrome.storage.sync.clear()

var settings = {};
settings['website1'] = {};

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
	
	options = ["good","ignore","bad"];
	
	for(var i, i = 0; i < options.length; i++){
		new_item.querySelector('.'+options[i]).addEventListener('click', function(){
			if(this.checked){
				settings[index]["type"] = this.className;
				storeData();
			}
		})
	}
}
listenToNewWebsite(first_item);

//remove the input fields and delete the data associated with that input
var remove_item = function(removable_item,index){
	removable_item.addEventListener('click', function(e){
		removable_item.parentElement.remove();
		var key = removable_item.parentElement.className;
		console.log(key);
		delete settings[index];
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

