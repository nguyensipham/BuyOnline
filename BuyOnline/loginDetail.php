<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	Function to check if a user/manager has logged in or not and return to the client
*/ 
?>
<?php	
	include("commonFunc.php");
	
	$HTML = "";
	session_start();	
	header("Content-type: text/xml");
	if (isset($_SESSION['custid']) || isset($_SESSION['managerid']))							
		$HTML = 'Logged in';
	else
		$HTML = 'Not logged in';
	
	echo message($HTML);
?>