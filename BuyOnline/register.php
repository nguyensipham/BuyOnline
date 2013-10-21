<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	Registration function
*/ 
?>
<?php include("commonFunc.php"); ?>
<?php
	$errMsg = "";
	$HTML = "";
	$firstname = "";
	$lastname = "";
	$email = "";
	$phone = "";
	$password = "";	
	
	// Validate first name
	if (isset($_POST["firstname"])) {
		$firstname = $_POST["firstname"];
		if (strcmp($_POST["firstname"],"") == 0)
			$errMsg .= "First name is required. ";
	}
	
	// Validate last name
	if (isset($_POST["lastname"])) {
		$lastname = $_POST["lastname"];
		if (strcmp($_POST["lastname"],"") == 0)
			$errMsg .= "Last name is required. ";
	}
		
	// Validate email
	if (isset($_POST['email'])){	
		$email = $_POST['email'];
		if (strcmp($_POST["email"],"") == 0)
			$errMsg .= "Email address is required. ";
		else if (!isEmail($_POST['email']))
			$errMsg .= "Invalid email address. ";
	}		
	
	// Validate Phone
	if (isset($_POST['phone'])){
		$phone = $_POST['phone'];	
		if (strcmp($_POST["phone"],"") != 0 && !isValidPhone($_POST['phone']))			
			$errMsg .= "Invalid Phone Number. ";
	} 	
	
	// Validate password
	if (isset($_POST['password'])) {
		if (strcmp($_POST["password"],"") == 0)
			$errMsg .= "Password is required. ";
		else if (isset($_POST['passwordAgain']))
			if (strcmp($_POST["passwordAgain"],"") == 0)
				$errMsg .= "Password (again) is required. ";
			else if (!(strcmp($_POST['password'], $_POST['passwordAgain']) == 0))
				$errMsg .= "Password and Password (again) do not match. ";
			else
				$password = $_POST['password'];
	} 
	
	header("Content-type: text/xml");
	if ($errMsg != ""){
		header('HTTP/1.0 400 Bad Request');
		$HTML = $errMsg;
	}
	if (isset($_POST["firstname"]) && isset($_POST['lastname']) && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['passwordAgain']) && strlen($errMsg) <= 0) {				
		//initialize xml connection
		customerXmlInit();
		
		// Use SimpleXMLElement and XPATH function to look up emails
		$xml = simplexml_load_file($xmlFileName);
		$emailLookup = $xml->xpath("//customer[email='$email']/email/text()");
		if ($emailLookup != null){ // customer email already exists
			header('HTTP/1.0 409 Conflict');
			$HTML = "Email already exists.";
		} else { // customer email does not exist, save the new customer
					
			$custId = 1; // initialize the first customer id as 1
			
			$maxCustId = $xml->xpath("//customers/customer[not(../customer/custid > custid)]/custid/text()"); // Get max cust id
			if ($maxCustId != null)
				$custId = intval($maxCustId[0]) + 1; // Add 1 to the max id for the new cust id								
		
			// load the xml document
			$dom = DOMDocument::load($xmlFileName);
			
			// get the root node
			$rootNode = $dom->getElementsByTagName("customers")->item(0);
									
			// create a new Customer XML Node
			$custNodeElem = $dom->createElement("customer");
			
			// create child nodes for customer node
			$custIdElem = $dom->createElement("custid", $custId);
			$firstNameElem = $dom->createElement("firstname", htmlentities($firstname));
			$lastNameElem = $dom->createElement("lastname", htmlentities($lastname));
			$emailElem = $dom->createElement("email", htmlentities($email));
			$phoneElem = $dom->createElement("phone", $phone);
			$passwordElem = $dom->createElement("password", htmlentities($password));
			
			// add child nodes to customer node
			$custNodeElem->appendChild($custIdElem);
			$custNodeElem->appendChild($firstNameElem);
			$custNodeElem->appendChild($lastNameElem);
			$custNodeElem->appendChild($emailElem);
			$custNodeElem->appendChild($phoneElem);
			$custNodeElem->appendChild($passwordElem);
			
			// add customer node to the main dom
			$rootNode->appendChild($custNodeElem);
			
			// format the XML output. This does not work when amendment
			//$dom->formatOutput = true;
			
			// save the xml file
			if ($dom->save($xmlFileName)){
				//save succeeds
				$HTML = "$custId";
			} else {
				//save fails
				header('HTTP/1.0 500 Internal Server Error');
				$HTML = "Error while saving XML file";
			}
		}
	}
	echo message($HTML);
?>				
	