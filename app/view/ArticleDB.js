Ext.define("SelfScanning.view.ArticleDB", {
	extend: "Ext.dataview.List",
	alias: 'widget.articledb',
	requires: 'Ext.field.Search',
	config: {
		title: 'Artikel suchen',
		id: 'articledb',
		store: null,// wird zur Laufzeit gesetzt
		disableSelection: true,
		scrollable: null,
		itemTpl: new Ext.XTemplate(
			'<div class="itemDetails">',
				'<span class="bezeichnung">{Article.bezeichnung}</span><hr />',
				'<span class="einzelpreis">{[this.formatPrice(values.vkp)]}</span>',
			'</div>',
			{formatPrice: function(vkp) {
				vkp = vkp.toFixed(2);
				vkp += '';
				x = vkp.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? ',' + x[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
				}
				return x1 + x2 + '&euro;';
			}}
		),
		listeners: {
			/*
			activate: function(thisView, eOpts) {
				var results = thisView.getStore().queryBy(function(){return true});
				
				console.log(results.getRange());
				
				thisView.setStore({
					model: 'SelfScanning.model.APMapping',
					data: results.sort(function(rec1, rec2) {
						var bez1 = rec1.getArticle().get('bezeichnung');
						var bez2 = rec2.getArticle().get('bezeichnung');
						
						console.log('ola?');
						
						return bez1 > bez2 ? 1 : (bez1 === bez2 ? 0 : -1);
					}, 'ASC')
				});
			}*/
		},
		items: {
			xtype: 'toolbar',
			docked: 'top',
			ui: 'none',
			layout: {
				type: 'vbox',
				pack: 'stretch',
				align: 'stretch'
			},
			items: [
				{xtype: 'searchfield',
				placeHolder: 'PLU oder Bezeichnung eingeben',
				listeners: {
					keyup: function(field, e, eOpts) {
						//get the store and the value of the field  
						var value = field.getValue();
						
						//if (value) {
							value = value.replace(/ /g, '.*');
							
							var store = Ext.getStore('localAPMappingStore');//.sort('Article.bezeichnung', 'ASC');
							
							var reg = new RegExp(value, 'i');							
							var results = store.queryBy(function(currRec){
								var bezeichnung = currRec.getArticle().get('bezeichnung');
								var	PLU			= currRec.getArticle().get('PLU');
								var weight		= currRec.getArticle().get('weightType');
								
								if(weight != 'WERW' && (reg.test(bezeichnung) || reg.test(PLU))) {
									return true;
								} else return false;
							});
							
							//console.log(results.getRange());
							
							Ext.getCmp('articledb').setStore({
								model: 'SelfScanning.model.APMapping',
								data: results.sort(function(rec1, rec2) {
									var bez1 = rec1.getArticle().get('bezeichnung');
									var bez2 = rec2.getArticle().get('bezeichnung');
									
									return bez1 > bez2 ? 1 : (bez1 === bez2 ? 0 : -1);
								}, 'ASC') //Ext.Array.pluck(results.getRange(),'data')
							});
						//}
					},
					clearicontap: function(field, e, eOpts) {
						//console.log('cleared');
						Ext.getCmp('articledb').setStore(Ext.getStore('localAPMappingStore'));
					}
				}
				}
			]
		}
	}
});