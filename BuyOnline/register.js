// register.js

// register module
var register = function(){
	// private members
	var	register = function(){
			var firstname = document.getElementById("firstname").value,
				lastname = document.getElementById("lastname").value,
				email = document.getElementById("email").value,
				phone = document.getElementById("phone").value,
				password = document.getElementById("password").value,
				passwordAgain = document.getElementById("password-again").value,
				method = "POST",
				sendTo = "register.php", 
				params = "", 
				body = "firstname=" + firstname + "&lastname=" + lastname + "&email=" + email + "&phone=" + phone + "&password=" + password + "&passwordAgain=" + passwordAgain;
			dataService.sendRequest(method, sendTo, params, body, successCallback, errorCallback);
		},

		successCallback = function(responseText){
			document.getElementById('info').innerHTML = "<p class='text-success'>Registration succeeded. Your new customer id is " + responseText + " which can be used to log in to the system.</p><p><a href='buyonline.htm'>Back to BuyOnline</a></p>";
		},

		errorCallback = function(responseText){
			document.getElementById('info').innerHTML = "<p class='text-error'>" + responseText + "</p>";
		};
	
	// public members
	return{
		register: register
	}
}();

