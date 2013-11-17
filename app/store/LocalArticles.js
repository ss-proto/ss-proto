Ext.define('SelfScanning.store.LocalArticles', {
    extend: "Ext.data.Store",
	requires: ['Ext.data.proxy.Sql'],
    config: {
        storeId: 'localArticleStore',
        model: "SelfScanning.model.Article",
        listeners: {
			write: function(thisStore, operation) {
				thisStore.setLastUpdate(new Date());
				console.log('localArticleStore.setLastUpdate to: ');
				console.log(thisStore.getLastUpdate().toUTCString());
			}
		},
		proxy: {
            type: "sql"
        },
		autoLoad: true,
		lastUpdate: null
    }
});