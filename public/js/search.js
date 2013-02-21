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

	pushFilterUrl = function() {
		filter_array = []
		if ( facets['tags'].length > 0)
			filter_array.push(facets['tags'].join('.'));
		if ( facets['res_format'].length > 0)
			filter_array.push(facets['res_format'].join('.'));
		if ( facets['groups'].length > 0)
			filter_array.push(facets['groups'].join('.'));

		filter_str = filter_array.length > 0 ? "." + filter_array.join('.'): "";
		$.bbq.pushState(  $.param( { filter: filter_str } ));
	};

	filterDatasets = function() {
		var hashOptions = $.deparam.fragment();
		$(".facet").removeClass("active");
		if (hashOptions.filter) {
			filters = hashOptions.filter.split('.')
			for ( var i=1; i<filters.length; i++ ) {
				selector = ".facet a[ckan-facet=" + filters[i] + "]";
				$(selector).addClass("active");
			}
		}
		$('.datasets').isotope( hashOptions );
	}

	clearFilter = function (eventObject) {
		var filter = $(eventObject.currentTarget).attr('ckan-filter');
		facets[filter] = []
		pushFilterUrl();
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
		pushFilterUrl();
		return false;
	}

	$(window).bind( 'hashchange', filterDatasets).trigger('hashchange');
	$('.filter a').click(clearFilter);
	$('.facet a').click(toggleFacetToFilter);
});

