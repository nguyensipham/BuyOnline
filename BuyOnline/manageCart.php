<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	This manages cart requests from the clients
*/ 
?>
<?php include("cart.php"); ?>
<?php
	$action = "";
	$itemId = "";
	$HTML = "";
		
	if (isset($_GET['action'])) {
		$action = $_GET['action'];
	} 
	
	if (isset($_GET["itemId"])) {
		$itemId = $_GET["itemId"];		
	}	
		
	session_start();
	header("Content-type: text/xml");
	
	if (!isset($_SESSION['custid'])){ // Check authorization for customer logins only
		header('HTTP/1.0 401 Unauthorized');
		$HTML = "Authorization required.";
	} else {	
		// Create Cart session if not exists
		if (!isset($_SESSION["Cart"])) // the "cart" does not exist, create an empty one.
			$_SESSION["Cart"] = "";
			
		$myCart = $_SESSION["Cart"]; // assign the session variable to $myCart		
		$cart = Cart::Instance(); //get a Cart singleton instance
		
		if ($action == "add"){ // add items		
			try{
				$cart->add($myCart, $itemId);
			} catch (Exception $e){
				header('HTTP/1.0 400 Bad Request');
				$HTML = $e->getMessage();
			}	
		}
		else if ($action == "delete"){ // delete items
			try{
				$cart->delete($myCart, $itemId);
			} catch (Exception $e){
				header('HTTP/1.0 400 Bad Request');
				$HTML = $e->getMessage();
			}		
		} 
		else if ($action == "confirm"){ // confirm purchase				
			try{
				
				if (count($myCart) == 0 || $myCart == null){
					header('HTTP/1.0 400 Bad Request');
					$HTML = "There is no items in your shopping cart.";
				}
				else {
					$totalAmt = $cart->confirm($myCart);
					$HTML = "Your purchase has been confirmed and total amount due to pay is $" . $totalAmt;
				}				
			} catch (Exception $e){
				header('HTTP/1.0 500 Internal Server Error');
				$HTML = $e->getMessage();
			}	
		}
		else if ($action == "cancel"){ // cancel purchase
			try{
				if (count($myCart) == 0 || $myCart == null){
					header('HTTP/1.0 400 Bad Request');
					$HTML = "There is no items in your shopping cart.";
				}
				else {
					$cart->cancel($myCart);
					$HTML = "Your purchase request has been cancelled, welcome to shop next time";
				}
			} catch (Exception $e){
				header('HTTP/1.0 500 Internal Server Error');
				$HTML = $e->getMessage();
			}			
		}
		else if ($action == "get"){ // if action is "get", just exit the "if else" and return the existing cart		
			// do nothing
		}
		else{
			header('HTTP/1.0 400 Bad Request');	// bad request for invalid actions apart from "add", "delete", "confirm", "cancel" and "get"
			$HTML = "Invalid action in query string.";
		}		
		
		// copy modified cart to session variable, convert to serialized XML and send to client
		$_SESSION["Cart"] = $myCart;
		
		if ($HTML == ""){		
			echo ($cart->toXml($myCart)); // returns cart in XML format if there is no HTML message
		}			
	}
	if ($HTML != "")
		echo message($HTML); // otherwise, return the HTML message
?>
