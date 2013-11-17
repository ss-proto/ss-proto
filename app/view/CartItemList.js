Ext.define("SelfScanning.view.CartItemList", {
	extend: "Ext.dataview.List",
	alias: "widget.cartitemlist",
	requires: 'SelfScanning.view.EditCartItem',
	id: 'cartitemlist',
	config: {
		layout: {
			type: 'fit',
			pack: 'start',
			align: 'center'
		},
		ui: 'round',
		scrollable: null,
		loadingText: "Artikel werden geladen...",
		//emptyText: '<div class="emptyText">Ihr Einkaufswagen ist leer.<br />Um einen Artikel hinzuzufügen, scannen Sie den Barcode auf der Verpackung oder suchen den Artikel in der Datenbank.</div>',
		itemTpl: new Ext.XTemplate(
			'<div class="itemDetails">',
				'<span class="menge">{menge}</span>',
				'<span class="bezeichnung">{[this.getDescription(values)]}</span>',
				'<span class="icon">{[this.showIcon(values.APMapping.Article)]}</span>',
				'<span class="gesamtpreis">{[this.getSum(values)]}</span>',
			'</div>',
			{getDescription: function(values) {
				console.log(values);
				var bezeichnung = values.APMapping.Article.bezeichnung;
				var weightType  = values.APMapping.Article.weightType;
				var weight		= values.weight;
				
				if (weightType == 'WERW') return (weight + 'g - ' + bezeichnung);
				else return bezeichnung;
			},
			getSum: function(values) {
				var weightType = values.APMapping.Article.weightType;
				var vkp = values.APMapping.vkp;
				var deposit = (values.APMapping.Article.deposit || 0);
				var menge = values.menge;
				if (weightType == 'WERW') var weight = values.weight;
				//var suffix = values.APMapping.Article.weightType == 'LW' ?  : '&nbsp;€'
				
				if (weightType == 'LW') return this.formatPrice((vkp+deposit), '&nbsp;€/kg');
				if (weightType == 'WERW') return this.formatPrice((vkp+deposit)*weight, '&nbsp;€');
				else return this.formatPrice((vkp+deposit)*menge, '&nbsp;€');
				
			},
			formatPrice: function(vkp, suffix) {
				vkp = vkp.toFixed(2);
				vkp += '';
				x = vkp.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? ',' + x[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
				}
				return x1 + x2 + suffix;
			},
			showIcon: function(article) {
				var icons = '';
				if (article.restricted == 1)
					icons += '<img src="resources/images/restricted.png" />';
				if (article.weightType == 'LW')
					icons += '<img src="resources/images/weight.png" />';
				if (article.deposit)
					icons += '<img src="resources/images/deposit.png" />';
				
				return icons;
			}}
		),
		listeners: {
			itemtap: function(thisView, index, target, record, e, eOpts) {
				Ext.getCmp('editCartItem').setRecord(record).show();
			}
		}
		// NOTIZ:
		// Bei verknüpften Artikeln (Pfand) soll ein "Kettenglied"-Icon (Chain) links von der Liste angezeigt werden!
	}
});