// login.js

// customer login module
var custLogin = function(){
	//private members
	var login = function(){
			var email = document.getElementById("email").value,
				password = document.getElementById("password").value,
				method = "POST",
				sendTo = "login.php", 
				params = "", 
				body = "email=" + email + "&password=" + password;
			dataService.sendRequest(method, sendTo, params, body, successCallback, errorCallback);
		},

		successCallback = function(responseText){
			window.location = "buying.htm"; // redirect to buying page
		},

		errorCallback = function(responseText){
			document.getElementById('info').innerHTML = responseText;						
		};
		
	//public members
	return{
		login: login		
	}
}();

