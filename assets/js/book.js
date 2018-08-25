function bindBookEvent () {
  var toggler = document.getElementById("summaryToggler"),
        main = document.getElementById("bookMain"),
        isOpen = false;

  toggler.onclick = function (event) {
    event.preventDefault();
    if( isOpen ) {
      main.classList.remove("with-summary");
      toggler.classList.remove("active");
      isOpen = false;
    } else {
      main.classList.add("with-summary");
      toggler.classList.add("active")
      isOpen = true;
    }
  }
}

document.addEventListener("turbolinks:load", function () {
  bindBookEvent();
});
