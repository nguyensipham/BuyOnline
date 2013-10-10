//listing.js

// listing module
var listing = function(){
	//private members
	var	addItem = function(){
			var name = document.getElementById("name").value,
				price = document.getElementById("price").value,
				quantity = document.getElementById("quantity").value,
				description = document.getElementById("description").value,
				method = "POST",
				sendTo = "listing.php", 
				params = "", 
				body = "name=" + name + "&price=" + price + "&quantity=" + quantity + "&description=" + description, 
				callback = addItemCallback;
			dataService.sendRequest(method, sendTo, params, body, callback, callback);
		},

		addItemCallback = function(responseText){
			document.getElementById('info').innerHTML = responseText;
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

