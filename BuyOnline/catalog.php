<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	This returns the list of goods items as XML data from the goods.xml file
*/ 
?>
<?php include("commonFunc.php"); ?>
<?php	
	try{
		//initialize goods.xml connection
		goodsXmlInit();		
		
		header("Content-type: text/xml");
		$fileContent = file_get_contents($goodsXmlFileName);
		if ($fileContent)
			echo $fileContent;
		else
			echo null;
	} catch (Exception $e){
		header('HTTP/1.0 500 Internal Server Error');
		$HTML = $e->getMessage();
	}	
?>