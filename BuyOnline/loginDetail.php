<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	Get logged in customer Id from session
*/ 
?>
<?php	
	$HTML = "";
	session_start();	
	
	if (isset($_SESSION['custid']) || isset($_SESSION['managerid']))							
		$HTML = 'Logged in';
	else
		$HTML = 'Not logged in';
	
	echo $HTML;
?>