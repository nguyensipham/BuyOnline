<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output  method="html" indent="yes" version="4.0" doctype-public="-//W3C//DTD HTML 4.01//EN" doctype-system="http://www.w3.org/TR/html4/strict.dtd"/>
	<xsl:template match="/">
		<xsl:call-template name="DisplayCart"></xsl:call-template>
	</xsl:template>
	
	<xsl:template name="DisplayCart">		
		<xsl:if test="count(//item/itemid)>0">
			<h4>Shopping Cart</h4>
			<div class="span12">
				<table class='table table-bordered cart'>
					<tr><th>Item Number</th><th>Price</th><th>Quantity</th><th>Remove</th></tr>
					<xsl:for-each select="//item">
						<xsl:variable name="itemid" select="itemid"/>
						<tr>
							<td><xsl:value-of select="$itemid"/></td>
							<td>$<xsl:value-of select="price"/></td>
							<td><xsl:value-of select="quantity"/></td>			
							<td><button class='btn' onclick='buying.removeFromCart({$itemid})'>Remove from cart</button></td>
						</tr>
					</xsl:for-each>
					<tr>
						<td colspan='3' class='total-cost-text'>Total Cost:</td>
						<td class='total-cost-value'>$<xsl:value-of select="sum(//subtotal)"/></td>
					</tr>
					<tr>
						<td colspan='4' class='cart-btn'>
							<span class='span6 text-center'><button class='btn' onclick='buying.confirmPurchase()'>Confirm Purchase</button></span>
							<span class='span6 text-center'><button class='btn' onclick='buying.cancelPurchase()'>Cancel Purchase</button></span>
						</td>
					</tr>
				</table>
			</div>
		</xsl:if>		
	</xsl:template>
</xsl:stylesheet>