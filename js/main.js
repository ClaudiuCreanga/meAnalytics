var menu = document.querySelector('.menu');
	menu_container = document.querySelector('.menu-container');
	websites = document.querySelector('.websites');
	add_item = document.querySelector('.add-item');
	container_items = document.querySelector('.list-items');
	
menu_container.addEventListener("click",function(e){
	var isOpen = websites.classList.contains('slide-in');
	var isClosed = websites.classList.contains('slide-out');
	menu.classList.toggle('active');
	websites.className = isOpen || isClosed ? websites.className += ' active' : '';
    websites.className = isOpen ? websites.className.replace('slide-in','slide-out') : websites.className.replace('slide-out','slide-in');
},false);


var number_of_websites = 1;
var decrease_websites = function(number_of_websites){
	number_of_websites -= 1;
	storeWebsites();
}
var increase_websites = function(number_of_websites){
	number_of_websites += 1;
	storeWebsites();
}
function storeWebsites(){
	chrome.storage.sync.set(settings, function () {
        console.log('Saved', settings);
    });
}

var settings = {};
var list_inputs = websites.getElementsByTagName('input');
for(var i, i = 0; i < list_inputs.length; i++){
	list_inputs[i].addEventListener('keyup', function(){
		var input_value = this.value;
		var key = this.parentElement.className;
		settings["website"] = input_value;
		settings["key"] = key;
		console.log(key)
		increase_websites();
	},false)
}

var remove_item = function(removable_item){
	removable_item.addEventListener('click', function(e){
		removable_item.parentElement.remove();
		decrease_websites;
	},false);
}

add_item.addEventListener("click", function(e){
	
	var items = document.querySelectorAll('.item');
		item = items[items.length - 1];
		item_number = item.className.match(/\d+$/);
		new_item = item.cloneNode(true);
		
	new_item.className = new_item.className.replace(/[0-9]/g,+item_number+1);
	var labels_inputs = new_item.querySelector('.switch');
		labels = labels_inputs.getElementsByTagName('label');
		inputs = labels_inputs.getElementsByTagName('input');
		removable_item = new_item.querySelector('.remove-item');
	remove_item(removable_item);
	
	for(var i, i = 0; i < labels.length; i++){
		inputs[i].id = inputs[i].id.replace(/[0-9]/g, +item_number+1);
		inputs[i].name = inputs[i].name.replace(/[0-9]/g, +item_number+1);
		labels[i].htmlFor = inputs[i].id;
	}
	container_items.appendChild(new_item);
		
},false);

