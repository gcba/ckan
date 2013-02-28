$( document ).ready( function() {
	var showHeader = function (eventObject) {
		brandingObj = $(eventObject.target.parentNode.parentNode.parentNode.parentNode.parentNode);
		topHeader = $('.header-gcba')

		$('.branding-data .navbar-search').hide();
		brandingObj.addClass('full-screen');
		topHeader.hide(250);
		brandingObj.animate({height:'100%'},1000, 'easeInOutQuart');

		
		$('.branding-data .hideviz').show();
		$('.branding-data .viewviz').hide();
		return false;	
	};

	$('.branding-data .hideviz').hide();

	var hideHeader = function(eventObject) {
		brandingObj = $(eventObject.target.parentNode.parentNode.parentNode.parentNode.parentNode);
		topHeader = $('.header-gcba')

		brandingObj.animate({"height":95},1000, 'easeInOutQuart');
		topHeader.show(250);
		brandingObj.removeClass('full-screen');
		$('.branding-data .navbar-search').show();
		
		
		$('.branding-data .hideviz').hide();
		$('.branding-data .viewviz').show();
		return false;	
	}
	$('.branding-data .viewviz').click(showHeader);
	$('.branding-data .hideviz').click(hideHeader);

	$('.branding-data form').submit(function(eventObject) {
		event.preventDefault();
		location.href = "dataset#query=" + $('#search').val();
	});
});