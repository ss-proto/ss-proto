Ext.define('SelfScanning.store.LocalRegions', {
    extend: "Ext.data.Store",
	requires: ['Ext.data.proxy.Sql'],
    config: {
        storeId: 'localRegionStore',
        model: "SelfScanning.model.Region",
		proxy: {
            type: "sql"
        },
		autoLoad: true
    }
});