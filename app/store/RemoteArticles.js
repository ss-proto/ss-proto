Ext.define('SelfScanning.store.RemoteArticles', {
    extend: 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId: 'remoteArticleStore',
        model: "SelfScanning.model.Article",
        proxy: {
            type: 'jsonp',
            url: 'http://www.ss-proto.bplaced.net/getArticles.php',
			extraParams: {
				
			},
            reader: {
                type: 'json',
                rootProperty: 'articles'
            }
        },
		listeners: {
			beforeload: function() {
				// TODO:
				// Beim ersten Ladevorgang wurde der localArticleStore nocht nicht(!) geladen,
				// d.h. max('timestamp') liefert nichts zurück.
				var localArticleStore = Ext.getStore('localArticleStore');
				var lastDate = localArticleStore.getLastUpdate() || localArticleStore.max('timestamp');

				this.getProxy().setExtraParams({
					lastUpdated : lastDate
				});
			},
			load: function(thisStore, records, successful) {
				console.log('onRemoteArticleStoreLoad');
				console.log(records.length + ' records loaded');

				var localArticleStore = Ext.getStore('localArticleStore');

				records.forEach(function(currRec) {
					// Prüfen ob Artikel in localArticleStore bereits vorhanden ist
					var oldRec = localArticleStore.findRecord('ANr', currRec.data.ANr);
					if (oldRec === null) {
						// ANr wurde in localStore nicht gefunden
						// Prüfen ob Artikeldaten komplett sind, dann hinzufügen
						if (currRec.data.bezeichnung !== null) {
							console.log('adding ' + currRec.get('bezeichnung') + ' to localArticleStore');
							currRec.phantom = true;
							//currRec.setDirty();
							localArticleStore.add(currRec);
						}
					} else {
						// Artikel ist in localStore vorhanden.
						// Aktion könnte ein Delete oder ein Update sein.
						// In beiden Fällen muss der alte Datensatz zunächst gelöscht werden
						if (currRec.data.bezeichnung === null) {
							localArticleStore.remove(oldRec);
						} else {
							oldRec.setDirty();
							
							oldRec.set('PLU', currRec.get('PLU'));
							oldRec.set('ean', currRec.get('ean'));
							oldRec.set('bezeichnung', currRec.get('bezeichnung'));
							oldRec.set('mwst', currRec.get('mwst'));
							oldRec.set('weightType', currRec.get('weightType'));
							oldRec.set('deposit', currRec.get('deposit'));
							oldRec.set('restricted', currRec.get('restricted'));
							oldRec.set('timestamp', currRec.get('timestamp'));
						}
					}
				});
				console.log(localArticleStore.sync());
				
				localArticleStore.on('load', function() {
					Ext.getStore('remoteAPMappingStore').load();
				}, this, {single:true}).load();
			}
		}
    }
});