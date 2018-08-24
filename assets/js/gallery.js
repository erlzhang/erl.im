var galleryLinks = document.getElementsByClassName("gallery__link");

if( galleryLinks.length > 0 ) {
  for( var i = 0, len = galleryLinks.length; i < len; i ++ ) {
    galleryLinks[i].onclick = function(event) {
      event.preventDefault();
      var ele = event.target;
      while( ele.tagName != "A" ){
        ele = ele.parentNode;
      }
      var url = window.location.origin + ele.href + "/index.json";
      $.ajax({
        url: url,
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
