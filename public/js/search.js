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
		    	return $elem.find('.last-modified').text();
		    }
	  	}
	});
};

function initSearch() {
	$.expr[':'].contains = function(a, i, m) {
	  return $(a).text().toUpperCase()
	      .indexOf(m[3].toUpperCase()) >= 0;
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

	final_str = "";
	if (tag_count > 0 ) {
		final_str = tag_count + (tag_count > 1 ? " tags" : " tag");
	}
	if (format_count > 0 ) {
		var format_str = format_count + (format_count > 1 ? " formatos" : " formato");
		final_str += final_str.length > 0 ? ", " + format_str : format_str
	}
	if (group_count > 0 ) {
		var group_str = group_count + (group_count > 1 ? " grupos" : " grupo");
		final_str += final_str.length > 0 ? ", " + group_str : group_str;
	}
	var total = $('.dataset').length;
	var cantidad = total - $('.dataset.isotope-hidden').length;
	if (final_str.length > 0 ){
		final_str = "Seleccionaste <strong>" + final_str +"</strong>. Viendo <strong>" + cantidad + "</strong> datasets de un total de <strong>" + total +"</strong>."
	} else {
		final_str += "Estás viendo todos los datasets. "
	}
	$('.tags-status p').html(final_str);
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

function toggleTagBox(ele){
	$('.tagbox [ckan-facet="'+ele+'"]').toggle();
}

function toggleDropdown(ele) {
	$($('.btn-group [ckan-facet="' + ele + '"]').parent()).toggle();
}

function toggleGroupBar(ele) {
	$('.groups .' + ele + ' a').toggleClass('active');
}

function toggleGroup(ele) {
	toggleTagBox(ele);
	toggleGroupBar(ele);
}

function toggleTag(ele){
	toggleTagBox(ele);
	toggleDropdown(ele);
}

function toggleFormat(ele){
	toggleTagBox(ele);
	toggleDropdown(ele);
}

function toggleQueryText(ele){
	$('#search').val(ele);
}

function toggleFacets() {
	var hashOptions = $.deparam.fragment();
	
	if (hashOptions.tags) {
		var filters = hashOptions.tags.split('.')
		for ( var i=1; i<filters.length; i++ ) {
			toggleTag(filters[i]);
		}
	}		

	if (hashOptions.res_format) {
		var filters = hashOptions.res_format.split('.')
		for ( var i=1; i<filters.length; i++ ) {
			toggleFormat(filters[i])
		}
	}

	if (hashOptions.groups) {
		var filters = hashOptions.groups.split('.')
		for ( var i=1; i<filters.length; i++ ) {
			toggleGroup(filters[i])
		}
	}

	if (hashOptions.query) {
		toggleQueryText(hashOptions.query);
	}
}

function clearTagBox(filter){
	$('.tagbox [ckan-filter="'+filter+'"]').hide();
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
	}
	updateMessage();
	closeDropdowns();
	filterDatasets();
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
			toggleGroup(facet)
			toggleUrlGroup(facet)
			break;
		case 'tags':
			toggleTag(facet)
			toggleUrlTag(facet)
			break;
		case 'res_format':
			toggleFormat(facet)
			toggleUrlFormat(facet)
			break;
	}

	closeDropdowns();
	filterDatasets();
	updateMessage();
	return false;
}

function closeDropdowns() {
	$('[data-toggle="dropdown"]').parent().removeClass('open');
}

function toggleUrlQuery(query) {
	$.bbq.pushState( $.param( { 
		query: query
	} ));
}

function toggleQuery(eventObject) {
	kwd = $(this).val();
	toggleQueryText(kwd);
	toggleUrlQuery(kwd);
	updateMessage();
	filterDatasets();
	return true;
}

function toggleUrlSort(sort) {
	$.bbq.pushState( $.param( { 
		sort: sort
	} ));
}

function toggleSort(eventObject) {
	sort_str = $(eventObject.currentTarget).attr('ckan-sort');
	toggleUrlSort(sort_str);
	filterDatasets();
	closeDropdowns();
	updateMessage();
	return false;
}

$( document ).ready( function() {
	$('.total-view-count, .last-modified').tooltip();

	initSearch();
  	initIsotope();
  	toggleFacets();
  	filterDatasets();
  	updateMessage();

  	

	$('a[ckan-clear]').click(clearFilter);
	$('a[ckan-facet]').click(toggleFacetToFilter);
	$('#search').keyup(toggleQuery) ;
	$('a[ckan-sort]').click(toggleSort);	

});

