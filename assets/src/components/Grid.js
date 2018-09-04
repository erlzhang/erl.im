import imagesLoaded from 'imagesloaded'
import anime from 'animejs'

export default class {
  constructor () {
    this.ele = document.getElementById("grid")
    this.items = this.ele.querySelectorAll(".gallery__item > .gallery__link")
    this.loading = document.getElementById("loading")

    this.effect = {
			animeOpts: {
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
				scale: [0,1]	
			}
    }

		this.grid = new Masonry(this.ele, {
			itemSelector: '.gallery__item',
			percentPosition: true,
			transitionDuration: 0
		});

    initEffect () {
    
    }

    resetStyles () {
    
    }
  
  }

}
