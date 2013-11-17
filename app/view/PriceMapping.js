Ext.define("SelfScanning.view.PriceMapping", {
	extend: "Ext.Container",
	alias: "widget.pricemapping",
	requires: ['Ext.plugin.PullRefresh'],
	config: {
		layout: {
			type: 'vbox',
			pack: 'start'
		},
		items: [
			{html: '<div class="subtitle">Verkaufspreise</div>'},
			{xtype: 'list',
			store: 'localPriceMappingStore',
			flex: 1,
			disableSelection: true,
			plugins: [
				{
					xclass: 'Ext.plugin.PullRefresh',
					releaseRefreshText: 'Zum Aktualisieren loslassen',
					pullRefreshText: 'Zum Aktualisieren herunterziehen.',
					loadingText: 'Wird geladen...',
					listeners: {
						latestfetched: function() {
							console.log('latest fetched!');
							Ext.getStore('remotePriceMappingStore').load();
						}
					}
				}
			],
			cls: 'price-list',
			itemTpl: '<div class="bezeichnung"><span>{ANr}&nbsp;&nbsp;</span>{vkp}</div>',
			scrollable: 'vertical',
			loadingText: "Preise werden geladen..."
		}]
	}
});