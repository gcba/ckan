$( document ).ready( function() {
  
  caruselData = [
    {
      isActive: true,
      title: 'Un nueva versión de Buenos Aires Data.',
      links: [
        {id: 'datasets', text: 'Acceso programático via RESTful API a los conjuntos de datos.', img_url: '/img/datasets.png'},
        {id: 'recline', text: 'Visualización de los conjuntos de datos en formato de lista, gráficos y mapas interactivos.',img_url: '/img/recline.png'},
        {id: 'formats', text: 'Agregamos formatos de datos nuevos.',img_url: '/img/formats.png'},
        {id: 'api', text: 'Nuevo modo de acceder y filtrar los datasets.',img_url: '/img/api.png'}
      ]
    },
    {
      isActive: false,
      title: 'Un segunda versión de Buenos Aires Data.',
      links: [
        {id: 'datasets', text: 'Acceso programático via RESTful API a los conjuntos de datos.', img_url: '/img/datasets.png'},
        {id: 'recline', text: 'Visualización de los conjuntos de datos en formato de lista, gráficos y mapas interactivos.',img_url: '/img/recline.png'},
        {id: 'formats', text: 'Agregamos formatos de datos nuevos.',img_url: '/img/formats.png'},
        {id: 'api', text: 'Nuevo modo de acceder y filtrar los datasets.',img_url: '/img/api.png'}
      ]
    }
  ];

  for ( caruselItem in caruselData ){
    var data = caruselData[caruselItem]
    
    var prefixStr = '<div class="item ' + (data.isActive ? 'active' : '') + ' feature-ckan"><div class="container">'
    var imgsStr = ''
    for ( linkIndex in data.links) {
      var link = data.links[linkIndex]
      imgsStr += '<img id="' + link.id + '" src="' +  link.img_url + '" />'
    }
    var middleStr = '<div class="carousel-caption"><h2>' + data.title + '</h2><ul>'
    var linksStr = ''
    for ( linkIndex in data.links ){
      var link = data.links[linkIndex];
      linksStr += '<li><a href="#" img-id="' + link.id + '">' + link.text + '</a></li>';
    }
    var suffixStr = '</ul> </div> </div> </div>'
    $('.carousel-inner').append(prefixStr + imgsStr + middleStr + linksStr + suffixStr)
  }

  if (caruselData.length > 1 )
  {
    $('#homeCarousel').append('<a class="left carousel-control" href="#homeCarousel" data-slide="prev">&lsaquo;</a> <a class="right carousel-control" href="#homeCarousel" data-slide="next">&rsaquo;</a> #}');
  }

  $('.carousel-inner img').hide();
  $('.carousel-inner img:first-child').show();
  $('.carousel-inner a').hover(function(){
    var imgId = $(this).attr('img-id')
    $('.carousel-inner img').hide();
    $('.carousel-inner #' + imgId).show();
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