Ext.define("SelfScanning.view.Database", {
	extend: "Ext.Container",
	alias: "widget.database",
	id: 'database',
	config: {
		flex: 1,
		layout: 'card',
		items: [{
			xtype: 'list',
			id: 'regionDB',
			store: 'localRegionStore',
			itemTpl: '({GNr}) {Ort}',
			listeners: {
				itemtap: function(view, index, target, record, e, eOpts) {
					//console.log(record.Stores().getData());
					record.Stores().setAutoLoad(true);
					Ext.getCmp('storeDB').setStore(record.Stores());
					view.parent.setActiveItem(1);
				}
			}
		}, {
			xtype: 'list',
			id: 'storeDB',
			// store: regionRecord.Stores() -> wird zur Laufzeit gesetzt
			itemTpl: '({FNr}) {Str} in {Ort}',
			listeners: {
				itemtap: function(view, index, target, record, e, eOpts) {
					var FNr = record.get('FNr');
					var GNr = record.get('GNr');
					
					var articleStore = record.APMappings().setAutoLoad(true);
					//articleStore.load();
					
					articleStore.setFilters({
						filterFn: function(item) {
							var currFNr = parseInt(item.get('FNr'), 10);
							var currGNr = parseInt(item.get('GNr'), 10);
							return (currFNr == FNr && currGNr == GNr) || (currFNr == FNr && currGNr == 0) || (currFNr == 0 && currGNr == 0);
						}
					});
					
					articleStore.load();
					
					console.log(articleStore);
					
					Ext.getCmp('articleDB').setStore(articleStore);
					view.parent.setActiveItem(2);
				}
			}
		}, {
			xtype: 'list',
			id: 'articleDB',
			// store: storeRecod.APMappings() -> wird zur Laufzeit gesetzt
			itemTpl: '({ANr}) {vkp}'
		}]
	}
});


// Filter der store.APMappings() auf store_id = FNr || store_id = 0 etc. setzen.