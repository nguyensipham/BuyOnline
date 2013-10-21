<?php 
/*
	Created by: 	Nguyen Si Pham - 723659X
	Created date:	19/09/2013	
	Description:	Cart class. This class is a singleton class which acts as a Data layer to handle all Cart connection to XML file
*/ 
?>
<?php include("commonFunc.php"); ?>
<?php
	/**
	* Singleton class
	*
	*/
	class Cart{
		private $xml;
		private $fileName;		
		
		/**
		* Call this method to get singleton
		*
		* @return Cart
		*/
		public static function Instance()
		{
			static $instance = null;
			if ($instance === null)
				$instance = new Cart();
			return $instance;
		}
		
		/**
		* Private ctor so nobody else can instance it
		*
		*/
		private function __construct()
		{			
			//initialize goods.xml connection			
			goodsXmlInit();		
			global $goodsXmlFileName;
			$this->fileName = $goodsXmlFileName;			
			// Use SimpleXMLElement and XPATH function to look up items
			$this->xml = simplexml_load_file($this->fileName);
		}
		
		/**
		* Add one item to the shopping cart
		* 
		* @return void
		*/
		public function add(&$aCart, $itemId)
		{			
			$itemLookup = $this->xml->xpath("//item[itemid='$itemId']");
			if ($itemLookup == null){ // item doest not exist
				throw new Exception("Requested item does not exist.");
			} else { // item exists
				// Check if the item is available
				$qtyAvailable = $itemLookup[0]->quantity;
				
				if ($qtyAvailable > 0) { // if quantity available is greater than 0
				
					// add new item to cart
					if (isset($aCart[$itemId]))						
						$aCart[$itemId] = $aCart[$itemId] + 1;
					else
						$aCart[$itemId] = "1";
					
					$itemLookup[0]->quantity = $qtyAvailable - 1; // decrease quantity available
					$itemLookup[0]->qtyOnHold = $itemLookup[0]->qtyOnHold + 1; // increase quantity on hold
					$this->xml->asXml($this->fileName); // save xml file						
					
				} else { // if quantity available is 0
					throw new Exception("Sorry, this item is not available for sale.");
				}					
			}
		}
		
		/**
		* Delete items based on the itemId from the shopping cart
		* 
		* @return void
		*/
		public function delete(&$aCart, $itemId)
		{
			if (isset($aCart[$itemId]))//item exists in cart
			{				
				$itemLookup = $this->xml->xpath("//item[itemid='$itemId']");
				if ($itemLookup == null){ // item doest not exist
					throw new Exception("Requested item does not exist.");
				} else { // item exists
					$itemLookup[0]->quantity = $itemLookup[0]->quantity + $aCart[$itemId]; // increase quantity available by the quantity shown in cart
					$itemLookup[0]->qtyOnHold = $itemLookup[0]->qtyOnHold - $aCart[$itemId]; // decrease quantity on hold
					$this->xml->asXml($this->fileName); // save xml file	
										
					$aCart[$itemId] = 0;// clear items in cart
					unset($aCart[$itemId]);// destroy the item in cart
				}
			} else { // item not exists in cart
				throw new Exception("Sorry, this item does not exist in your shopping cart.");
			}
		}
		
		/**
		* Confirm the shopping cart
		*
		* @return Total price
		*/
		public function confirm(&$aCart)
		{			
			$totalAmt = 0;
			if (is_array($aCart)){
				foreach ($aCart as $itemIdValue => $qtyValue)
				{    		
					if ($qtyValue > 0){
						$itemLookup = $this->xml->xpath("//item[itemid='$itemIdValue']");
						if ($itemLookup != null){										
							$itemLookup[0]->qtyOnHold = $itemLookup[0]->qtyOnHold - $qtyValue; // decrease quantity on hold
							$itemLookup[0]->qtySold = $itemLookup[0]->qtySold + $qtyValue; // increase quantity sold													
						}
								
						$itemPrice = $this->xml->xpath("//item[itemid='$itemIdValue']/price/text()");	
						$totalAmt += $qtyValue * $itemPrice[0];
					}
				}
				$this->xml->asXml($this->fileName); // save xml file	
				$aCart = null; // clear the cart
			}
			return $totalAmt;			
		}
		
		/**
		* Cancel the shopping cart
		*
		* @return void
		*/
		public function cancel(&$aCart)
		{			
			if (is_array($aCart)){
				foreach ($aCart as $itemIdValue => $qtyValue)
				{    		
					if ($qtyValue > 0){
						$itemLookup = $this->xml->xpath("//item[itemid='$itemIdValue']");
						if ($itemLookup != null){										
							$itemLookup[0]->qtyOnHold = $itemLookup[0]->qtyOnHold - $qtyValue; // decrease quantity on hold
							$itemLookup[0]->quantity = $itemLookup[0]->quantity + $qtyValue; // increase quantity													
						}					
					}
				}
				$this->xml->asXml($this->fileName); // save xml file	
				$aCart = null; // clear the cart
			}
		}
		
		/**
		* Serialzie the Cart variable to an XML string
		*
		* @return XML string
		*/
		public function toXml($aCart)
		{   	
			$doc = new DOMDocument('1.0', 'iso-8859-1');
			$cart = $doc->createElement('cart');
			$doc->appendChild($cart);
			if (is_array($aCart)){				
				foreach ($aCart as $itemIdValue => $qtyValue)
				{    
					if ($qtyValue > 0){
						$item = $doc->createElement('item');
						$cart->appendChild($item);
						
						$itemId = $doc->createElement('itemid', $itemIdValue); 
						$item->appendChild($itemId); 
						
						$itemPrice = $this->xml->xpath("//item[itemid='$itemIdValue']/price/text()");		
						$price = $doc->createElement('price', $itemPrice[0]); 	
						$item->appendChild($price);
						
						$quantity = $doc->createElement('quantity', $qtyValue); 
						$item->appendChild($quantity);
						
						$subtotal = $doc->createElement('subtotal', $itemPrice[0] * $qtyValue); 
						$item->appendChild($subtotal);
					}
				}				
			}
			return $doc->saveXML(); // return serialized XML as a string
		}	
	}
?>