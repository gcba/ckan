$( document ).ready( function() {
	$('.total-view-count, .last-modified').tooltip();

	$('.datasets').isotope({
		itemSelector : '.dataset',
		layoutMode : 'fitRows',
		masonry: {columnWidth: 267
		},
		getSortData : {
		    total_count : function ( $elem ) {
		    	return parseInt( $elem.find('.total-view-count').text(), 10 )
		    },
		    recent_count : function ( $elem ) {
		    	return parseInt( $elem.find('.recent-view-count').text(), 10 )
		    },
		    title : function ( $elem ) {
		      return $elem.find('.title').text();
		    },
		    last_modified: function ($elem) {
		    	return $elem.find('.last-modified a').attr('ckan-modified');
		    }
	  	}
	});

	$('.datasets').fisotope({
		default_facet_operator: {
			groups: 'or',
			res_format: 'and',
			tags: 'and',
		}
	})

	$(window).bind( 'hashchange', function() { 
		$('[data-toggle="dropdown"]').parent().removeClass('open'); 
	}).trigger('hashchange');


	$('.tagbox .fiso-toggle-facet, .tagbox .fiso-clear-facet, .toolbar .facet.groups .fiso-toggle-category span').tooltip();

	
});

