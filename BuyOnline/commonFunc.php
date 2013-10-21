<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	This file contains common functions which are used by most pages of the BuyOnline system
*/ 
?>
<?php
	
// function to validate manager logins
function managerLogin($managerId, $password){	
	$filename = "../../data/manager.txt";
	if (file_exists ($filename)) { 
		$lines = file($filename);		
		foreach ($lines as $line_num => $line){
			$rec = explode (",", $line);
			$mId = trim($rec[0]);
			$mPassword = trim($rec[1]);		
			
			if ($mId == $managerId && $mPassword == $password)
				return true;
		}
	}
	return false;
}

// Function to initialize connection to goods.xml file
function goodsXmlInit(){
	// This is the only folder with write access
	umask (0007);
		
	// create the xml file goods.xml if not exists
	global $goodsXmlFileName;
	$goodsXmlFileName = "../../data/goods.xml";
	if (!file_exists ($goodsXmlFileName)){
		$fileHandle = fopen ($goodsXmlFileName, "w");				
		fclose ($fileHandle);
		//create an empty xml document
		$dom = new DOMDocument('1.0', 'iso-8859-1');
		// create a new empty root node
		$rootNode = $dom->createElement("items");
		// add root node to the main dom
		$dom->appendChild($rootNode);
		// save the xml file
		if ($dom->save($goodsXmlFileName)){
			//save succeeds				
		} else {
			//save fails			
			throw new Exception("Error while saving xml file!");
		}
	}
}

// Function to initialize connection to XML file
function customerXmlInit(){
	// This is the only folder with write access
	umask (0007);
		
	// create the xml file customer.xml if not exists
	global $xmlFileName;
	$xmlFileName = "../../data/customer.xml";
	if (!file_exists ($xmlFileName)){
		$fileHandle = fopen ($xmlFileName, "w");				
		fclose ($fileHandle);
		//create an empty xml document
		$dom = new DOMDocument('1.0', 'iso-8859-1');
		// create a new empty root node
		$rootNode = $dom->createElement("customers");
		//$rootNode->setAttribute("id", "root");
		// add customer node to the main dom
		$dom->appendChild($rootNode);
		// save the xml file
		if ($dom->save($xmlFileName)){
			//save succeeds				
		} else {
			//save fails
			throw new Exception("Error while saving xml file!");
		}
	}
}

// Check valid phone
function isValidPhone($phone){
	$format = "/^\(0\d\)\d{8}$|^04\d{8}$/";
	return preg_match($format, $phone);
}

//Function to check if valid email. This function does not use the built-in function of PHP. Instead, based on the requirement, the rule is simplified as following:
// BR: (a) The format of email addresses is local-part@domain-part; 
// (b) The local part may contain (i) Uppercase and lowercase English letters (a–z, A–Z) (ASCII: 65–90, 97–122), (ii) Digits 0 to 9 (ASCII: 48–57), 
//     (iii) Characters !#$%&'*+-/=?^_`{|}~ (ASCII: 33, 35–39, 42, 43, 45, 47, 61, 63, 94–96, 123–126) (You are allowed to simplify this by selecting a few characters, if not all), 
//     and (iv) Character . (dot, period, full stop) (ASCII: 46); 
// (c) The domain name must match the requirements for a hostname, consisting of letters, digits, hyphens and dots
function isEmail($email){							
	$format = "/^[a-zA-Z0-9]+[a-zA-Z0-9\!\#\$\%\&\'\*\+\-\/\=\?\^\_\`\{\|\}\~\.]*[@][a-zA-Z0-9\-]+([.][a-zA-Z0-9\-]+)+[a-zA-Z0-9]+$/";
	return preg_match($format, $email);
	//return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to convert to XML message to return to client
function message($msg){
	return "<message>$msg</message>";
}

?>