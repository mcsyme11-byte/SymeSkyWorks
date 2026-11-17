/* Syme Skyworks website · © 2026 Malcolm Syme · mcsyme11@gmail.com
 * Menu, reveal-on-scroll and the gallery viewer. No per-frame work while scrolling.
 */
(function () {
  "use strict";

  // Phone menu
  var btn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("open", open);
  }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Reveal sections as they come into view
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Gallery viewer
  var box = document.getElementById("lightbox");
  var img = document.getElementById("lightboxImg");
  var cap = document.getElementById("lightboxCap");
  function open(shot) {
    var t = shot.querySelector("img");
    img.src = shot.getAttribute("data-full");
    img.alt = t.alt;
    cap.textContent = shot.querySelector("figcaption").textContent;
    if (box.showModal) box.showModal(); else window.open(img.src, "_blank");
  }
  document.querySelectorAll(".shot").forEach(function (shot) {
    shot.addEventListener("click", function () { open(shot); });
    shot.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(shot); }
    });
  });
  document.getElementById("lightboxClose").addEventListener("click", function () { box.close(); });
  box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
})();
