// processing.js

// processing module
var processing = function(){
	//private members
	var	process = function(){
			var	method = "POST",
				sendTo = "processing.php", 
				params = "", 
				body = "action=process";
			dataService.sendRequest(method, sendTo, params, body, showSuccessText);
		},									

		showSuccessText = function(xml){
			message.showSuccessMessage(xml);
			document.getElementById('process').innerHTML = ""; //clear the processing form
		},

		getProcessingItems = function(){
			var	method = "POST",
				sendTo = "processing.php", 
				params = "", 
				body = "action=get";
			dataService.sendRequest(method, sendTo, params, body, processCallback);
		},

		processCallback = function (xml){
			var xslFile = "process.xsl";
			var elementId = "process";
			xsl.transformXMLData(xml, xslFile, elementId);
		};
		
	//public members
	return{
		process: process,
		getProcessingItems: getProcessingItems
	}
}();

//override the loginDetailCallback method to call the getProcessingItems() method afterwards
login.loginDetailCallback = function(xml){
	Login.prototype.loginDetailCallback.call(this, xml); // call the base method
	processing.getProcessingItems();
}	