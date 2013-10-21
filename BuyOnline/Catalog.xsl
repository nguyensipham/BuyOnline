<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output  method="html" indent="yes" version="4.0" doctype-public="-//W3C//DTD HTML 4.01//EN" doctype-system="http://www.w3.org/TR/html4/strict.dtd"/>
	<xsl:template match="/">
		<xsl:call-template name="DisplayCatalog"></xsl:call-template>
	</xsl:template>
	
	<xsl:template name="DisplayCatalog">
		<xsl:choose>
			<xsl:when test="count(//item/itemid)>0">
				<table class='table'>
					<tr><th>Item Number</th><th>Name</th><th>Description</th><th>Price</th><th>Quantity</th><th>Add</th></tr>
					<xsl:for-each select="//item">
						<xsl:variable name="itemid" select="itemid"/>
						<tr>
							<td><xsl:value-of select="$itemid"/></td>
							<td><xsl:value-of select="name"/></td>
							<td><xsl:value-of select="substring(description/text(),1,20)"/></td>
							<td>$<xsl:value-of select="price"/></td>
							<td><xsl:value-of select="quantity"/></td>			
							<td><button class='btn' onclick='buying.addOneToCart({$itemid})'>Add one to cart</button></td>
						</tr>
					</xsl:for-each>
				</table> 
			</xsl:when>
			<xsl:otherwise>
				<div class='span12 text-warning'>There is no items available.</div>
			</xsl:otherwise>
		</xsl:choose>		
	</xsl:template>
</xsl:stylesheet>