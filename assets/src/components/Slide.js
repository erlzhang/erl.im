import { TweenMax, TimelineLite } from 'gsap/TweenMax'

export default class Slide {

  constructor(ele, slider) {
    this.ele = ele
    this.slider = slider

    this.imgPlaceholder = this.ele.getElementsByClassName("slide__img_placehold")[0]
    this.desc = this.ele.getElementsByClassName("slide__desc")[0]
    this.titleInner = this.ele.getElementsByClassName("slide__title_inner")[0]
    this.titleText = this.ele.getElementsByClassName("slide__title_text")[0]
    this.timeInner = this.ele.getElementsByClassName("slide__time_inner")[0]
    this.timeText = this.ele.getElementsByClassName("slide__time_text")[0]
  }

  reverse () {
    this.timeLine.reverse()
  }

  reveal () {
    this.show()

    if( this.timeLine ) {
      this.timeLine.restart()
      return
    } 

    this.timeLine = new TimelineLite();

    this.timeLine.add( TweenMax.to( this.imgPlaceholder, 0.75, {
      height: '100%',
      translateY: 0,
      opacity: 1
    }));
    this.timeLine.add( TweenMax.to( this.desc, 0.5, {
      translateY: 0,
      opacity: 1
    }), '-=0.3');
    this.timeLine.add( TweenMax.to( this.titleInner, 0.35, {
      width: '100%',
      opacity: 1
    }), '-=0.7');
    this.timeLine.add( TweenMax.to( this.titleText, 0.35, {
      translateX: 0,
      opacity: 1
    }), '-=0.3');
    this.timeLine.add( TweenMax.to( this.timeInner, 0.35, {
      width: '100%',
      opacity: 1
    }), '-=0.3')
    this.timeLine.add( TweenMax.to( this.timeText, 0.35, {
      translateX: 0,
      opacity: 1
    }));

    let self = this

    this.timeLine.eventCallback('onReverseComplete', () => {
      self.hide()
      self.slider.move()
    });
    
    this.timeLine.eventCallback('onStart', function() {
      self.slider.inAnimation = true
    });
    
    this.timeLine.eventCallback('onComplete', function() {
      self.slider.inAnimation = false
    })
  }

  hide () {
    this.control.classList.remove("current")
    this.ele.style.opacity = '0'
    this.ele.style.zIndex = '1'
  }

  show () {
    this.ele.style.opacity = '1'
    this.ele.style.zIndex = '5'
    this.ele.classList.add("current") 
  }
  
}
