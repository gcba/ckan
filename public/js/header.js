$( document ).ready( function() {
	var showHeader = function (eventObject) {
		$(eventObject.target.parentNode.parentNode.parentNode.parentNode).animate({"height":600},1000, 'easeInOutQuart');
		
	};

	var hideHeader = function(eventObject) {
		$(eventObject.target.parentNode.parentNode.parentNode.parentNode).animate({"height":95},1000, 'easeInOutQuart');
	}
	$('.branding-data .title').hoverIntent({    
		     over: showHeader, // function = onMouseOver callback (REQUIRED)    
		     timeout: 1000, // number = milliseconds delay before onMouseOut    
		     out: hideHeader // function = onMouseOut callback (REQUIRED)    
		});

	$('.branding-data form').submit(function(eventObject) {
		event.preventDefault();
		location.href = "dataset#query=" + $('#search').val();
	});
});