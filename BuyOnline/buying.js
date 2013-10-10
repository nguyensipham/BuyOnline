// buying.js

// cart module
var cart = function(){
	//private members
	var addOneToCart = function(itemId, successCallback, errorCallback){
							var method = "GET",
								sendTo = "manageCart.php", 
								params = "?action=add&itemId=" + itemId, 
								body = null;
							dataService.sendRequest(method, sendTo, params, body, successCallback, errorCallback);
						},
		removeFromCart = function(itemId, successCallback, errorCallback){
							var method = "GET",
								sendTo = "manageCart.php", 
								params = "?action=delete&itemId=" + itemId, 
								body = null;
							dataService.sendRequest(method, sendTo, params, body, successCallback, errorCallback);
						},
		confirmPurchase = function(successCallback, errorCallback){
							var method = "GET",
								sendTo = "manageCart.php", 
								params = "?action=confirm", 
								body = null;
							dataService.sendRequest(method, sendTo, params, body, successCallback, errorCallback);
						},
		cancelPurchase = function(successCallback, errorCallback){
							var method = "GET",
								sendTo = "manageCart.php", 
								params = "?action=cancel", 
								body = null;
							dataService.sendRequest(method, sendTo, params, body, successCallback, errorCallback);
						},
		getCart = function(successCallback, errorCallback){
							var method = "GET",
								sendTo = "manageCart.php", 
								params = "?action=get", 
								body = null;
							dataService.sendRequest(method, sendTo, params, body, successCallback, errorCallback);
						};
						
	//public members
	return{
		addOneToCart: addOneToCart,
		removeFromCart: removeFromCart,
		confirmPurchase: confirmPurchase,
		cancelPurchase: cancelPurchase,
		getCart: getCart
	}
}();


// buying module
var buying = function(){
	// private members
	var intervalId = 0,
		
		// clear the periodical catalog update interval
		stopCatalogInterval = function(){
			clearInterval(intervalId);
		},
		
		// enable the periodical catalog update interval every 10 seconds
		enableCatalogInterval = function(){
			intervalId = setInterval(function(){updateCatalog();}, 10000);
		},
		
		// get existing cart from server
		getExistingCart = function(){
			stopCatalogInterval();						
			cart.getCart(showCart, showErrorText);						
		},
		
		// remove an item from cart
		removeFromCart = function(itemId){						
			stopCatalogInterval();						
			cart.removeFromCart(itemId, showCart, showErrorText);
		},
		
		// confirm purchase
		confirmPurchase = function(){
			stopCatalogInterval();						
			cart.confirmPurchase(showSuccessText, showErrorText);								
		},
		
		// cancel purchase
		cancelPurchase = function(){
			stopCatalogInterval();
			cart.cancelPurchase(showSuccessText, showErrorText);
		},
		
		// clear message from info div
		clearInfor = function(){
			document.getElementById('info').innerHTML = "";
		},
		
		// clear cart
		clearCart = function(){
			document.getElementById("cart").innerHTML = "";	
		},
		
		// display error message
		showErrorText = function(responseText){
			document.getElementById('info').className = "span12 text-error";
			document.getElementById('info').innerHTML = responseText;
			enableCatalogInterval();
		},

		// display success message
		showSuccessText = function(responseText){
			document.getElementById('info').className = "span12 text-success";
			document.getElementById('info').innerHTML = responseText;
			enableCatalogInterval();						
			clearCart();// clear the shopping cart
			updateCatalog();// refresh the catalog
		},				

		// add an item to cart
		addOneToCart = function(itemId){
			stopCatalogInterval();						
			cart.addOneToCart(itemId, showCart, showErrorText);						
		},					

		// display the cart based on the XML data received from the server
		showCart = function(responseXML){					
			if (responseXML != null && responseXML != ""){
				var items = responseXML.getElementsByTagName("item");																		
				var table = "<h4>Shopping Cart</h4><table class='table table-bordered cart'><tr><th>Item Number</th><th>Price</th><th>Quantity</th><th>Remove</th></tr>";						
				var itemId, itemPrice, itemQty, totalCost = 0;
				
				if (window.ActiveXObject) // IE uses "text"
				{ 
					for (i=0; i<items.length; i++){ // this will handle any number of items in the cart
						itemId = items[i].childNodes[0].text;
						itemPrice = items[i].childNodes[1].text;
						itemQty = items[i].childNodes[2].text;
						table += "<tr><td>" + itemId + "</td>"; 
						table += "<td>" + itemPrice + "</td>"; 
						table += "<td>" + itemQty + "</td>"; 
						table += "<td><button class='btn' onclick='buying.removeFromCart(" + itemId + ")'>Remove from cart</button></td></tr>"; // Remove from cart button				
						totalCost += itemPrice * itemQty;
					}	
				}
				else
				{ 
					for (i=0; i<items.length; i++){ // this will handle any number of items in the cart
						itemId = items[i].childNodes[0].textContent;
						itemPrice = items[i].childNodes[1].textContent;
						itemQty = items[i].childNodes[2].textContent;
						table += "<tr><td>" + itemId + "</td>"; 
						table += "<td>" + itemPrice + "</td>"; 
						table += "<td>" + itemQty + "</td>"; 
						table += "<td class='text-center'><button class='btn' onclick='buying.removeFromCart(" + itemId + ")'>Remove from cart</button></td></tr>"; // Remove from cart button				
						totalCost += itemPrice * itemQty;
					}
				}					
				
				table += "<tr><td colspan='3' class='total-cost-text'>Total Cost:</td><td class='total-cost-value'>$" + totalCost + "</td></tr>";									
				table += "<tr><td colspan='4' class='cart-btn'><span class='span6 text-center'><button class='btn' onclick='buying.confirmPurchase()'>Confirm Purchase</button></span>" +
						 "<span class='span6 text-center'><button class='btn' onclick='buying.cancelPurchase()'>Cancel Purchase</button></span></td></tr>";
				table += "</table>";							
				table += "<div class='span12'></div>";
										
				document.getElementById("cart").innerHTML = table;
			}
			updateCatalog();
			enableCatalogInterval();
			
			// clear all info
			clearInfor();
		},
						

		// update catalog list
		updateCatalog = function(){
			var	method = "GET",
				sendTo = "catalog.php", 
				params = "", 
				body = "";
			dataService.sendRequest(method, sendTo, params, body, catalogCallback, showErrorText);
		},

		//call back function to display the catalog list after receiving XML data from server
		catalogCallback = function(responseXML){
			if (responseXML != null && responseXML != ""){
				var items = responseXML.getElementsByTagName("item");
				var table = "<table class='table'><tr><th>Item Number</th><th>Name</th><th>Description</th><th>Price</th><th>Quantity</th><th>Add</th></tr>";
				
				if (window.ActiveXObject) // IE uses "text"
				{ 
					for (i=0; i<items.length; i++){ // this will handle any number of items in the catalog
						table += "<tr><td>" + items[i].childNodes[0].text + "</td>"; // item number
						table += "<td>" + items[i].childNodes[1].text + "</td>"; // name
						table += "<td>" + items[i].childNodes[4].text.substring(0,20) + "</td>"; // description - only 20 characters
						table += "<td>" + items[i].childNodes[2].text + "</td>"; // price
						table += "<td>" + items[i].childNodes[3].text + "</td>"; // quantity
						table += "<td><button class='btn' onclick='buying.addOneToCart(" + items[i].childNodes[0].text + ")'>Add one to cart</button></td></tr>"; // Add one to cart button					
					}
				}
				else
				{ 
					for (i=0; i<items.length; i++){ // this will handle any number of items in the catalog
						table += "<tr><td>" + items[i].childNodes[0].textContent + "</td>"; // item number
						table += "<td>" + items[i].childNodes[1].textContent + "</td>"; // name
						table += "<td>" + items[i].childNodes[4].textContent.substring(0,20) + "</td>"; // description - only 20 characters
						table += "<td>" + items[i].childNodes[2].textContent + "</td>"; // price
						table += "<td>" + items[i].childNodes[3].textContent + "</td>"; // quantity
						table += "<td><button class='btn' onclick='buying.addOneToCart(" + items[i].childNodes[0].textContent + ")'>Add one to cart</button></td></tr>"; // Add one to cart button					
					}		
				}
														
				table += "</table>";
				table += "<br>Total: " + items.length + " item(s)";
				
				document.getElementById('catalog').innerHTML = table;
			}
		};
				
	
	// public members
	return{
		removeFromCart: removeFromCart,
		confirmPurchase: confirmPurchase,
		cancelPurchase: cancelPurchase,
		addOneToCart: addOneToCart,
		getExistingCart: getExistingCart
	}
}();



//override the loginDetailCallback method to call the getExistingCart() method afterwards
login.loginDetailCallback = function(responseText){
	Login.prototype.loginDetailCallback.call(this, responseText); // call the base method
	buying.getExistingCart();
}		

