Ext.define("SelfScanning.view.ArticleList", {
	extend: "Ext.Container",
	alias: "widget.articlelist",
	requires: ['Ext.plugin.PullRefresh'],
	config: {
		layout: {
			type: 'vbox',
			pack: 'start'
		},
		items: [
			{html: '<div class="subtitle">Alle Artikel</div>'},
			{xtype: 'list',
			flex:1,
			store: 'localArticleStore',
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
							Ext.getStore('remoteArticleStore').load();
						}
					}
				}
			],
			cls: 'article-list',
			itemTpl: '<div class="bezeichnung"><span>{ANr}&nbsp;&nbsp;</span>{bezeichnung}</div><div class="ean"><span>EAN: </span>{ean}</div>',
			scrollable: 'vertical',
			loadingText: "Artikel werden geladen..."
		}]
	}
});