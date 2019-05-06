export default class Smiley {
  constructor (messageArea) {
    this.messageArea = messageArea;
    this.eles = document.getElementsByClassName("comment__smiley");
    this.smileys = {}

    let _this = this;
    for( let ele of this.eles ) {
      var tag = ele.getAttribute("data-smiley"),
          src = ele.getAttribute("data-src");

      this.smileys[tag] = src;

      ele.onclick = function(event) {
        event.preventDefault();
        let tag = this.getAttribute("data-smiley");
        _this.insert(tag);
      }
    }
  }

  show() {}

  hide() {}

  insert(tag) {
    tag = ' ' + tag + ' ';
    this.messageArea.value += tag;
    this.messageArea.focus();
  }

  parse(message) {
    var _this = this
    return message.replace(/:[a-z]+:/, ($0) => {
      console.log($0)
      console.log(_this.smileys)
      return '<img src="' + _this.smileys[$0] + '"/>';
    })
  }
}
