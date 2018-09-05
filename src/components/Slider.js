import Slide from './Slide.js'
import imagesLoaded from 'imagesloaded'

export default class Slider {
  constructor () {
    this.slides = []
    this.controls = document.getElementsByClassName('slide__control')
    this.nextBtn = document.getElementById('nextBtn')
    this.prevBtn = document.getElementById('prevBtn')
    this.loading = document.getElementById("loading")

    this.current = 0

    this.mainContainer = document.getElementById("sectionContainer")

    this.initSlides()

    this.direction = true
    this.inAnimation = false

    imagesLoaded( this.mainContainer, (instance) => {

      this.loading.style.display = "none";

      this.revealSlide()

      this.bindControlsEvent()
      this.bindKeyEvent()
      this.bindMouseEvent()
      this.bindTouchEvent()
    })

  }

  bindKeyEvent () {
    document.addEventListener("keyup", (event) => {
      if( event && ( event.keyCode == 39 || event.keyCode == 40 ) ) {
        this.direction = true
        this.changeSlide() 
      }
      if( event && ( event.keyCode == 38 || event.keyCode == 37 ) ) {
        this.direction = false
        this.changeSlide()
      } 
    })
  }

  bindMouseEvent () {
    document.addEventListener("mousewheel", (event) => {
      this.direction = event.wheelDelta < 0
      this.changeSlide()
    })
    document.addEventListener("DOMMouseScroll", (event) => {
      this.direction = event.detail == 3  
      this.changeSlide()
    })
  }

  bindTouchEvent () {
    let self = this
    self.touchtimes = 0
    self.touchx = []
    document.addEventListener("touchstart", (event) => {
      self.touchtimes ++ ;
      self.touchx[self.touchtimes] = event.changedTouches[0].clientY;  
    })

    document.addEventListener("toushend", (event) => {
      self.touchtimes ++ ;
      self.touchx[self.touchtimes] = event.changedTouches[0].clientY;

      if( ( Math.abs(self.touchx[self.touchtimes] - self.touchx[self.touchtimes-1]) > 50 ) && ( event.target.id != "sidebarToggler" ) ) {
        self.direction = touchx[touchtimes] > touchx[touchtimes - 1];
        self.changeSlide();
      }
    
    })
  }

  bindControlsEvent () {
    this.nextBtn.addEventListener("click", () => this.nextSlide())
    this.prevBtn.addEventListener("click", () => this.prevSlide())
  
  }

  initSlides () {
    let i = 0,
        sections = document.getElementsByClassName("slide__section");
    for ( let section of sections ) {
      let slide = new Slide(section, this)
      this.slides.push(slide)
      slide.control = this.controls[i]
      i++
    }
    this.controls[this.current].classList.add("current")
    this.len = this.slides.length
  }

  move () {
    if( this.direction ) {
      this.current ++
      if( this.current > this.len - 1 ) {
        this.current = 0
      }
    } else {
      this.current -- 
      if( this.current < 0 ) {
        this.current = this.len - 1
      }
    }
    this.revealSlide()
  }

  revealSlide () {
    this.slides[this.current].reveal()
  }

  changeSlide () {
    if( this.inAnimation ) {
      return
    }
    this.slides[this.current].reverse()
  }

  prevSlide () {
    this.direction = false
    this.changeSlide()
  }

  nextSlide () {
    this.direction = true
    this.changeSlide()
  }
}
