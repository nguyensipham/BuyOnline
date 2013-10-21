<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	Manager login function
*/ 
?>
<?php
	include("commonFunc.php");
	
	$errMsg = "";
	$managerId = "";
	$HTML = "";
	
	// Validate manager Id
	if (isset($_POST["managerId"])) {
		$managerId = $_POST["managerId"];
		if (strcmp($_POST["managerId"],"") == 0)
			$errMsg .= "Manager Id is required. ";
	}
	
	// Validate password
	if (isset($_POST['password'])) {
		$password = $_POST['password'];
		if (strcmp($_POST["password"],"") == 0)
			$errMsg .= "Password is required. ";
	} 
	
	header("Content-type: text/xml");
	header('HTTP/1.0 400 Bad Request');
	$HTML = $errMsg;
	if (isset($_POST["managerId"]) && isset($_POST['password']) && (strlen($errMsg) <= 0)) {	
		if (managerLogin($managerId, $password)){
			session_start();
			// Create session to store the manager id		
			$_SESSION['managerid'] = "$managerId";	
			header('HTTP/1.0 200 OK');
			$HTML = "Login succeeded";		
		} else {
			header('HTTP/1.0 403 Forbidden');
			$HTML = "The combination of Manager Id and Password is not found!";
		}
	}		
	
	echo message($HTML);
?>