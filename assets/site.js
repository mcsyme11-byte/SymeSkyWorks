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

/* Seasonal services: tabs, service-area map, sign-up form and seasonal pop-up.
 * Winter (November to March) features snow shoveling; April to October features landscaping.
 * © 2026 Malcolm Syme · mcsyme11@gmail.com
 */
(function () {
  "use strict";
  var now = new Date(), m = now.getMonth(), y = now.getFullYear();
  var winter = m >= 10 || m <= 2;
  var season = winter ? "snow" : "yard";
  var winterLabel = (m >= 10 ? y : y - 1) + "–" + String((m >= 10 ? y + 1 : y)).slice(-2);
  var nextYardYear = m >= 10 ? y + 1 : y;
  var nextWinter = (m <= 2 ? y : y) + "–" + String(y + 1).slice(-2);

  // Wording that depends on the time of year
  function setText(sel, txt) { var el = document.querySelector(sel); if (el) el.textContent = txt; }
  if (winter) {
    setText(".js-snow-preseason", "Sign up any time this winter, or reserve your spot for next winter.");
    setText(".js-yard-preseason", "Pre-register now for the " + nextYardYear + " season and you are first on the list when it opens.");
  } else {
    setText(".js-snow-preseason", "Pre-register now for winter " + nextWinter + " and your driveway is on the list before the first snow.");
    setText(".js-yard-preseason", "Sign up any time this season, or reserve your spot for next year.");
  }

  // Tabs
  var tabs = { snow: document.getElementById("tab-snow"), yard: document.getElementById("tab-yard") };
  var panels = { snow: document.getElementById("panel-snow"), yard: document.getElementById("panel-yard") };
  var service = document.getElementById("seasonService");
  var timing = document.getElementById("seasonTiming");
  var subject = document.getElementById("seasonSubject");
  function show(which, fromForm) {
    ["snow", "yard"].forEach(function (k) {
      var on = k === which;
      tabs[k].setAttribute("aria-selected", on ? "true" : "false");
      tabs[k].tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
    });
    if (!fromForm && service) { service.value = which === "snow" ? "Snow shoveling" : "Landscaping"; syncForm(); }
  }
  if (!tabs.snow) return;
  tabs.snow.addEventListener("click", function () { show("snow"); });
  tabs.yard.addEventListener("click", function () { show("yard"); });
  [tabs.snow, tabs.yard].forEach(function (t) {
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        var next = t === tabs.snow ? "yard" : "snow"; show(next); tabs[next].focus();
      }
    });
  });

  // Form: show only the fields for the chosen service, and pick sensible timing
  function syncForm() {
    var v = service.value;
    var wantSnow = v === "Snow shoveling" || v === "Both";
    var wantYard = v === "Landscaping" || v === "Both";
    document.querySelectorAll('[data-for="snow"]').forEach(function (el) { el.hidden = !wantSnow; });
    document.querySelectorAll('[data-for="yard"]').forEach(function (el) { el.hidden = !wantYard; });
    var inSeason = (v === "Snow shoveling" && winter) || (v === "Landscaping" && !winter);
    if (v !== "Both") timing.value = inSeason ? "Start this season" : "Pre-register for next season";
    subject.value = v + " sign-up (" + timing.value.toLowerCase() + ") from Syme Skyworks website";
  }
  service.addEventListener("change", function () {
    syncForm();
    if (service.value !== "Both") show(service.value === "Snow shoveling" ? "snow" : "yard", true);
  });
  timing.addEventListener("change", syncForm);
  show(season);

  // Service-area map: a ring around the Charles Carey loop (no pin), loaded when it scrolls into view
  var mapEl = document.getElementById("areaMap");
  var mapMade = false;
  function makeMap() {
    if (mapMade) return; mapMade = true;
    if (!window.L) { mapEl.innerHTML = '<p style="padding:24px;color:#98A0AB">The map could not load. The service area is Charles Carey in Canmore.</p>'; return; }
    var centre = [51.07515, -115.36199]; // middle of the Charles Carey loop
    var map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
    map.fitBounds(L.latLng(centre).toBounds(560), { padding: [14, 14] });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.circle(centre, { radius: 200, color: "#C0A062", weight: 2, dashArray: "6 6", fillColor: "#C0A062", fillOpacity: 0.12, interactive: false }).addTo(map);
  }
  if ("IntersectionObserver" in window) {
    var mo = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { makeMap(); mo.disconnect(); } }, { rootMargin: "300px" });
    mo.observe(mapEl);
  } else { window.addEventListener("load", makeMap); }

  // Seasonal pop-up: once per visitor per season, a few seconds after the page opens
  var pop = document.getElementById("seasonPop");
  var key = "ssw-pop-" + (winter ? "snow-" + winterLabel : "yard-" + y);
  function seen() { try { return localStorage.getItem(key) === "1"; } catch (e) { return false; } }
  function remember() { try { localStorage.setItem(key, "1"); } catch (e) {} }
  if (!winter) {
    setText("#popEyebrow", "Landscaping " + y);
    setText("#popTitle", "Landscaping sign-ups are open");
    setText("#popText", "Lawn mowing, weeding and yard cleanup on Charles Carey. Free quotes.");
  } else {
    setText("#popEyebrow", "Winter " + winterLabel);
  }
  function closePop() { pop.classList.remove("show"); remember(); setTimeout(function () { pop.hidden = true; }, 450); }
  if (pop && !seen() && !/[?&]nopopup/.test(location.search)) {
    setTimeout(function () {
      pop.hidden = false;
      requestAnimationFrame(function () { pop.classList.add("show"); });
    }, 3500);
    document.getElementById("popClose").addEventListener("click", closePop);
    document.getElementById("popCta").addEventListener("click", function () { show(season); closePop(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !pop.hidden) closePop(); });
  }
})();

/* "Get IT Help" and similar links pre-select the service in the contact form. */
(function () {
  "use strict";
  var sel = document.getElementById("contactService");
  if (!sel) return;
  document.querySelectorAll("a[data-service]").forEach(function (a) {
    a.addEventListener("click", function () {
      var want = a.getAttribute("data-service");
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === want) { sel.selectedIndex = i; break; }
    });
  });
})();
