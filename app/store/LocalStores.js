Ext.define('SelfScanning.store.LocalStores', {
    extend: "Ext.data.Store",
	requires: ['Ext.data.proxy.Sql'],
    config: {
        storeId: 'localStoreStore',
        model: "SelfScanning.model.Store",
		proxy: {
            type: "sql"
        },
		autoLoad: true,
		listeners: {
			load: function(thisStore, records, eOpts) {
				console.log('stores loaded');
				for (i in records) {
					records[i].APMappings().load();
				}
			}
		}
    }
});