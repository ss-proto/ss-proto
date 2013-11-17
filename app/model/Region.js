Ext.define("SelfScanning.model.Region", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql'
		},
		fields: [
			{name: 'GNr'},
			{name: 'PLZ'},
			{name: 'Ort'},
			{name: 'Str'}
		],
		hasMany: {
			model: 'SelfScanning.model.Store',
			name: 'Stores',
			foreignStore: 'localStoreStore'
		}
	}
});