function bindSidebarEvent () {
  var menuToggler = document.getElementById("sidebarToggler"),
      sidebar = document.getElementById("sidebar"),
      logo = document.getElementById("logo"),
      isOpen = false;

  sidebarToggler.onclick = function() {
    if( isOpen ) {
      sidebar.classList.remove("active");
      menuToggler.classList.remove("active");
      logo.classList.remove("active");
      isOpen = false;
    } else {
      sidebar.classList.add("active");
      menuToggler.classList.add("active");
      logo.classList.add("active");
      isOpen = true; 
    }
  }
}
document.addEventListener("turbolinks:load", function () {
  bindSidebarEvent();
});
