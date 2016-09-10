define([
		"storeData",
		"removeItem",
		"helpers"
	], 
	function (storeData,removeItem,helpers) {
	    return {
		    websites: function(){
			    return document.querySelector('.websites');
		    },
			listenToNewWebsite: function(new_item,index){
				//listen to inputs and save the data
				if (typeof index === 'undefined'){
					index = 'website1';
				}
				
				var new_website = new_item.querySelector('.website');
					
				new_website.addEventListener('keyup', function(){
					var input_value = this.value;
					var key = this.parentElement.className;
					var sibling = this.nextSibling;
					var swatchChildren = sibling.childNodes;
					var typeName = swatchChildren[0].getAttribute("name")
					var checkedType = helpers.getModernCheckedByName(swatchChildren,typeName)
					settings[index].key = key;
					settings[index].website = input_value;
					settings[index].type = checkedType[0].className;
					storeData.storeData();
				},false);
				
				var options = ["good","ignore","bad"];
				
				for(var i, i = 0; i < options.length; i++){
					new_item.querySelector('.'+options[i]).addEventListener('click', function(){
						if(this.checked){
							settings[index].type = this.className;
							storeData.storeData();
						}
					});
				};
			},
			attachClickEventsOnInputs: function(){
				//attach click events to inputs
				var _this = this;
				document.querySelector('.add-item').addEventListener("click", function(e){
					
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
					removeItem.remove_item(removable_item,index);
					
					new_item.querySelector('.website').value = ''; //don't copy input value
					for(var i, i = 0; i < labels.length; i++){
						inputs[i].id = inputs[i].id.replace(/[0-9]/g, item_number+1);
						inputs[i].name = inputs[i].name.replace(/[0-9]/g, item_number+1);
						labels[i].htmlFor = inputs[i].id;
						if(inputs[i].className == "ignore"){
							inputs[i].checked = true;
						}
					}
					document.querySelector('.list-items').appendChild(new_item);
					_this.listenToNewWebsite(new_item,index);
						
				},false);
			},
			menuToggle: function(){
				//toggle the menu
				var websites = this.websites();
				document.querySelector('.menu-container').addEventListener("click",function(e){
					var isOpen = websites.classList.contains('slide-in');
					var isClosed = websites.classList.contains('slide-out');
					document.querySelector('.menu').classList.toggle('active');
					websites.className = isOpen || isClosed ? websites.className += ' active' : '';
				    websites.className = isOpen ? websites.className.replace('slide-in','slide-out') : websites.className.replace('slide-out','slide-in');
				},false);
			}
	    };
	}
);