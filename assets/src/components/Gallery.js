import $ from "jquery"
require('fancybox')($)

export default class {
  constructor () {
    this.links = document.getElementsByClassName("gallery__link")
    this.options = {
      buttons: [
        "zoom",
        "slideShow",
        "fullScreen",
        "thumbs",
        "close"
      ]
    }
    for( let link of this.links ) {
      link.url = link.href + "index.json"

      link.addEventListener("click", (event) => {
        showGallery(event);
      });
    
    }
  }

  showGallery (event) {
    event.preventDefault()

    let ele = event.target
    while( ele.tagName != "A" ) {
      ele = ele.parentNode
    }

    $.ajax({
      url: url,
      type: "get",
      dataType: "JSON",
      success: function(data) {
        if( data.length >= 0 ) {
          images = []
          for( let d of data ) {
            images.push({src: ele.href + d});
          }
          $.fancybox.open(images, this.options);
        }
      }
    })
  
  }
}
