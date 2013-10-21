//listing.js

// listing module
var listing = function(){
	//private members
	var	addItem = function(){
			var name = encodeURIComponent(document.getElementById("name").value),
				price = encodeURIComponent(document.getElementById("price").value),
				quantity = encodeURIComponent(document.getElementById("quantity").value),
				description = encodeURIComponent(document.getElementById("description").value),
				method = "POST",
				sendTo = "listing.php", 
				params = "", 
				body = "name=" + name + "&price=" + price + "&quantity=" + quantity + "&description=" + description, 
				callback = addItemCallback;
			dataService.sendRequest(method, sendTo, params, body, callback);
		},

		addItemCallback = function(xml){
			message.showSuccessMessage(xml);
		},

		reset = function(){
			document.getElementById("name").value = "";
			document.getElementById("price").value = "";
			document.getElementById("quantity").value = "";
			document.getElementById("description").value = "";
		};
		
	//public members
	return{
		addItem: addItem,
		reset: reset
	}
}();

