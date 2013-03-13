var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
    to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
    mapping = {};
 
for(var i = 0, j = from.length; i < j; i++ )
  mapping[ from.charAt( i ) ] = to.charAt( i );

function normalize(str) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }
      return ret.join( '' );
}

function initIsotope() {
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
};

function initSearch() {
	$.expr[':'].contains = function(a, i, m) {
	  return normalize($(a).text().toUpperCase())
	      .indexOf(normalize(m[3].toUpperCase())) >= 0;
	};
}

function updateMessage() {
	var hashOptions = $.deparam.fragment();
	var tag_count = 0;
	var format_count = 0;
	var group_count = 0;
	
	if (hashOptions.tags) {
		var filters = hashOptions.tags.split('.')
		tag_count = filters.length - 1;
	}		
	
	if (hashOptions.res_format) {
		var filters = hashOptions.res_format.split('.')
		format_count = filters.length - 1;
	}
	
	if (hashOptions.groups) {
		var filters = hashOptions.groups.split('.')
		group_count = filters.length - 1;
	}

	if (tag_count == 0 && format_count == 0 && group_count == 0 && 
		(!hashOptions.query || hashOptions.query.length == 0) &&
		 (!hashOptions.sort || hashOptions.sort.length == 0 || hashOptions.sort == 'original-order') ) {
		$('.tags-status .title').text('Estás viendo todos los datasets.');
		$('.tags-status .selection').hide();
		$('.tags-status .filter').hide();
		$('.tags-status .sort').hide();
		$('.tags-status small').hide();
	} else {
		var total = $('.dataset').length;
		$('.tags-status small').show();
		var cantidad = total - $('.dataset.isotope-hidden').length;
		$('.tags-status .title').html("Viendo <strong>" + cantidad + "</strong> datasets de un total de <strong>" + total +"</strong>. ");
		if ( tag_count > 0 || group_count > 0 || format_count > 0 ){
			$('.tags-status .selection').show();
			if (tag_count > 0 ) {
				final_str = tag_count + (tag_count > 1 ? " tags" : " tag");
				$('.tags-status .tags a').html(final_str);
				if (format_count > 0) {
					if (group_count > 0) {
						$('.tags-status .tag-union').html(',')
					} else {
						$('.tags-status .tag-union').html(' y')
					}
				}
				else {
					if (group_count > 0) {
						$('.tags-status .tag-union').html(' y')
					} else {
						$('.tags-status .tag-union').html('')
					}
				}
			} else {
				$('.tags-status .tags a').html('');
				$('.tags-status .tag-union').html('')
			}

			if (format_count > 0 ) {
				var format_str = format_count + (format_count > 1 ? " formatos" : " formato");
				$('.tags-status .res_format a').html(tag_count > 0 ? "" + format_str : format_str);
				if ( group_count > 0 ) {
					$('.tags-status .format-union').html('y')
				} else {
					$('.tags-status .format-union').html('')
				}
			} else {
				$('.tags-status .res_format a').html('');
				$('.tags-status .format-union').html('')
			}
			if (group_count > 0 ) {
				var group_str = group_count + (group_count > 1 ? " grupos" : " grupo");
				$('.tags-status .groups a').html(tag_count > 0 || format_count > 0 ? "" + group_str : group_str);
			} else {
				$('.tags-status .groups a').html('');
			}
		}
		else {
			$('.tags-status .selection').hide();
		}
		if (hashOptions.sort && hashOptions.sort.length > 0 && hashOptions.sort != 'original-order') {
			$('.tags-status .sort').show()
			$('.tags-status .sort a').html($('.facet.sort ul li a[ckan-sort="' + hashOptions.sort+'"]').text());
		} else {
			$('.tags-status .sort').hide();
		}
		if (hashOptions.query && hashOptions.query.length > 0 ) {
			$('.tags-status .filter').show();
			$('.tags-status .filter a').text(hashOptions.query);
		} else {
			$('.tags-status .filter').hide();
		}
	}
}

function filterDatasets() {
	var hashOptions = $.deparam.fragment();
	filter=""
	if (hashOptions.tags) {
		filter += hashOptions.tags;
	}		
	if (hashOptions.res_format) {
		filter += hashOptions.res_format;
	}
	if (hashOptions.groups) {
		filter += hashOptions.groups;
	}
	if (hashOptions.query) {
		if (!hashOptions.filter) {
			hashOptions.filter = "";
		}
		filter += ":contains('" + hashOptions.query + "')"
	}
	$('.datasets').isotope( {
		filter: filter,
		sortBy : hashOptions.sort 
	});
}

function showTagBox(ele){
	$('.tagbox .all [ckan-facet="'+ele+'"]').appendTo('.tagbox .visible');
}

function showDropdown(ele) {
	$($('.btn-group [ckan-facet="' + ele + '"]').parent()).show();
}

function showGroupBar(ele) {
	obj = $('.groups [ckan-facet="' + ele + '"]');
	if ( !obj.hasClass('active') )
		obj.addClass('active');
}

function hideTagBox(ele){
	$('.tagbox .visible [ckan-facet="'+ele+'"]').appendTo('.tagbox .all');
}

function hideDropdown(ele) {
	$($('.btn-group [ckan-facet="' + ele + '"]').parent()).hide();
}

function hideGroupBar(ele) {
	obj = $('.groups [ckan-facet="' + ele + '"]');
	if ( obj.hasClass('active') )
		obj.removeClass('active');
}

function showGroup(ele) {
	showTagBox(ele);
	showGroupBar(ele);
}

function showTag(ele){
	showTagBox(ele);
	hideDropdown(ele);
}

function showFormat(ele){
	showTagBox(ele);
	hideDropdown(ele);
}

function hideGroup(ele) {
	hideTagBox(ele);
	hideGroupBar(ele);
}

function hideTag(ele){
	hideTagBox(ele);
	showDropdown(ele);
}

function hideFormat(ele){
	hideTagBox(ele);
	showDropdown(ele);
}

function toggleQueryText(ele){
	$('#search').val(ele);
}

function toggleFacets() {
	var hashOptions = $.deparam.fragment();
	
	var filters;

	filters = [];
	if (hashOptions.tags) {
		filters = hashOptions.tags.split('.')
		for ( var i=1; i<filters.length; i++ ) {
			showTag(filters[i]);
		}
	} 
	$('.tagbox [ckan-filter="tags"]').each( function(index, element) {
		obj = $(element);
		facet = obj.attr('ckan-facet')
		if ( $.inArray(facet, filters) < 0 )
			hideTag(facet)
	});

	filters = [];
	if (hashOptions.res_format) {
		filters = hashOptions.res_format.split('.')
		for ( var i=1; i<filters.length; i++ ) {
			showFormat(filters[i])
		}
	}
	$('.tagbox [ckan-filter="res_format"]').each( function(index, element) {
		obj = $(element);
		facet = obj.attr('ckan-facet')
		if ( $.inArray(facet, filters) < 0)
			hideFormat(facet);
	});

	filters = [];
	if (hashOptions.groups) {
		filters = hashOptions.groups.split('.')
		for ( var i=1; i<filters.length; i++ ) {
			showGroup(filters[i])
		}
	}
	$('.tagbox [ckan-filter="groups"]').each( function(index, element) {
		obj = $(element);
		facet = obj.attr('ckan-facet')
		if ( $.inArray(facet, filters) < 0 )
			hideGroup(facet);
	});

}

function clearTagBox(filter){
	$('.tagbox [ckan-filter="'+filter+'"]').appendTo('.tagbox .all');
}

function clearDropdown(filter) {
	$($('.btn-group [ckan-filter="' + filter + '"]').parent()).show();
}

function clearFilter(eventObject) {
	var filter = $(eventObject.currentTarget).attr('ckan-filter');
	clearTagBox(filter);
	clearDropdown(filter);
	switch(filter){
		case 'groups':
			$.bbq.pushState( $.param( {groups: ""} ));
			break;
		case 'tags':
			$.bbq.pushState( $.param( {tags: ""} ));
			break;
		case 'res_format':
			$.bbq.pushState( $.param( {res_format: ""} ));
			break;
		case 'query':
			$.bbq.pushState( $.param( {query: ""} ));
			$('#search').val('');
			break;
		case 'sort':
			$.bbq.pushState( $.param( {sort: "original-order"} ));
			break;
	}
	return false;
}

function toggleUrlGroup(facet) {
	var hashOptions = $.deparam.fragment();
	if (hashOptions.groups) {
		index = hashOptions.groups.indexOf(facet);
		length = facet.length;
		if ( index < 0 ) {
			hashOptions.groups = hashOptions.groups + "." + facet;
		} else {
			hashOptions.groups = hashOptions.groups.replace("." + facet, "");
		}
	}
	else {
		hashOptions.groups = "." + facet;
	}
	$.bbq.pushState( $.param( { 
		groups: hashOptions.groups
	} ));
}

function toggleUrlTag(facet) {
	var hashOptions = $.deparam.fragment();
	if (hashOptions.tags) {
		index = hashOptions.tags.indexOf(facet);
		if ( index < 0 ) {
			hashOptions.tags = hashOptions.tags + "." + facet;
		} else {
			hashOptions.tags = hashOptions.tags.replace("." + facet, "");
		}
	}
	else {
		hashOptions.tags = "." + facet;
	}
	$.bbq.pushState( $.param( { 
		tags: hashOptions.tags
	} ));
}

function toggleUrlFormat(facet) {
	var hashOptions = $.deparam.fragment();
	if (hashOptions.res_format) {
		index = hashOptions.res_format.indexOf(facet);
		length = facet.length;
		if ( index < 0 ) {
			hashOptions.res_format = hashOptions.res_format + "." + facet;
		} else {
			hashOptions.res_format = hashOptions.res_format.replace("." + facet, "");
		}
	}
	else {
		hashOptions.res_format = "." + facet;
	}
	$.bbq.pushState( $.param( { 
		res_format: hashOptions.res_format
	} ));
}

function toggleFacetToFilter(eventObject) {
	var filter = $(eventObject.currentTarget).attr('ckan-filter');
	var facet = $(eventObject.currentTarget).attr('ckan-facet');

	switch(filter){
		case 'groups':
			toggleUrlGroup(facet)
			break;
		case 'tags':
			toggleUrlTag(facet)
			break;
		case 'res_format':
			toggleUrlFormat(facet)
			break;
	}

	return false;
}

function closeDropdowns() {
	$('[data-toggle="dropdown"]').parent().removeClass('open');
}

function toggleQuery(eventObject) {
	kwd = $(this).val();
	$.bbq.pushState( $.param( { 
		query: kwd
	} ));
	return true;
}

function toggleSort(eventObject) {
	sort_str = $(eventObject.currentTarget).attr('ckan-sort');
	$.bbq.pushState( $.param( { 
		sort: sort_str
	} ));
	return false;
}

function checkUrl() {
	closeDropdowns();
	toggleFacets();
  	filterDatasets();
  	updateMessage();
}

$( document ).ready( function() {
	$('.total-view-count, .last-modified').tooltip();

	initSearch();
  	initIsotope();
  	$(window).bind( 'hashchange', checkUrl).trigger('hashchange');
	$('a[ckan-clear]').click(clearFilter);
	$('a[ckan-facet]').click(toggleFacetToFilter);
	$('#search').keyup(toggleQuery) ;
	$('a[ckan-sort]').click(toggleSort);	
	$('.facet.groups ul li a span').tooltip();

});

