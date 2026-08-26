document.addEventListener("DOMContentLoaded", function () {
  var openBtn = document.querySelector(".openbtn");
  var nav = document.querySelector(".nav");
  var html = document.documentElement;

  if (!openBtn) return;

  openBtn.addEventListener("click", function () {
    openBtn.classList.toggle("active");
    html.classList.toggle("open");
  });

  if (nav) {
    nav.addEventListener("click", function () {
      openBtn.classList.remove("active");
      html.classList.remove("open");
    });
  }
});
