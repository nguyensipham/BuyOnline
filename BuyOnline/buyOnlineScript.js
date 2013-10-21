//buyOnlineScript.js

// xmlData module
var xmlData = function(){
	// private members
	var		
		// Function to get value of a specified "element" tag in xml data
		getByElement = function(xml, element){
			if (xml == null) 
				return null;
			var msgs = xml.getElementsByTagName(element);	
			if (msgs.length == 0) 
				return null; // return null if no element found in the xml data
			if (window.ActiveXObject)	
				return msgs[0].text; // use "text" for IE		
			else			
				return msgs[0].textContent;	// use "textContent" for other browsers
		},
		
		// Function to get the message tag value from xml data
		getMessage = function(xml){
			return getByElement(xml, "message");
		};
	
	// public members
	return{
		getMessage: getMessage,
		getByElement: getByElement
	}
}();


// Message constructor and prototype. Needs to use prototype pattern so that the showErrorMessage can be overriden/extended by other scripts such as buying.js
var Message = function(){	
};

Message.prototype = function(){
	// private members	
	var 
		// script error event handler
		showScriptError = function(msg, url, line){
			alert("An error occurred: \nmessage: " + msg + "\nurl: " + url + "\nline: " + line);
			return true;
		},
		
		//data requests error handler
		showErrorMessage = function(status, xml){			
			var msg = xmlData.getMessage(xml);
			if (msg == null)
				msg = "Temporary system error.";
			var info = document.getElementById('info');
			if (info != null){ // display the error in the "info" div if exists
				info.className = "span12 text-error";
				info.innerHTML = msg;			
			} else { // otherwise, just show an alert
				alert("An error occurred: \nstatus: " + status + "\nerror: " + msg);	
			}
		},
		
		showSuccessMessage = function(xml){
			var msg = xmlData.getMessage(xml);	
			var info = document.getElementById('info');
			if (info != null){ // display the error in the "info" div if exists
				info.className = "span12 text-success";
				info.innerHTML = msg;
			} else { // otherwise, just show an alert
				alert("Process succeeded. Message: " + msg);	
			}
		};
	
	// public members
	return{
		showScriptError: showScriptError,
		showErrorMessage: showErrorMessage,
		showSuccessMessage: showSuccessMessage
	}
}();

var message = new Message(); //create message instance

onerror = message.showScriptError;


//xsl module
var xsl = function(){
	// private members
	var
		// Function to transform xml data using XSL
		transformXMLData = function(xml, xslFile, elementId){						
			//Load XSL
			var xhttp;
			if (window.XMLHttpRequest)
				xhttp = new XMLHttpRequest();
			else if (window.ActiveXObject)
				xhttp = new ActiveXObject("Microsoft.XMLHTTP");	
			
			xhttp.open("GET", xslFile, true); //async
			xhttp.onreadystatechange = function() {												
												if (xhttp.readyState == 4){												
													if (xhttp.status == 200){ // OK
														showDataCallback(xhttp.responseXML, xml, elementId);
													}													
													else{ // Other status codes
														message.showErrorMessage(xhttp.status, xhttp.responseXML);
														xhttp.abort(); // clear Http object
													}
												}
											};
			xhttp.send("");			
		},
		
		//Callback function after loading XSL file to display XML data
		showDataCallback = function(xsl, xml, elementId){
			var view = "";			
			// Transform XSL file
			if (window.ActiveXObject){ // IE					
				var transform = xml.transformNode(xsl);
				view = transform;	
			} else if (document.implementation && document.implementation.createDocument) { // Other browsers
				// Create XSLT Processor
				var xsltProcessor  = new XSLTProcessor();				
				xsltProcessor.importStylesheet(xsl);
				
				var fragment = xsltProcessor.transformToFragment(xml, document);
				view = new XMLSerializer().serializeToString(fragment);
			}
			document.getElementById(elementId).innerHTML = view;
		};
		
	//public members
	return{
		transformXMLData: transformXMLData
	}
}();

//dataService module
var dataService = function(){
	//private members
	var xHRObject = false,
	
		init = function(){
			if (window.XMLHttpRequest)
				xHRObject = new XMLHttpRequest();
			else if (window.ActiveXObject)
				xHRObject = new ActiveXObject("Microsoft.XMLHTTP");			
		},	
		
		// send XML request
		sendRequest = function(method, sendTo, params, body, callback){
			if (xHRObject.overrideMimeType)
				xHRObject.overrideMimeType("text/xml"); // ensure that responses sent as XML are properly handled
			xHRObject.open(method, sendTo + params, true); //async
			if (method == "POST")
				xHRObject.setRequestHeader("Content-type","application/x-www-form-urlencoded");	
			xHRObject.onreadystatechange = function() {												
												if (xHRObject.readyState == 4){												
													if (xHRObject.status == 200){ // OK
														callback(xHRObject.responseXML);
													}													
													else{ // Other status codes
														message.showErrorMessage(xHRObject.status, xHRObject.responseXML);
														xHRObject.abort(); // clear Http object
													}
												}
											};
			xHRObject.send(body); 
		};
	
	
	//public members
	return {
		init: init,
		sendRequest: sendRequest		
	};
}();

dataService.init();


// Login constructor and prototype. Needs to use prototype pattern so that the loginDetailCallback can be overriden/extended by other scripts such as buying.js or processing.js
var Login = function(){
	this.method = "GET";
	this.sendTo = "loginDetail.php";
	this.params = "";
	this.body = "";
};

Login.prototype = function(){
	//private members
	var loginDetailCallback = function(xml){
			var html, msg;			
			msg = xmlData.getMessage(xml);
				
			if (msg == "Not logged in")															
				html = '<a href="register.htm">Customer Register</a> or <a href="login.htm">Customer Log In</a> or <a href="mlogin.htm">Store Manager Log In</a>';
			else
				html = '<a href="logout.htm">Log out</a>';
			document.getElementById("loginDetail").innerHTML = html;
		},
	
		//method to be called in all pages to check if users has logged in or not. Corresponding links will appear at the top right of the website for login details
		getLoginDetail = function(){
			dataService.sendRequest(this.method, this.sendTo, this.params, this.body, this.loginDetailCallback, this.loginDetailCallback);
		};
	
	//public members
	return {
		getLoginDetail: getLoginDetail,
		loginDetailCallback: loginDetailCallback
	};
}();

var login = new Login(); //create login instance


window.onload = function(){
	login.getLoginDetail();
}