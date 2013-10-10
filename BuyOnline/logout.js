// logout.js

// logout module
var logout = function(){
	//private members
	var logout = function(){
			var method = "GET",
				sendTo = "logout.php", 
				params = "", 
				body = "", 
				callback = logoutCallback;
			dataService.sendRequest(method, sendTo, params, body, callback, callback);
		},

		logoutCallback = function(responseText){								
			document.getElementById('info').innerHTML = responseText;
		};
		
	//public members
	return {
		logout: logout
	}
}();

