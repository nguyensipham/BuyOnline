<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	Listing functions
*/ 
?>
<?php include("commonFunc.php"); ?>
<?php
	$errMsg = "";
	$name = "";
	$price = "";
	$quantity = "";
	$description = "";
	$qtyOnHold = "0"; // initial value
	$qtySold = "0"; // initial value
	$HTML = "";
	
	session_start();	
	header("Content-type: text/xml");
	if (!isset($_SESSION['managerid'])){ // Check authorization for manager logins only
		header('HTTP/1.0 401 Unauthorized');
		$HTML = "Authorization required.";
	}
	else {
	
		// Validate name
		if (isset($_POST["name"])) {
			$name = $_POST["name"];
			if (strcmp($_POST["name"],"") == 0)
				$errMsg .= "Item Name is required. ";
		}
		
		// Validate price
		if (isset($_POST["price"])) {
			$price = $_POST["price"];
			if (strcmp($price,"") == 0)
				$errMsg .= "Item Price is required. ";
			else if (!is_numeric($price)) // check numeric values
				$errMsg .= "Invalid Item Price numeric value. ";
			else if (floatval($price) < 0) 
				$errMsg .= "Item Price must be greater than or equal to zero!<br/>";
		}
		
		// Validate quantity
		if (isset($_POST["quantity"])) {
			$quantity = $_POST["quantity"];
			if (strcmp($quantity,"") == 0)
				$errMsg .= "Item Quantity is required. ";			
			else if (!is_numeric($quantity)) // check numeric values
				$errMsg .= "Item Quantity must be a greater than or equal to zero integer value. ";
			else if (intval($quantity) != floatval($quantity)) // check integer values
				$errMsg .= "Item Quantity must be an integer value. ";
			else if (intval($quantity) < 0) // check not negative values
				$errMsg .= "Item Quantity must be greater than or equal to zero. ";
		}
		
		// Validate description
		if (isset($_POST["description"])) {
			$description = $_POST["description"];
			if (strcmp($_POST["description"],"") == 0)
				$errMsg .= "Item Description is required. ";
		}
		
		header('HTTP/1.0 400 Bad Request');
		$HTML = $errMsg;
		if (isset($_POST["name"]) && isset($_POST['price']) && isset($_POST['quantity']) && isset($_POST['description']) && (strlen($errMsg) <= 0)) {	
			//initialize goods.xml connection
			goodsXmlInit();		
						
			// Use SimpleXMLElement and XPATH function to look up items
			$xml = simplexml_load_file($goodsXmlFileName);			
			
			$itemId = 1; // initialize the first item id as 1
			
			$maxItemId = $xml->xpath("//items/item[not(../item/itemid > itemid)]/itemid/text()"); // Get max item id
			if ($maxItemId != null)
				$itemId = intval($maxItemId[0]) + 1; // Add 1 to the max id for the new item id
				
			// load the xml document
			$dom = DOMDocument::load($goodsXmlFileName);
			
			// get the root node
			$rootNode = $dom->getElementsByTagName("items")->item(0);
			
			// create a new Item XML Node
			$itemNodeElem = $dom->createElement("item");
			
			// create child nodes for item node
			$itemIdElem = $dom->createElement("itemid", $itemId);
			$nameElem = $dom->createElement("name", htmlentities($name));
			$priceElem = $dom->createElement("price", floatval($price));
			$quantityElem = $dom->createElement("quantity", intval($quantity));
			$descriptionElem = $dom->createElement("description", htmlentities($description));
			$qtyOnHoldElem = $dom->createElement("qtyOnHold", $qtyOnHold);
			$qtySoldElem = $dom->createElement("qtySold", $qtySold);
			
			// add child nodes to customer node
			$itemNodeElem->appendChild($itemIdElem);
			$itemNodeElem->appendChild($nameElem);
			$itemNodeElem->appendChild($priceElem);
			$itemNodeElem->appendChild($quantityElem);
			$itemNodeElem->appendChild($descriptionElem);
			$itemNodeElem->appendChild($qtyOnHoldElem);
			$itemNodeElem->appendChild($qtySoldElem);
			
			// add customer node to the main dom
			$rootNode->appendChild($itemNodeElem);
			
			// format the XML output. This does not work when amendment
			//$dom->formatOutput = true;
			
			// save the xml file
			if ($dom->save($goodsXmlFileName)){
				//save succeeds
				header('HTTP/1.0 200 OK');
				$HTML = "The item has been listed in the system, and the item number is: $itemId";
			} else {
				//save fails
				header('HTTP/1.0 500 Internal Server Error');
				$HTML = "Error while saving XML file";
			}			
		}		
	}
	echo message($HTML);
?>