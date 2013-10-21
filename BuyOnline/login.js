// login.js

// customer login module
var custLogin = function(){
	//private members
	var login = function(){
			var email = encodeURIComponent(document.getElementById("email").value),
				password = encodeURIComponent(document.getElementById("password").value),
				method = "POST",
				sendTo = "login.php", 
				params = "", 
				body = "email=" + email + "&password=" + password;
			dataService.sendRequest(method, sendTo, params, body, callback);
		},

		callback = function(xml){			
			window.location = "buying.htm"; // redirect to buying page			
		};
		
	//public members
	return{
		login: login
	}
}();

