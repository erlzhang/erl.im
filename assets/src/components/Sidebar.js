export default class {
  constructor () {
    this.ele = document.getElementById("sidebar");
    this.toggler = document.getElementById("sidebarToggler");
    this.logo = document.getElementById("logo");
    this.isOpen = false;

    if( this.toggler ) {
      this.toggler.addEventListener("click", () => {
        this.toggle()
      })
    }

  }

  toggle () {
    if( this.isOpen ) {
      this.ele.classList.remove("active");
      this.toggler.classList.remove("active");
      this.logo.classList.remove("active");
      this.isOpen = false;
    } else {
      this.ele.classList.add("active");
      this.toggler.classList.add("active");
      this.logo.classList.add("active");
      this.isOpen = true;
    }
  }
}
