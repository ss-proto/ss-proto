Ext.define("SelfScanning.store.CartItems", {
	extend: "Ext.data.Store",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		storeId: 'cartItemStore',
		model: "SelfScanning.model.CartItem",
		sorters: [
			{sorterFn: function(record1, record2) {
                var t1 = record1.getArticle().get('weightType');
                var t2 = record2.getArticle().get('weightType');
				
				console.log(t1 + ', ' + t2);

                return t1 == 'LW' ? 1 : (t2 == 'LW' ? -1 : 0);
            },
            direction: 'DESC'}
		],
		listeners: {
			load: function(thisStore, records, eOpts) {
				// Die Assoziationen der cartItems müssen (eigentlich nur einmalig beim Start ! )
				// manuell gesetzt werden
				
				for (i in records) {
					/* Artikel Assoziation setzen
					var ANr = records[i].get('ANr');
					var articleRec = Ext.getStore('localArticleStore').findRecord('ANr', ANr);
					records[i].setArticle(articleRec);
					*/
					
					// APMapping Assoziation setzen
					var priceId = records[i].get('apmapping_id');
					var priceRec = Ext.getStore('localAPMappingStore').findRecord('id', priceId);
					records[i].setAPMapping(priceRec);
					
					// ShoppingCart Assoziation setzen
					// ...
					// ist anscheinend nicht nötig.
					/*
					console.log('setting shoppingCart Assoc');
					var cartId = records[i].get('shoppingcart_id');
					console.log(cartId);
					var cartRec = Ext.getStore('shoppingCartStore').findRecord('id', cartId);
					//console.log(cartRec);
					records[i].setShoppingCart(cartRec);
					*/
				}
			}
		},
		autoLoad: true,
		//autoSync: true
	}
});