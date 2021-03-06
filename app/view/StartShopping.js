Ext.define("SelfScanning.view.StartShopping", {
	extend: "Ext.Container",
	alias: "widget.startshopping",
	//requires: 'SelfScanning.view.ContinueShopping',
	config: {
		id: 'startshopping',
		title: 'Mobile SelfScanning',
		scrollable: 'vertical',
		layout: {
			type: 'vbox',
			pack: 'start',
			align: 'stretch'
		},
		items: [
			{xtype: 'container',
			id: 'newCart',
			layout: {
				type: 'vbox',
				pack: 'start',
				align: 'center'
				},
			items: [
				{xtype: 'container',
				cls: 'message',
				html: '<b>Beginnen Sie einen neuen Einkauf.</b><br />'
				  +'	Scannen Sie den QR-Code im Eingang der Filiale.'},
				{xtype: 'button',
				ui: 'confirm',
				iconCls: 'camera2',
				text: 'QR-Code scannen',
				handler: function() {
					this.parent.parent.fireEvent("newShoppingCartCommand");
				}}
				]
			},
			{xtype: 'list',
			flex: 1,
			scrollable: false,
			id: 'continueshopping',
			store: 'shoppingCartStore',
			grouped: true,
			disableSelection: true,
			//itemHeight: 40,
			itemTpl: [
				'<div class="cartDetails">',
					'<span class="time">{creationDate:this.getTimeago}</span>',
					'<span class="content">{[this.getMenge(values)]} Artikel</span>',
					'<span class="sum">{[this.getSumme(values)]}</span>',
				'</div>',
				{getMenge: function(values) {
					var menge = 0;
					for (i in values.CartItems) {
						menge += values.CartItems[i].menge
					}
					//console.log(menge);
					return menge;
				},
				getSumme: function(values) {
					//console.log(values);
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
				getTimeago: function(date) {
					if (moment().diff(moment(date), 'days') > 1)
						return moment(date).calendar();
					else
						return moment(date).fromNow();
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
					return x1 + x2 + '&nbsp;&euro;';
				}}
			],
			listeners: {
				itemtap: function(thisList, index, target, record, e, eOpts){
					thisList.parent.fireEvent('activateShoppingCart', record);
				},
				refresh: function() {
					//this.setHeight((this.itemsCount*this.getItemHeight()+20) + Ext.getStore('shoppingCartStore').getGroups().length * 30);
				}
			}
			}
		]
	}
});
