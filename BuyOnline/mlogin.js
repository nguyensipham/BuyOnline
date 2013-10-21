//mlogin.js

//managerLogin module
var managerLogin = function(){
	//private members
	var	login = function(){
			var managerId = encodeURIComponent(document.getElementById("managerId").value),
				password = encodeURIComponent(document.getElementById("password").value),
				method = "POST",
				sendTo = "mlogin.php", 
				params = "", 
				body = "managerId=" + managerId + "&password=" + password;
			dataService.sendRequest(method, sendTo, params, body, callback);
		},

		callback = function(xml){	
			var msg = xmlData.getMessage(xml);			
			document.getElementById('info').innerHTML = "<p class='text-success'>Login succeeded. You can now <a href='listing.htm'>list items</a> or <a href='processing.htm'>process the sold items</a>.</p>";			
			document.getElementById("loginDetail").innerHTML = '<a href="logout.htm">Log out</a>';			
		};
		
	//public members
	return{
		login: login
	}	
}();

