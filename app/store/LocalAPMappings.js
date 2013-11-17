Ext.define('SelfScanning.store.LocalAPMappings', {
    extend: "Ext.data.Store",
	requires: ['Ext.data.proxy.Sql'],
    config: {
        storeId: 'localAPMappingStore',
        model: "SelfScanning.model.APMapping",
        listeners: {
			addrecords: function(thisStore, records, eOpts) {
				console.log('localAPMapping addrecords');
				console.log('records: ' + records.length)
				//console.log(records);
				
				records.forEach(function(currRec) {
					thisStore.setLastUpdate(new Date());
					
					console.log('now handling: ');
					console.log(currRec.getData());

					// Zunächst prüfen ob ein alter Eintrag mit gleicher ANr, FNr und GNr vorhanden ist
					var oldRecIndex = thisStore.findBy(function(filterRec) {
						if (currRec.get('id') != filterRec.get('id') && currRec.get('ANr') == filterRec.get('ANr') && currRec.get('FNr') == filterRec.get('FNr') && currRec.get('GNr') == filterRec.get('GNr')) {
							return true;
						} else {
							return false;
						}
					});
					
					console.log(oldRecIndex);
					
					var oldRec = (oldRecIndex >= 0) ? thisStore.getAt(oldRecIndex) : null;
					
					if (oldRec == null) {
						// Kein alter Eintrag vorhanden
						console.log('Kein Eintrag in APMapping vorhanden');
						
						if (currRec.get('vkp') == null) {
							// Sollte es sich um einen ungültigen Eintrag handeln, muss das Einfügen rückgängig gemacht werden
							thisStore.remove(currRec);
						} else {
							// Komplett neuer Eintrag -> Store- und Article-Assoziation muss gesetzt werden
							var FNr = parseInt(currRec.get('FNr'),10);
							var GNr = parseInt(currRec.get('GNr'),10);
							var ANr = parseInt(currRec.get('ANr'),10);
							
							//console.log('Adding APMapping to localAPMappings');
							//console.log('FNr: ' + FNr + ', GNr: ' + GNr);
							var localStoreStore = Ext.getStore('localStoreStore');
							var localArticleStore = Ext.getStore('localArticleStore');
							
							var storeIndex = localStoreStore.findBy(function(currRec) {
								return currRec.get('FNr') == FNr && currRec.get('GNr') == GNr;
							});
							var storeRec = localStoreStore.getAt(storeIndex);
							
							if (!storeRec) console.log('ACHTUNG! Keine zum APMapping passende Filiale gefunden.');
							
							var articleRec = localArticleStore.findRecord('ANr', ANr);
							
							if (!articleRec) console.log('ACHTUNG! Keinen zum APMapping passenden Artikel gefunden.');
							
							currRec.setArticle(articleRec);
							currRec.setStore(storeRec);
						}
					} else {
						// Es ist ein alter Eintrag vorhanden
						console.log('Found old APMapping:');
						console.log(oldRec.getData());
						// der neue kann entfernt werden
						thisStore.remove(currRec);
						
						if (currRec.get('vkp') == null) {
							// Wenn es sich um ein zu löschender Datensatz handelt,
							// muss sowohl der alte, als auch der neue Datensatz gelöscht werden
							thisStore.remove(oldRec);
							console.log('vkp = null -> old APMapping removed');
						} else {
							if (currRec.get('vkp') != oldRec.get('vkp')) {
								// wenn sich die VKPs unterscheiden, muss der alte Eintrag geupdated werden
								oldRec.set('vkp', currRec.get('vkp'));
								oldRec.setDirty();
								console.log('updated old APMapping:');
								console.log(oldRec.getData());
							}
						} 
					}
				});
			},
			load: function(thisStore, records, eOpts) {
				// Die Article-Assoziation muss sicherheitshalber explizit gesetzt werden
				
				for (i in records) {
					// Artikel Assoziation setzen
					var ANr = records[i].get('ANr');
					var articleRec = Ext.getStore('localArticleStore').findRecord('ANr', ANr);
					records[i].setArticle(articleRec);
				}
			}
		},
		autoLoad: true,
		lastUpdate: null
    },
	setStoreFilter: function(FNr, GNr) {
		this.clearFilter();
		
		var articleNmbrs = [];
		
		this.filterBy(function(currRec, id) {
			var currFNr = currRec.get('FNr');
			var currGNr = currRec.get('GNr');
			var currANr = currRec.get('ANr');
			
			if (currFNr == FNr && currGNr == GNr && articleNmbrs.indexOf(currANr) < 0) {
				articleNmbrs.push(currANr);
				return true;
			} else if (currFNr == 0 && currGNr == GNr && articleNmbrs.indexOf(currANr) < 0) {
				articleNmbrs.push(currANr);
				return true;
			} else if (currFNr == 0 && currGNr == 0 && articleNmbrs.indexOf(currANr) < 0) {
				articleNmbrs.push(currANr);
				return true;
			}
			
			return false;
		});
	},
	
	findPriceMapping: function(ANr, FNr, GNr) {
		var priceRecord = -1;
		
		priceRecord = this.findBy(function(currRec) {
			// Den localAPMappingStore nach Filialpreisen durchsuchen
			return (currRec.get('ANr') == ANr &&
					currRec.get('FNr') == FNr &&
					currRec.get('GNr') == GNr )
		});
		
		if (priceRecord == -1) {
			// Sollte kein Filialpreis gefunden werden
			// wird nach Gesellschaftspreis (FNr = 0) gesucht
			priceRecord = this.findBy(function(currRec) {
				return (currRec.get('ANr') == ANr &&
						currRec.get('FNr') == 0 &&
						currRec.get('GNr') == GNr )
			});
		}
		
		if (priceRecord == -1) {
			// Sollte kein Filialpreis gefunden werden
			// wird nach Gesellschaftspreis (FNr = 0) gesucht
			priceRecord = this.findBy(function(currRec) {
				return (currRec.get('ANr') == ANr &&
						currRec.get('FNr') == 0 &&
						currRec.get('GNr') == 0 )
			});
		}
		
		console.log(priceRecord); 
		
		// Vorausgesetzt es wurde ein passender Preis gefunden, muss der Record noch geholt werden
		if (priceRecord != -1) priceRecord = this.getAt(priceRecord);
		
		console.log(priceRecord);
		
		return priceRecord;
		
	}
});