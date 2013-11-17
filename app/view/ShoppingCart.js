Ext.define("SelfScanning.view.ShoppingCart", {
	extend: "Ext.Container",
	requires: ['Ext.SegmentedButton', 
	           'SelfScanning.view.ArticleDB', 'SelfScanning.view.CartItemList'],
	alias: "widget.shoppingcart",
	id: 'shoppingcart',
	config: {
		flex: 1,
		layout: {
			type: 'vbox',
			pack: 'start',
			align: 'center'
		},
		//store: null, // wird zur Laufzeit gesetzt
		record: {
			// this will get set after activating the view
		},
		listeners: {
			activate: function() {
				Ext.getCmp('mainContent').getNavigationBar().setTitle('Einkaufswagen');
			}
		}
	},
	
	shoppingCartRecord: null,
	
	setCartItemStore: function(shoppingCartRec) {
		// cartitemlist soll alle cartitem-Objekte anzeigen, die zu dem übergebenen shoppingCart gehören
		// shoppingCartRec[0].CartItems() liefert einen entsprechend gefilterten CartItem-Store
		//var currCartItemStore = shoppingCartRec.CartItems();
		//currCartItemStore.setAutoLoad(true);
		//currCartItemStore.setAutoSync(true);

		Ext.getCmp('shoppingLocation').setRecord(shoppingCartRec);
		Ext.getCmp('cartInfo').setRecord(shoppingCartRec);
		
		this.shoppingCartRecord = shoppingCartRec;
		
	},
	
	getQRData: function() {
		var currCart = this.shoppingCartRecord;
		var qrdata = '';
		
		qrdata += ('000' + currCart.get('GNr')).slice(-3);
		qrdata += ('000' + currCart.get('FNr')).slice(-3);
		qrdata += ('00' + Ext.getCmp('cartitemlist').getStore().getCount()).slice(-2);
		
		Ext.getCmp('cartitemlist').getStore().each(function(currItem) {
			qrdata += ('00000' + currItem.get('ANr')).slice(-5);
			qrdata += ('00' + currItem.get('menge')).slice(-2);
		});
		
		// Gesamtsumme
		qrdata += ('004123');
		
		return qrdata;
	},
	
	// TODO:
	// Implement getShoppingCartRec()
	
	initialize: function() {
			
			var locationInfo = {
				xtype: 'container',
				cls: 'locationInfo',
				id: 'shoppingLocation',
				tpl: '{Store.Str} in {Store.PLZ} {Store.Ort}'
			}
			
			var scanBarcodeBtn = {
				xtype: "button",
				ui: 'confirm',
				text: "Barcode erfassen",
				iconCls: 'barcode2',
				iconMask: true,
				padding: 10,
				handler: function() {
					this.fireEvent('scanArticle', this.shoppingCartRecord);
				},
				scope: this
			};
			
			var searchArticleBtn = {
				xtype: 'button',
				ui: 'confirm',
				iconCls: 'search2',
				padding: 10,
				handler: function() {
					this.fireEvent('lookupArticle', this.shoppingCartRecord);
				},
				scope: this
			};
			
			var addArticleBtn = Ext.create('Ext.SegmentedButton', {
				layout: {
					pack: 'center'
				},
				id: 'addArticleBtn',
				items: [searchArticleBtn, scanBarcodeBtn],
				allowToggle: false,
				margin: 10
			});
			
			var cancelBtn = Ext.create('Ext.Button', {
				ui: 'decline-back',
				iconCls: 'delete',
				//text: '&nbsp;',
				padding: 10,
				margin: 10,
				handler: function() {
					Ext.getCmp('mainContent').pop();
				}
			});
			
			var buttonBar = {
				xtype: 'container',
				layout: {
					type: 'hbox',
					pack: 'center',
					align: 'stretch'
				},
				cls: 'buttonBar',
				docked: 'bottom',
				items: [addArticleBtn]
			}
			
			var cartInfo = {
				xtype: 'container',
				id: 'cartInfo',
				tpl: [
					'<div class="summe">',
						'<span class="text">Gesamt:</span>',
						'<span class="zahl">{[this.getSumme(values)]}</span>',
					'</div>',
					{getSumme: function(values) {
						console.log(values);
						var summe = 0;
						for (i in values.CartItems) {
							var currItem = values.CartItems[i];
							switch (currItem.APMapping.Article.weightType) {
								case 'DEF':
								case 'PERW':
									var vkp = currItem.APMapping.vkp;
									var deposit = currItem.APMapping.Article.deposit;
									
									summe +=  (vkp + deposit) * currItem.menge;
									break;
								case 'WERW':
									summe += currItem.APMapping.vkp * currItem.weight;
									break;
								case 'LW':
									summe += currItem.APMapping.vkp;
								default: break;
							}
						}
						
						return this.formatPrice(summe);
					},
					formatPrice: function(vkp) {
						vkp = vkp.toFixed(2);
						vkp += '';
						x = vkp.split('.');
						x1 = x[0];
						x2 = x.length > 1 ? ',' + x[1] : '';
						var rgx = /(\d+)(\d{3})/;
						while (rgx.test(x1)) {
							x1 = x1.replace(rgx, '$1' + ',' + '$2');
						}
						return x1 + x2 + '€';
					}}
				],
				scrollDock: 'bottom',
				docked: 'bottom'
			};
			
			var cartItemList = {
				xtype: 'cartitemlist',
				flex: 1,
				store: Ext.getStore('cartItemStore'),
				items: [
					cartInfo
				],
				width: '100%'
			};
			
			
			this.add([locationInfo, cartItemList, buttonBar]);
			
	}
});