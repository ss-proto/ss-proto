Ext.define("SelfScanning.model.Store", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql'
		},
		fields: [
			{name: 'FNr'},
			{name: 'GNr'},
			{name: 'PLZ'},
			{name: 'Ort'},
			{name: 'Str'},
			{name: 'region_id', type: 'int'}
		],
		belongsTo: [{
			model: 'SelfScanning.model.Region',
			name: 'Region'
		}],
		hasMany: [{
			model: 'SelfScanning.model.APMapping',
			name: 'APMappings',
			foreignStore: 'localAPMappingStore'
		}]
	}
});