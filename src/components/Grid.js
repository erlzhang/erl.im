import imagesLoaded from 'imagesloaded'
import anime from 'animejs'
import Masonry from 'masonry-layout'

export default class {
  constructor () {
    this.ele = document.getElementById("grid")
    this.items = this.ele.querySelectorAll(".gallery__item > .gallery__link")
    this.loading = document.getElementById("loading")

    this.options = {
			duration: function(t,i) {
				return 600 + i*75;
			},
			easing: 'easeOutExpo',
			delay: function(t,i) {
				return i*50;
			},
			opacity: {
				value: [0,1],
				easing: 'linear'
			},
			scale: [0,1],
      targets: this.items
		}

		this.grid = new Masonry(this.ele, {
			itemSelector: '.gallery__item',
			percentPosition: true,
			transitionDuration: 0
		});

    imagesLoaded( document.body, () => {
      this.loading.style.display = "none"
      this.renderEffect()
    })

  }

  renderEffect () {
    this.resetStyles()
    anime(this.options);
  }

  resetStyles () {
    for( let item of this.items ) {
      let gItem = item.parentNode
      item.style.opacity = 0
      item.style.WebkitTransformOrigin = item.style.transformOrigin = '50% 50%'
      item.style.transform = 'none'
      gItem.style.overfow = ""
    }
  }

}
