// processing.js

// processing module
var processing = function(){
	//private members
	var	process = function(){
			var	method = "POST",
				sendTo = "processing.php", 
				params = "", 
				body = "action=process";
			dataService.sendRequest(method, sendTo, params, body, showSuccessText, showErrorText);
		},									
		
		showErrorText = function(responseText){
			document.getElementById('infor').className = "span12 text-error";
			document.getElementById('infor').innerHTML = responseText;					
		},

		showSuccessText = function(responseText){
			document.getElementById('infor').className = "span12 text-success";
			document.getElementById('infor').innerHTML = responseText;
			document.getElementById('process').innerHTML = ""; //clear the processing form
		},

		getProcessingItems = function(){
			var	method = "POST",
				sendTo = "processing.php", 
				params = "", 
				body = "action=get";
			dataService.sendRequest(method, sendTo, params, body, processCallback, showErrorText);
		},

		processCallback = function (responseXML){
			if (responseXML != null && responseXML != ""){
				var items = responseXML.getElementsByTagName("item");
											
				document.getElementById('process-btn').disabled = items.length == 0; // disable the Process button if no items found
					
				var table = "<h4>Processing Form</h4><table class='table'><tr><th>Item Number</th><th>Name</th><th>Price</th><th>Qty Available</th><th>Qty on Hold</th><th>Qty Sold</th></tr>";
				
				if (window.ActiveXObject) // IE uses "text"
				{ 
					for (i=0; i<items.length; i++){ // this will handle any number of items in the catalog
						table += "<tr><td>" + items[i].childNodes[0].text + "</td>"; // item number
						table += "<td>" + items[i].childNodes[1].text + "</td>"; // name
						table += "<td>" + items[i].childNodes[2].text + "</td>"; // Price
						table += "<td>" + items[i].childNodes[3].text + "</td>"; // Qty Available
						table += "<td>" + items[i].childNodes[4].text + "</td>"; // Qty on Hold									
						table += "<td>" + items[i].childNodes[5].text + "</td>"; // Qty Sold									
					}
				}
				else
				{ 
					for (i=0; i<items.length; i++){ // this will handle any number of items in the catalog
						table += "<tr><td>" + items[i].childNodes[0].textContent + "</td>"; // item number
						table += "<td>" + items[i].childNodes[1].textContent + "</td>"; // name
						table += "<td>" + items[i].childNodes[2].textContent + "</td>"; // Price
						table += "<td>" + items[i].childNodes[3].textContent + "</td>"; // Qty Available
						table += "<td>" + items[i].childNodes[4].textContent + "</td>"; // Qty on Hold									
						table += "<td>" + items[i].childNodes[5].textContent + "</td>"; // Qty Sold
					}		
				}
														
				table += "</table>";	
				document.getElementById('process').innerHTML = table;
			}
		};
		
	//public members
	return{
		process: process,
		getProcessingItems: getProcessingItems
	}
}();

//override the loginDetailCallback method to call the getProcessingItems() method afterwards
login.loginDetailCallback = function(responseText){
	Login.prototype.loginDetailCallback.call(this, responseText); // call the base method
	processing.getProcessingItems();
}	