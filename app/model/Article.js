Ext.define("SelfScanning.model.Article", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql'
		},
		identifier: 'uuid',
		idProperty: 'ANr',
		fields: [
			{name: 'ANr'},
			{name: 'PLU'},
			{name: 'ean'},
			{name: 'bezeichnung'},
			{name: 'mwst'},
			{name: 'weightType'},
			{name: 'deposit', type: 'float'},
			{name: 'restricted'},
			{name: 'timestamp'}
		]
	}
});