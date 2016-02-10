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

add_item.addEventListener("click", function(e){
	
	var items = document.querySelectorAll('.item');
		item = items[items.length - 1];
		item_number = item.className.match(/\d+$/);
		new_item = item.cloneNode(true);
		
	container_items.appendChild(new_item);
	new_item.className = new_item.className.replace(/[0-9]/g,+item_number+1);
},false)
