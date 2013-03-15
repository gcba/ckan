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
	or_filter = []
	filter=""
	sufix_filter=""
	if (hashOptions.tags ) {
		switch (hashOptions.tags_op) {
			case 'or':
				miArray = hashOptions.tags.split('.');
				miArray.splice(0,1);
				or_filter = or_filter.concat(miArray);
				break;
			case 'and':
			default:
				filter += hashOptions.tags;
				break;
		}
	}		
	if (hashOptions.res_format) {
		
		switch (hashOptions.res_format_op) {
			case 'or':
				miArray = hashOptions.res_format.split('.');
				miArray.splice(0,1);
				or_filter = or_filter.concat(miArray);
				break;
			case 'and':
			default:
				filter += hashOptions.res_format;
				break;
		}
	}
	if (hashOptions.groups) {
		
		switch (hashOptions.groups_op) {
			case 'and':
				filter += hashOptions.groups;
				break;
			case 'or':
			default:
				miArray = hashOptions.groups.split('.');
				miArray.splice(0,1);
				or_filter = or_filter.concat(miArray);
				break;
		}
	}
	if (hashOptions.query) {
		// if (!hashOptions.filter) {
		// 	hashOptions.filter = "";
		// }
		sufix_filter = ":contains('" + hashOptions.query + "')"
	}
	selectors = $.map(or_filter, function(value, index){ return filter + '.' + value + sufix_filter; });
	$('.datasets').isotope( {
		filter: selectors.length > 0 ? selectors.join():filter+sufix_filter,
		sortBy : hashOptions.sort 
	});
}

function showTagBox(ele){
	$('.tagbox .all [ckan-category="'+ele+'"]').appendTo('.tagbox .visible');
}

function showGroupBar(ele) {
	obj = $('.group [ckan-category="' + ele + '"]');
	if ( !obj.hasClass('active') )
		obj.addClass('active');
}

function hideTagBox(ele){
	$('.tagbox .visible [ckan-category="'+ele+'"]').appendTo('.tagbox .all');
}

function hideGroupBar(ele) {
	obj = $('.group [ckan-category="' + ele + '"]');
	if ( obj.hasClass('active') )
		obj.removeClass('active');
}

function showGroup(ele) {
	showTagBox(ele);
}

function showTag(ele){
	showTagBox(ele);
}

function showFormat(ele){
	showTagBox(ele);
}

function hideGroup(ele) {
	hideTagBox(ele);
}

function hideTag(ele){
	hideTagBox(ele);
}

function hideFormat(ele){
	hideTagBox(ele);
}

function toggleQueryText(ele){
	$('#search').val(ele);
}

function unique(array){
    return $.grep(array,function(el,index){
        return index == $.inArray(el,array);
    });
}

function getAllFacetCategories(facet, selectedCategories, onlyVisible) {
	answer = []
	$('.dataset.isotope-item').each(function(index, value) {
		var theObj = $(value);
		if ( !onlyVisible || !theObj.hasClass('isotope-hidden') ){
			atributo = theObj.attr('ckan-' + facet);
			elementos = atributo.split(',');
			for ( var i = 0; i < elementos.length; i++) {
				var elemento = elementos[i];
				if ( elemento.length > 0) {
					answer.push(elemento);
				}
			}
		}
	});

	all_elementos = unique(answer);
	final_answer = []
	for ( var i = 0; i < all_elementos.length; i++ ) {
		var elemento = all_elementos[i];
		if (  $.inArray(elemento, selectedCategories ) < 0) {
			final_answer.push(elemento);
		}
	}
	return final_answer;
}

function initSelector(facet, parentObj) {
	parentExample = parentObj.find('.example');
	categories = getAllFacetCategories(facet, [], false);
	for ( var i = 0; i < categories.length; i++ ) {
		var category = categories[i];
		newEle = parentExample.clone();
		newEle.removeClass('example');
		newEle.addClass('toggleable');
		newEle.attr('ckan-category', category);
		toChangeCategoryList = newEle.find('[ckan-category]')
		if (toChangeCategoryList) {
			toChangeCategoryList.each(function(){$(this).attr('ckan-category', category)});
		}
		toTitle = newEle.find('.category-name');
		if (toTitle) {
			toTitle.text(category);
		}
		parentObj.prepend(newEle);
	}
}

function initSelectors() {
	$('[ckan-category-creator]').each(function(value, index) {
		theObj = $(this);
		initSelector(theObj.attr('ckan-facet'), theObj);
	});
}

function updateSelector(facet, selectedCategories, parentSelector, operator) {
	var categories = getAllFacetCategories(facet, selectedCategories, true)
	var parentObj = $(parentSelector);
	var all_categories = getAllFacetCategories(facet, selectedCategories, false);
	var toggleables = parentObj.find('.toggleable');
	var disableObj = parentObj.find('.disableable');

	toggleables.removeClass('selectable active');
	toggleables.addClass(operator);

	switch (operator) {
		case 'or':
			selectedCategories = (selectedCategories.length == 0)? all_categories : selectedCategories;
			selectors = $.map(selectedCategories, function(value, index){ return '.toggleable[ckan-category="' + value + '"]'; });
			parentObj.find(selectors.join()).addClass('active');
			return all_categories.length;
		case 'and':
			if ( categories.length > 0 ){
				selectors = $.map(categories, function(value, index){ return '.toggleable[ckan-category="' + value + '"]'; });
				parentObj.find(selectors.join()).addClass('selectable');
				if (disableObj) {
					disableObj.removeAttr('disabled');
				}
			} else {
				if (disableObj) {
					disableObj.attr('disabled', '')
				}
			}
			return categories.length;
	}
}

function updateSelectors() {
	var hashOptions = $.deparam.fragment();
	var categories = [];
	var operator = hashOptions.tags_op == 'or' ? 'or' : 'and';
	if (hashOptions.tags) {
		categories = hashOptions.tags.split('.')
	} 
	var counter = updateSelector('tags', categories, '.facet.tags', operator);
	$('.facet-counter[ckan-facet="tags"]').text(counter);

	var operator = hashOptions.res_format == 'or' ? 'or' : 'and';
	var categories = []
	if (hashOptions.res_format) {
		categories = hashOptions.res_format.split('.')
	}
	var counter = updateSelector('res_format', categories, '.facet.formats', operator);
	$('.facet-counter[ckan-facet="res_format"]').text(counter);

	var categories = []
	var operator = hashOptions.groups_op == 'and' ? 'and' : 'or';
	if (hashOptions.groups) {
		categories = hashOptions.groups.split('.')
	}
	var counter = updateSelector('groups', categories, '.facet.groups ul', operator);
}



function updateTagbox() {
	var hashOptions = $.deparam.fragment();

	var filters;

	filters = [];
	if (hashOptions.tags) {
		filters = hashOptions.tags.split('.')
		for ( var i=1; i<filters.length; i++ ) {
			showTag(filters[i]);
		}
	} 
	$('.tagbox [ckan-facet="tags"]').each( function(index, element) {
		obj = $(element);
		facet = obj.attr('ckan-category')
		if ( $.inArray(facet, filters) < 0 )
			hideTag(facet)
	});
	if (hashOptions.tags_op && hashOptions.tags_op == 'or') {
		$('.tagbox [ckan-facet="tags"] span.facet-operator').text('|')
	} else {
		$('.tagbox [ckan-facet="tags"] span.facet-operator').text('&')
	}
	

	filters = [];
	if (hashOptions.res_format) {
		filters = hashOptions.res_format.split('.')
		for ( var i=1; i<filters.length; i++ ) {
			showFormat(filters[i])
		}
	}
	$('.tagbox [ckan-facet="res_format"]').each( function(index, element) {
		obj = $(element);
		facet = obj.attr('ckan-category')
		if ( $.inArray(facet, filters) < 0)
			hideFormat(facet);
	});
	if (hashOptions.res_format_op && hashOptions.res_format_op == 'or') {
		$('.tagbox [ckan-facet="res_format"] span.facet-operator').text('|')
	} else {
		$('.tagbox [ckan-facet="res_format"] span.facet-operator').text('&')
	}

	filters = [];
	if (hashOptions.groups) {
		filters = hashOptions.groups.split('.')
		for ( var i=1; i<filters.length; i++ ) {
			showGroup(filters[i])
		}
	}
	$('.tagbox [ckan-facet="groups"]').each( function(index, element) {
		obj = $(element);
		facet = obj.attr('ckan-category')
		if ( $.inArray(facet, filters) < 0 )
			hideGroup(facet);
	});
	if (hashOptions.groups_op && hashOptions.groups_op == 'and') {
		$('.tagbox [ckan-facet="groups"] span.facet-operator').text('&')
	} else {
		$('.tagbox [ckan-facet="groups"] span.facet-operator').text('|')
	}


}

function clearTagBox(filter){
	$('.tagbox [ckan-facet="'+filter+'"]').appendTo('.tagbox .all');
}


function clearFilter(eventObject) {
	var filter = $(eventObject.currentTarget).attr('ckan-facet');
	clearTagBox(filter);
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
		case 'all':
			$.bbq.pushState( $.param( {groups: ""} ));
			$.bbq.pushState( $.param( {tags: ""} ));
			$.bbq.pushState( $.param( {res_format: ""} ));
			$.bbq.pushState( $.param( {query: ""} ));
			$.bbq.pushState( $.param( {sort: "original-order"} ));
			break;
	}
  	closeDropdowns();

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
	var facet = $(eventObject.currentTarget).attr('ckan-facet');
	var category = $(eventObject.currentTarget).attr('ckan-category');

	switch(facet){
		case 'groups':
			toggleUrlGroup(category)
			break;
		case 'tags':
			toggleUrlTag(category)
			break;
		case 'res_format':
			toggleUrlFormat(category)
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
	updateTagbox();
  	filterDatasets();
  	updateSelectors();
  	updateMessage();
  	closeDropdowns();
}

$( document ).ready( function() {
	$('.total-view-count, .last-modified').tooltip();

	initSearch();
  	initIsotope();
  	initSelectors();

  	$(window).bind( 'hashchange', checkUrl).trigger('hashchange');
	$('a[ckan-clear]').click(clearFilter);
	$('#search').keyup(toggleQuery) ;
	$('a[ckan-category]').click(toggleFacetToFilter);
	$('a[ckan-sort]').click(toggleSort);	
	$('.toolbar li.facet.groups ul li a span').tooltip();

});

