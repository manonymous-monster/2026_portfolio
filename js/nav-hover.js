(function () {
  var links = document.querySelectorAll(".nav-link");
  if (!links.length || typeof gsap === "undefined") return;

  var mm = gsap.matchMedia();

  mm.add(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    function () {
      var cleanups = [];

      links.forEach(function (link) {
        var track = link.querySelector(".nav-link__track");
        if (!track) return;

        var tl = gsap.timeline({ paused: true });
        tl.to(track, {
          yPercent: -100,
          duration: 0.45,
          ease: "power3.inOut",
        });

        function enter() {
          tl.play();
        }

        function leave() {
          tl.reverse();
        }

        link.addEventListener("mouseenter", enter);
        link.addEventListener("mouseleave", leave);
        link.addEventListener("focus", enter);
        link.addEventListener("blur", leave);

        cleanups.push(function () {
          link.removeEventListener("mouseenter", enter);
          link.removeEventListener("mouseleave", leave);
          link.removeEventListener("focus", enter);
          link.removeEventListener("blur", leave);
          tl.kill();
          gsap.set(track, { yPercent: 0 });
        });
      });

      return function () {
        cleanups.forEach(function (fn) {
          fn();
        });
      };
    }
  );
})();
