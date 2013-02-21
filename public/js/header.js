$( document ).ready( function() {
	var showHeader = function (eventObject) {
		$(this).animate({"height":600},1000, 'easeInOutQuart');
		
	};

	var hideHeader = function(eventObject) {
		$(this).animate({"height":95},1000, 'easeInOutQuart');
	}
	$('.branding-data').hoverIntent(showHeader, hideHeader)
});