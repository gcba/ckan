$( document ).ready( function() {
	var showHeader = function (eventObject) {
		brandingObj = $('.branding-data');
		topHeader = $('.navbar-fixed-top')
		subtitle = $('.title h4');

		$('.branding-data .navbar-search').hide();
		brandingObj.addClass('full-screen');
		topHeader.hide(250);
		subtitle.hide(50);
		brandingObj.animate({height:'100%'},1000, 'easeInOutQuart');

		
		$('.branding-data .hideviz').show();
		$('.branding-data .viewviz').hide();
		return false;	
	};

	$('.branding-data .hideviz').hide();

	var hideHeader = function(eventObject) {
		brandingObj = $('.branding-data');
		topHeader = $('.navbar-fixed-top')
		subtitle = $('.title h4');

		brandingObj.animate({"height":95},1000, 'easeInOutQuart');
		topHeader.show(250);
		subtitle.show(50);
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
		location.href = "/dataset#query=" + $('#search').val();
	});

	$(".menu-gcba .social li a").click(function() {
		var url_base = $(this).attr("url-base");
		$(this).attr("href", url_base + encodeURIComponent($(location).attr('href')));
	});

});