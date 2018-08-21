var galleryLinks = document.getElementsByClassName("gallery-link");

if( galleryLinks.length > 0 ) {
  for( var i = 0, len = galleryLinks.length; i < len; i ++ ) {
    galleryLinks[i].onclick = function(event) {
      event.preventDefault();
      var ele = event.target;
      while( ele.tagName != "A" ){
        ele = ele.parentNode;
      }
      $.ajax({
        url: ele.href,
        type: "get",
        dataType: "JSON",
        success: function(data) {
          if( data.length >= 0 ) {
            images = []
            for( var i = 0, len = data.length; i < len; i ++ ) {
              images.push({src: ele.href + data[i]});
            }
            $.fancybox.open(images);
          }
        }
      });
    }
  } 
}
