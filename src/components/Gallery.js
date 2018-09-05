const $ = require("jquery");
window.jQuery = $;
require("@fancyapps/fancybox");

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
        event.preventDefault()
        this.showGallery(event);
      });
    
    }
  }

  showGallery (event) {

    let ele = event.target
    while( ele.tagName != "A" ) {
      ele = ele.parentNode
    }

    let options = this.options;

    $.ajax({
      url: ele.url,
      type: "get",
      dataType: "JSON",
      success: function(data) {
        if( data.length >= 0 ) {
          let images = []
          for( let datum of data ) {
            images.push({src: ele.href + datum});
          }
          $.fancybox.open(images, options);
        }
      }
    })
  }
}
