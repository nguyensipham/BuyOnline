//mlogin.js

//managerLogin module
var managerLogin = function(){
	//private members
	var	login = function(){
			var managerId = document.getElementById("managerId").value,
				password = document.getElementById("password").value,
				method = "POST",
				sendTo = "mlogin.php", 
				params = "", 
				body = "managerId=" + managerId + "&password=" + password;
			dataService.sendRequest(method, sendTo, params, body, successCallback, errorCallback);
		},

		successCallback = function(responseText){						
			document.getElementById('info').innerHTML = "<p class='text-success'>Login succeeded. You can now <a href='listing.htm'>list items</a> or <a href='processing.htm'>process the sold items</a>.</p>";
			getLoginDetail();
		},

		errorCallback = function(responseText){
			document.getElementById('info').innerHTML = "<p class='text-error'>" + responseText + "</p>";
			getLoginDetail();
		};
		
	//public members
	return{
		login: login
	}	
}();

