Ext.define("SelfScanning.view.Payment", {
	extend: "Ext.Container",
	alias: "widget.payment",
	id: 'payment',
	config: {
		items: [
			{xtype: 'container',
			layout: {
				type: 'vbox',
				pack: 'start',
				align: 'center'
			},
			cls: 'message',
			html: '',
			items: [
				{xtype: 'container',
				width: '100%',
				html: '<b>Um ihren Einkauf zu bezahlen,</b><br />'
					 +'	lassen Sie den QR-Code an der Kasse einscannen.<br />'
					 +'	<img id="qrimg" />'
					 +'	<div class="thankyou">Vielen Dank f&uuml;r Ihren Einkauf!</div>'},
				{xtype: 'button',
				ui: 'confirm',
				padding: 10,
				//iconCls: 'camera2',
				text: 'Einkauf abschlie&szlig;en',
				handler: function() {
					var cart = Ext.getCmp('shoppingcart').shoppingCartRecord;
					//cart.set('isComplete', true);
					//cart.save();
					cart.erase();
					Ext.getCmp('mainContent').pop();
				}}
			]},
			
		],
		record: {
			// this will get set after activating the view
		},
		listeners: {
			activate: function() {
				Ext.getCmp('mainContent').getNavigationBar().setTitle('Kasse');
				this.fireEvent('renderQRCode', this);
			}
		}
	}
});