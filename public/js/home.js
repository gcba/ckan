$( document ).ready( function() {
  

  

  $.ajax({
    url: 'https://raw.github.com/gcba/ckan/abril-2013/public/js/home.jsonp',
      cache: false,
      dataType: "jsonp",
      success: function(data) {
        for ( caruselItem in caruselData ){
          $('.carousel-inner').append(data.title)
        }
      }
  });  

  

  $.jGFeed('http://digital.buenosaires.gob.ar/feed/',
    function(feeds){
      // Check for errors
      if(!feeds){
        // there was an error
        return false;
      }
      // do whatever you want with feeds here
      for(var i=0; i<feeds.entries.length; i++){
        var entry = feeds.entries[i];
        obj = $('.news-feed .news-item.dummy').clone().appendTo('.news-feed')
        obj.removeClass('dummy');
        var entryIndex = Math.floor(Math.random() * entry.categories.length - 1) + 1
        obj.find('.ribbon-type a').text(entry.categories[entryIndex]);
        obj.find('.ribbon-type a').attr('href', "http://digital.buenosaires.gob.ar/tag/" +entry.categories[entryIndex].replace(' ', '-') );
        var parsedDate = Date.parseExact(entry.publishedDate, "ddd, dd MMM yyyy hh:mm:ss zzz");
        obj.find('.ribbon-date').html(parsedDate.toString("dd/MM/yy"));
        obj.find('h3 a').html(entry.title);
        obj.find('h3 a').attr('href', entry.link);
        obj.find('p').html(entry.contentSnippet);
        obj.show();

        
        // entryy title
        entry.title;
      }
  }, 6);
});