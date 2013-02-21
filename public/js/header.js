$( document ).ready( function() {
	var showHeader = function (eventObject) {
		$(this).animate({"height":600},1000, 'easeInOutQuart');
		
	};

	var hideHeader = function(eventObject) {
		$(this).animate({"height":95},1000, 'easeInOutQuart');
	}
	$('.branding-data').hoverIntent({    
		     over: showHeader, // function = onMouseOver callback (REQUIRED)    
		     timeout: 1000, // number = milliseconds delay before onMouseOut    
		     out: hideHeader // function = onMouseOut callback (REQUIRED)    
		});
});