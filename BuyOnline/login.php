<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	Login function
*/ 
?>
<?php include("commonFunc.php"); ?>
<?php
	$errMsg = "";
	$email = "";
	$HTML = "";
	
	// Validate email
	if (isset($_POST['email'])){	
		$email = $_POST['email'];
		if (strcmp($_POST["email"],"") == 0)
			$errMsg .= "The Email address is required!<br/>";
		else if (!isEmail($_POST['email']))
			$errMsg .= "Invalid email address!<br/>";
	}		
	
	// Validate password
	if (isset($_POST['password'])) {
		$password = $_POST['password'];
		if (strcmp($_POST["password"],"") == 0)
			$errMsg .= "Password is required!<br/>";
	} 
	header('HTTP/1.0 400 Bad Request');
	$HTML = $errMsg;
	if (isset($_POST["email"]) && isset($_POST['password']) && (strlen($errMsg) <= 0)) {	
		//initialize xml connection
		customerXmlInit();

		// Use SimpleXMLElement and XPATH function to look up customer No and password
		$xml = simplexml_load_file($xmlFileName);
		$custidLookup = $xml->xpath("//customer[email='$email' and password='$password']/custid/text()");
		if ($custidLookup == null){ // email and password not found			
			$HTML = "The combination of Email Address and Password is not found!";
		} else { // email and password found	
			session_start();
			// Create session to store the customer id		
			$_SESSION['custid'] = "$custidLookup[0]";
			header('HTTP/1.0 200 OK');		
			$HTML = "Login succeeded";		
		}
	}		
	
	echo $HTML;
?>