function PageTopAnime() {
  var pageTop = document.getElementById("page-top");
  if (!pageTop) return;

  var scroll = window.pageYOffset || document.documentElement.scrollTop;

  if (scroll >= 200) {
    pageTop.classList.remove("DownMove");
    pageTop.classList.add("UpMove");
  } else if (pageTop.classList.contains("UpMove")) {
    pageTop.classList.remove("UpMove");
    pageTop.classList.add("DownMove");
  }
}

window.addEventListener("scroll", PageTopAnime);
window.addEventListener("load", PageTopAnime);

document.addEventListener("DOMContentLoaded", function () {
  var pageTopLink = document.querySelector("#page-top a");
  if (!pageTopLink) return;

  pageTopLink.addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
