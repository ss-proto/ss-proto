Ext.define('SelfScanning.store.RemoteAPMappings', {
    extend: 'Ext.data.Store',
	requires: ['Ext.data.proxy.JsonP', 'Ext.data.reader.Array'],
    config: {
        storeId: 'remoteAPMappingStore',
        model: "SelfScanning.model.APMapping",
        proxy: {
            type: 'jsonp',
            url: 'http://www.ss-proto.bplaced.net/getPrices.php',
			extraParams: {
				// set dynamically in beforeload-handler
			},
            reader: {
                type: 'array'
            }
        },
		listeners: {
			beforeload: function() {
				// TODO:
				// Beim ersten Ladevorgang wurde der localAPMappingStore nocht nicht(!) geladen,
				// d.h. max('timestamp') liefert nichts zurück.
				var localAPMappingStore = Ext.getStore('localAPMappingStore');
				var lastDate = localAPMappingStore.getLastUpdate() || localAPMappingStore.max('timestamp');

				this.getProxy().setExtraParams({
					cols: 'listung.ANr,FNr,GNr,vkp',
					level: 'FGL',
					type: 'array',
					lastUpdated: lastDate
				});
			},
			load: function(thisStore, records, successful) {
				console.log('remoteAPMappingStore loaded:');
				console.log(records.length + ' records loaded');
				
				if (records.length == 0) return;
				
				records.forEach(function(currRec) {
					currRec.setDirty();
					currRec.phantom = true;
				});
				
				Ext.getStore('localAPMappingStore').add(records);
				console.log(Ext.getStore('localAPMappingStore').sync());
			}
		}
    }
});