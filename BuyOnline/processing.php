<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	This manages manager processing
*/ 
?>
<?php include("commonFunc.php"); ?>
<?php
	$action = "";	
	$HTML = "";
		
	if (isset($_POST['action'])) {
		$action = $_POST['action'];
	} 
		
	session_start();
	
	if (!isset($_SESSION['managerid'])){ // Check authorization for manager logins only
		header('HTTP/1.0 401 Unauthorized');
	}
	else {	
		if ($action == "get"){ // get processing items		
			try{			
				//initialize goods.xml connection			
				goodsXmlInit();			
				// Use SimpleXMLElement and XPATH function to look up items
				$xml = simplexml_load_file($goodsXmlFileName);
				$itemsLookup = $xml->xpath("//item[qtySold>0]");									
								
				$doc = new DOMDocument('1.0', 'iso-8859-1');
				$items = $doc->createElement('items');
				$doc->appendChild($items);
				foreach ($itemsLookup as $index => $itemLookup)
				{    				
					$item = $doc->createElement('item');
					$items->appendChild($item);
					
					$itemId = $doc->createElement('itemId', $itemLookup->itemid); 
					$item->appendChild($itemId); 
					
					$name = $doc->createElement('name', $itemLookup->name); 
					$item->appendChild($name); 				
					
					$price = $doc->createElement('price', $itemLookup->price); 	
					$item->appendChild($price);
					
					$quantity = $doc->createElement('quantity', $itemLookup->quantity); 
					$item->appendChild($quantity);
					
					$qtyOnHold = $doc->createElement('qtyOnHold', $itemLookup->qtyOnHold); 
					$item->appendChild($qtyOnHold);
					
					$qtySold = $doc->createElement('qtySold', $itemLookup->qtySold); 
					$item->appendChild($qtySold);
				}
				header("Content-type: text/xml");
				echo $doc->saveXML(); // return serialized XML as a string
				
			} catch (Exception $e){
				header('HTTP/1.0 500 Internal Server Error');
				$HTML = $e->getMessage();
			}	
		}
		else if ($action == "process"){ // process items
			try{				
				//initialize goods.xml connection			
				goodsXmlInit();			
				// Use SimpleXMLElement and XPATH function to look up items
				$xml = simplexml_load_file($goodsXmlFileName);
				
				// clear quantity sold	
				$itemsLookup = $xml->xpath("//item[qtySold>0]");				
				if ($itemsLookup != null){
					foreach ($itemsLookup as $index => $itemLookup)
					{    
						$itemLookup->qtySold = 0; 
					}						
					$HTML = count($itemsLookup) . " items with sold quantities have been cleared.";
				} else {
					$HTML = "There is no items with non-zero sold quantities.";
				}
				
				//remove items completely sold
				$itemsLookup = $xml->xpath("//item[qtySold=0 and quantity=0]");				
				if ($itemsLookup != null){
					foreach ($itemsLookup as $index => $itemLookup)
					{    						
						$dom = dom_import_simplexml($itemLookup); // convert to DOMElement object from SimpleXMLElement object
						$dom->parentNode->removeChild($dom);
					}	
					$HTML .= "<br/>" . count($itemsLookup) . " completely sold items have been removed.";
				}
				
				$xml->asXml($goodsXmlFileName); // save xml file
			} catch (Exception $e){
				header('HTTP/1.0 500 Internal Server Error');
				$HTML = $e->getMessage();
			}		
		} 
		else{
			header('HTTP/1.0 400 Bad Request');	// bad request for invalid actions apart from "get" and "process"
		}			
		
		if ($HTML != "")		
			echo $HTML; // return the HTML message if not blank
	}	
?>
