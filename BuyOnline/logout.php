<?php
	include("cart.php");
	
	$loggedInId = "";
	session_start();
	if (isset($_SESSION["Cart"])){ // clear the cart if exists			
		$myCart = $_SESSION["Cart"]; // assign the session variable to $myCart		
		$cart = Cart::Instance(); //get a Cart singleton instance
		try{
			$cart->cancel($myCart);			
		} catch (Exception $e){
			header('HTTP/1.0 400 Bad Request');
			$HTML = $e->getMessage();
		}	
	}
	if (isset($_SESSION['custid'])){ // customer logout
		$loggedInId = $_SESSION['custid'];
		$HTML = "Thank you, Customer ID #$loggedInId, for using BuyOnline. You are now logged off.";
	} 
	elseif (isset($_SESSION['managerid'])){ // manager logout
		$loggedInId = $_SESSION['managerid'];
		$HTML = "Thank you, Manager ID #$loggedInId. You are now logged off.";
	}
	else { // not logged in
		$HTML = "You have not logged in. Please log in first.";
	}
	// Delete the current session
	$_SESSION = array();
	session_destroy();		
	echo $HTML;
?>