//buyOnlineScript.js

//static variables
var unauthorizedMsg = "<p class='text-error'>Authorization required!</p>";
var badRequestMsg = "<p class='text-error'>Bad request!</p>";
var systemErrMsg = "<p class='text-error'>Service unavailable!</p>";

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
						
		sendRequest = function(method, sendTo, params, body, successCallback, errorCallback){
			xHRObject.open(method, sendTo + params, true);
			if (method == "POST")
				xHRObject.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xHRObject.onreadystatechange = function() {												
												if (xHRObject.readyState == 4){												
													if (xHRObject.status == 200){ // OK
														if (xHRObject.responseXML != null && xHRObject.responseXML != "" && xHRObject.responseXML.xml != "") // if there is something in responseXML
															successCallback(xHRObject.responseXML);
														else
															successCallback(xHRObject.responseText); // if nothing in the responseXML
													}
													else if (xHRObject.status == 401) // Unauthorized
														errorCallback(unauthorizedMsg);
													else if (xHRObject.status == 400 || xHRObject.status == 409 || xHRObject.status == 500){ // Bad Request, Conflict or Internal Server Error
														if (xHRObject.responseText != null && xHRObject.responseText != "")
															errorCallback(xHRObject.responseText);
														else
															errorCallback(badRequestMsg);
													}
													else // Other status codes
														errorCallback(systemErrMsg);
												}
											};
			xHRObject.send(body); 
		}
	
	
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
	var loginDetailCallback = function(responseText){
			var html;
			if (responseText.indexOf("Not logged in") >= 0)															
				html = '<a href="login.htm">Customer Log In</a> or <a href="mlogin.htm">Store Manager Log In</a> or <a href="register.htm">Register</a>';
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
