// buying.js

// cart module
var cart = function(){
	//private members
	var addOneToCart = function(itemId, callback){
							var method = "GET",
								sendTo = "manageCart.php", 
								params = "?action=add&itemId=" + encodeURIComponent(itemId), 
								body = null;
							dataService.sendRequest(method, sendTo, params, body, callback);
						},
		removeFromCart = function(itemId, callback){
							var method = "GET",
								sendTo = "manageCart.php", 
								params = "?action=delete&itemId=" + encodeURIComponent(itemId), 
								body = null;
							dataService.sendRequest(method, sendTo, params, body, callback);
						},
		confirmPurchase = function(callback){
							var method = "GET",
								sendTo = "manageCart.php", 
								params = "?action=confirm", 
								body = null;
							dataService.sendRequest(method, sendTo, params, body, callback);
						},
		cancelPurchase = function(callback){
							var method = "GET",
								sendTo = "manageCart.php", 
								params = "?action=cancel", 
								body = null;
							dataService.sendRequest(method, sendTo, params, body, callback);
						},
		getCart = function(callback){
							var method = "GET",
								sendTo = "manageCart.php", 
								params = "?action=get", 
								body = null;
							dataService.sendRequest(method, sendTo, params, body, callback);
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
			cart.getCart(showCart);						
		},
		
		// remove an item from cart
		removeFromCart = function(itemId){						
			stopCatalogInterval();						
			cart.removeFromCart(itemId, showCart);
		},
		
		// confirm purchase
		confirmPurchase = function(){
			stopCatalogInterval();						
			cart.confirmPurchase(purchaseCallback);								
		},
		
		// cancel purchase
		cancelPurchase = function(){
			stopCatalogInterval();
			cart.cancelPurchase(purchaseCallback);
		},
		
		// clear message from info div
		clearInfor = function(){
			document.getElementById('info').innerHTML = "";
		},
		
		// clear cart
		clearCart = function(){
			document.getElementById("cart").innerHTML = "";	
		},
		
		// display purchase message
		purchaseCallback = function(xml){
			message.showSuccessMessage(xml);						
			clearCart();// clear the shopping cart
			updateCatalog();// refresh the catalog
		},				

		// add an item to cart
		addOneToCart = function(itemId){
			stopCatalogInterval();						
			cart.addOneToCart(itemId, showCart);						
		},					

		// display the cart based on the XML data received from the server
		showCart = function(xml){			
			var xslFile = "cart.xsl";
			var elementId = "cart";
			xsl.transformXMLData(xml, xslFile, elementId);
			
			updateCatalog();			
			clearInfor();				
		},
						

		// update catalog list
		updateCatalog = function(){
			stopCatalogInterval();
			var	method = "POST", //use POST to prevent IE caching
				sendTo = "catalog.php", 
				params = "", 
				body = "";
			dataService.sendRequest(method, sendTo, params, body, catalogCallback);
		},

		//call back function to display the catalog list after receiving XML data from server
		catalogCallback = function(xml){			
			var xslFile = "Catalog.xsl";
			var elementId = "catalog";
			xsl.transformXMLData(xml, xslFile, elementId);
			
			enableCatalogInterval();
		};
				
	
	// public members
	return{
		removeFromCart: removeFromCart,
		confirmPurchase: confirmPurchase,
		cancelPurchase: cancelPurchase,
		addOneToCart: addOneToCart,
		getExistingCart: getExistingCart,
		enableCatalogInterval: enableCatalogInterval
	}
}();



//override the loginDetailCallback method to call the getExistingCart() method afterwards
login.loginDetailCallback = function(xml){
	Login.prototype.loginDetailCallback.call(this, xml); // call the base method
	buying.getExistingCart();
}		

//override the showErrorMessage method to call the enableCatalogInterval() method afterwards
message.showErrorMessage = function(status, xml){
	Message.prototype.showErrorMessage.call(this, status, xml); // call the base method
	buying.enableCatalogInterval();
}