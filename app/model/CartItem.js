Ext.define("SelfScanning.model.CartItem", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql'
		},
		//idProperty: 'ean',
		identifier: 'sequential',
		fields: [
			{name: 'ANr', type: 'int'},
			{name: 'menge', type: 'int'},
			{name: 'weight', type: 'int'},
			{name: 'shoppingcart_id', type:'int'},
			{name: 'apmapping_id', type: 'int'}
		],
		hasOne: [{
			model: 'SelfScanning.model.APMapping',
			name: 'APMapping',
			//primaryKey: 'id',
			//foreignKey: 'apmapping_id',	// 'apmapping_id' soll benutzt werden, um das Article-Objekt zu identifizieren
			foreignStore: 'localAPMappingStore'
		}],
		belongsTo: [{
			model: 'SelfScanning.model.ShoppingCart',
			name: 'ShoppingCart',
			//primaryKey: 'shoppingcart_id',
			//foreignKey: 'shoppingCartId',
			foreignStore: 'shoppingCartStore'
		}]
	}
});