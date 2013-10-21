// register.js

// register module
var register = function(){
	// private members
	var	register = function(){
			var firstname = encodeURIComponent(document.getElementById("firstname").value),
				lastname = encodeURIComponent(document.getElementById("lastname").value),
				email = encodeURIComponent(document.getElementById("email").value),
				phone = encodeURIComponent(document.getElementById("phone").value),
				password = encodeURIComponent(document.getElementById("password").value),
				passwordAgain = encodeURIComponent(document.getElementById("password-again").value),
				method = "POST",
				sendTo = "register.php", 
				params = "", 
				body = "firstname=" + firstname + "&lastname=" + lastname + "&email=" + email + "&phone=" + phone + "&password=" + password + "&passwordAgain=" + passwordAgain;
			dataService.sendRequest(method, sendTo, params, body, callback);
		},

		callback = function(xml){
			var msg = xmlData.getMessage(xml);
			document.getElementById('info').innerHTML = "<p class='text-success'>Registration succeeded. Your new customer id is " + msg + " which can be used to log in to the system.</p><p><a href='buyonline.htm'>Back to BuyOnline</a></p>";
		};
	
	// public members
	return{
		register: register
	}
}();

