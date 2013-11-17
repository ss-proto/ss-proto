Ext.define("SelfScanning.model.APMapping", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql'
		},
		identifier: {
			type: 'simple'
			//seed: 1
		},
		idProperty: 'id',
		fields: [
			{name: 'ANr', mapping: 0},
			{name: 'FNr', mapping: 1, type: 'int'},
			{name: 'GNr', mapping: 2, type: 'int'},
			{name: 'vkp', mapping: 3, type: 'float'},
			{name: 'store_id', type: 'int'}
		],
		belongsTo: [{
			model: 'SelfScanning.model.Store',
			name: 'Store',
			//primaryKey: 'shoppingcart_id',
			//foreignKey: 'shoppingCartId',
			foreignStore: 'localStoreStore'
		}],
		hasOne: {
			model: 'SelfScanning.model.Article',
			name: 'Article',
			foreignKey: 'ANr',	// 'ANr' soll benutzt werden, um das Article-Objekt zu identifizieren
			foreignStore: 'localArticleStore'
		}
	}
});