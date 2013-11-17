Ext.define("SelfScanning.view.StartShopping", {
	extend: "Ext.Container",
	alias: "widget.startshopping",
	requires: 'SelfScanning.view.ContinueShopping',
	config: {
		id: 'startshopping',
		title: 'Mobile SelfScanning',
		scrollable: 'vertical',
		layout: {
			type: 'vbox',
			pack: 'start',
			align: 'stretch'
		},
		items: [
			{xtype: 'container',
			id: 'newCart',
			layout: {
				type: 'vbox',
				pack: 'start',
				align: 'center'
				},
			items: [
				{xtype: 'container',
				cls: 'message',
				html: '<b>Beginnen Sie einen neuen Einkauf.</b><br />'
				  +'	Scannen Sie den QR-Code im Eingang der Filiale.'},
				{xtype: 'button',
				ui: 'confirm',
				iconCls: 'camera2',
				text: 'QR-Code scannen',
				handler: function() {
					this.parent.parent.fireEvent("newShoppingCartCommand");
				}}
				]
			},
			{xtype: 'continueshopping'}
		]
	}
});
