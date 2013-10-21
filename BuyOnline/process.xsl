<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output  method="html" indent="yes" version="4.0" doctype-public="-//W3C//DTD HTML 4.01//EN" doctype-system="http://www.w3.org/TR/html4/strict.dtd"/>
	<xsl:template match="/">
		<xsl:call-template name="DisplayProcess"></xsl:call-template>
	</xsl:template>
	
	<xsl:template name="DisplayProcess">
		<h4>Processing Form</h4>
		<xsl:choose>
			<xsl:when test="count(//item/itemId)>0">
				<table class='table'>
					<tr><th>Item Number</th><th>Name</th><th>Price</th><th>Qty Available</th><th>Qty on Hold</th><th>Qty Sold</th></tr>			
					<xsl:for-each select="//item">				
						<tr>
							<td><xsl:value-of select="itemId"/></td>
							<td><xsl:value-of select="name"/></td>
							<td>$<xsl:value-of select="price"/></td>
							<td><xsl:value-of select="quantity"/></td>
							<td><xsl:value-of select="qtyOnHold"/></td>
							<td><xsl:value-of select="qtySold"/></td>				
						</tr>
					</xsl:for-each>
				</table> 
				<div class='span12'></div>
				<span class='span12 text-center'><button id='process-btn' class='btn btn-large' onclick='processing.process()'>Process</button></span>
				<div class="span12"></div>
			</xsl:when>
			<xsl:otherwise>
				<div class='span12 text-warning'>There is no items to be processed.</div>
			</xsl:otherwise>
		</xsl:choose>		
	</xsl:template>
</xsl:stylesheet>
