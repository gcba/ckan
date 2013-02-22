$( document ).ready( function() {

  	$('.datasets').isotope({
		itemSelector : '.dataset',
		layoutMode : 'fitRows'
	});

	var facets = {
		'tags': [],
		'res_format': [],
		'groups': []
	}
	var query_str;

	pushUrl = function() {
		filter_array = []
		if ( facets['tags'].length > 0)
			filter_array.push(facets['tags'].join('.'));
		if ( facets['res_format'].length > 0)
			filter_array.push(facets['res_format'].join('.'));
		if ( facets['groups'].length > 0)
			filter_array.push(facets['groups'].join('.'));

		filter_str = filter_array.length > 0 ? "." + filter_array.join('.'): "";
		$.bbq.pushState(  $.param( { filter: filter_str } ));
		if (query_str) {
			$.bbq.pushState( $.param( { query: query_str}));
		}
	};

	filterDatasets = function() {
		var hashOptions = $.deparam.fragment();
		$(".facet a").removeClass("active");
		if (hashOptions.filter) {
			filters = hashOptions.filter.split('.')
			for ( var i=1; i<filters.length; i++ ) {
				selector = ".facet a[ckan-facet=" + filters[i] + "]";
				$(selector).addClass("active");
			}
		}
		if (hashOptions.query) {
			if (!hashOptions.filter) {
				hashOptions.filter = "";
			}
			hashOptions.filter += ":contains('" + hashOptions.query + "')"
			$('#search').val(hashOptions.query);
		}
		$('.datasets').isotope( hashOptions );
	}

	clearFilter = function (eventObject) {
		var filter = $(eventObject.currentTarget).attr('ckan-filter');
		facets[filter] = []
		pushUrl();
		return false;
	}

	toggleFacetToFilter = function (eventObject) {
		var filter = $(eventObject.currentTarget).attr('ckan-filter');
		var facet = $(eventObject.currentTarget).attr('ckan-facet');
		var index = facets[filter].indexOf(facet);
		if ( index < 0) {
			facets[filter].push(facet);
		} else {
			facets[filter].splice(index, 1);
		}
		pushUrl();
		return false;
	}

	toggleQuery = function(eventObject) {
		kwd = $(this).val().toLowerCase();
		if ( (kwd != '') && (kwd.length >= 2) ) { 
			query_str = kwd;
		} else {
			query_str = null
		}
		pushUrl();
		return true;
	}

	$(window).bind( 'hashchange', filterDatasets).trigger('hashchange');
	$('.filter a').click(clearFilter);
	$('.facet a').click(toggleFacetToFilter);
	$('#search').keyup(toggleQuery) ;

	$('.dropdown-menu').find('form').click(function (e) {
        e.stopPropagation();
        });

});

