<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	This returns the list of goods items as XML data from the goods.xml file
*/ 
?>
<?php include("commonFunc.php"); ?>
<?php	
	$HTML = "";
	session_start();
	header("Content-type: text/xml");
	if (!isset($_SESSION['custid'])){ // Check authorization for customer logins only
		header('HTTP/1.0 401 Unauthorized');
		$HTML = "Authorization required.";
	} else {
		try{		
			//initialize goods.xml connection
			goodsXmlInit();										
			$fileContent = file_get_contents($goodsXmlFileName);
			if ($fileContent)
				echo $fileContent;
			return;
		} catch (Exception $e){
			header('HTTP/1.0 500 Internal Server Error');
			$HTML = $e->getMessage();
		}
	}
	echo message($HTML);
?>