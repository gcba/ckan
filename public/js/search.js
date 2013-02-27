$( document ).ready( function() {

	$.expr[':'].contains = function(a, i, m) {
	  return $(a).text().toUpperCase()
	      .indexOf(m[3].toUpperCase()) >= 0;
	};

  	$('.datasets').isotope({
		itemSelector : '.dataset',
		layoutMode : 'fitRows',
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
		    	return $elem.find('.last-modified').text();
		    }
	  	}
	});

	var facets = {
		'tags': [],
		'res_format': [],
		'groups': []
	}
	var query_str = "";
	var sort_str="original-order";

	pushUrl = function() {
		$.bbq.pushState( $.param( { 
			tags: facets['tags'].length > 0 ? "." + facets['tags'].join('.'): "",
			groups: facets['groups'].length > 0 ? "." + facets['groups'].join('.'): "",
			res_format: facets['res_format'].length > 0 ? "." + facets['res_format'].join('.'): "",
			query: query_str,
			sort: sort_str
		} ));
	};

	pushTagFormat = function(tag, type){
		$('.nav-tags-formats .inner').append('<div ckan-filter="'+ type + '" ckan-facet="' + tag + '" class="tags tags-block"><button type="button" class="close" data-dismiss="alert">×</button><p>'+tag+'</p></div> ');
		$('.nav-tags-formats .inner [ckan-facet="' + tag + '"]').click(toggleFacetToFilter);
		$($('.btn-group [ckan-facet="' + tag + '"]').parent()).hide();
	}

	cleanTagFormat = function() {
		$('.nav-tags-formats .inner').empty();
		$($('.btn-group [ckan-facet]').parent()).show();
	}

	clearGroups = function() {
		$('.groups li a').removeClass("active");
	}

	activeGroup = function(group) {
		$('.groups .' + group + ' a').addClass('active')
	}

	updateFilterMessage = function (tag_count, format_count, group_count) {
		final_str = "";
		if (tag_count > 0 ) {
			final_str = tag_count + (tag_count > 1 ? " tags" : " tag");
		}
		if (format_count > 0 ) {
			var format_str = format_count + (format_count > 1 ? " formatos" : " formato");
			final_str += final_str.length > 0 ? " | " + format_str : format_str
		}
		if (group_count > 0 ) {
			var group_str = group_count + (group_count > 1 ? " grupos" : " grupo");
			final_str += final_str.length > 0 ? " | " + group_str : group_str;
		}
		if (final_str.length > 0 ){
			final_str += " en selección."
		} else {
			final_str += "Todos los datasets."
		}
		$('.nav-tags-formats .info p').text(final_str);
	}

	filterDatasets = function() {
		var hashOptions = $.deparam.fragment();
		var filter = "";
		var tag_count = 0;
		var format_count = 0;
		var group_count = 0;
		cleanTagFormat();
		facets['tags'] = []
		if (hashOptions.tags) {
			var filters = hashOptions.tags.split('.')
			for ( var i=1; i<filters.length; i++ ) {
				pushTagFormat(filters[i], 'tags');
				facets['tags'].push(filters[i]);
			}
			tag_count = filters.length - 1;
			filter += hashOptions.tags;
		}		
		facets['res_format'] = []
		if (hashOptions.res_format) {
			var filters = hashOptions.res_format.split('.')
			for ( var i=1; i<filters.length; i++ ) {
				pushTagFormat(filters[i], 'res_format');
				facets['res_format'].push(filters[i]);
			}
			format_count = filters.length - 1;
			filter += hashOptions.res_format;
		}
		facets['groups'] = []
		if (hashOptions.groups) {
			var filters = hashOptions.groups.split('.')
			for ( var i=1; i<filters.length; i++ ) {
				facets['groups'].push(filters[i]);
				activeGroup(filters[i]);
			}
			group_count = filters.length - 1;
			filter += hashOptions.groups;
		}
		updateFilterMessage(tag_count, format_count, group_count);
		if (hashOptions.query) {
			if (!hashOptions.filter) {
				hashOptions.filter = "";
			}
			filter += ":contains('" + hashOptions.query + "')"
			$('#search').val(hashOptions.query);
		}
		$('.datasets').isotope( {
			filter: filter,
			sortBy : hashOptions.sort 
		});

	}

	clearFilter = function (eventObject) {
		var filter = $(eventObject.currentTarget).attr('ckan-filter');
		facets[filter] = [];
		$('[data-toggle="dropdown"]').parent().removeClass('open');
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
		$('[data-toggle="dropdown"]').parent().removeClass('open');
		pushUrl();
		return false;
	}

	toggleQuery = function(eventObject) {
		kwd = $(this).val();
		if ( (kwd != '') && (kwd.length >= 2) ) { 
			query_str = kwd;
		} else {
			query_str = "";
		}
		pushUrl();
		return true;
	}

	toggleSort = function(eventObject) {
		sort_str = $(eventObject.currentTarget).attr('ckan-sort');
		$('[data-toggle="dropdown"]').parent().removeClass('open');
		pushUrl();
		return false;
	}

	$(window).bind( 'hashchange', filterDatasets).trigger('hashchange');
	$('a[ckan-clear]').click(clearFilter);
	$('a[ckan-facet]').click(toggleFacetToFilter);
	$('#search').keyup(toggleQuery) ;
	$('a[ckan-sort]').click(toggleSort);
	$('.dropdown-menu').find('form').click(function (e){e.stopPropagation();});

});

