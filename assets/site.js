/* Syme Skyworks website · © 2026 Malcolm Syme · mcsyme11@gmail.com
 * Shared by every page: menu, reveal-on-scroll, gallery viewer, seasonal services
 * (tabs, map, sign-up form), seasonal pop-up and contact-form service pre-select.
 * Each part checks that its elements exist, so pages only run what they contain.
 * No per-frame work while scrolling.
 */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  function setText(sel, txt) { var el = document.querySelector(sel); if (el) el.textContent = txt; }

  /* ── Menu (phone and tablet) and the "More Services" dropdown ── */
  var btn = $("menuBtn"), nav = $("nav"), dropBtn = $("dropBtn"), drop = dropBtn ? dropBtn.parentNode : null;
  function setMenu(open) {
    if (!btn) return;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("open", open);
  }
  function setDrop(open) {
    if (!dropBtn) return;
    dropBtn.setAttribute("aria-expanded", open ? "true" : "false");
    drop.classList.toggle("open", open);
  }
  if (btn) btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  if (dropBtn) dropBtn.addEventListener("click", function (e) { e.stopPropagation(); setDrop(dropBtn.getAttribute("aria-expanded") !== "true"); });
  if (nav) nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { setMenu(false); setDrop(false); } });
  document.addEventListener("click", function (e) { if (drop && !drop.contains(e.target)) setDrop(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setMenu(false); setDrop(false); } });

  /* ── Reveal sections as they come into view ── */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ── Gallery viewer (gallery page) ── */
  var box = $("lightbox");
  if (box) {
    var img = $("lightboxImg"), cap = $("lightboxCap");
    var openShot = function (shot) {
      var t = shot.querySelector("img");
      img.src = shot.getAttribute("data-full"); img.alt = t.alt;
      cap.textContent = shot.querySelector("figcaption").textContent;
      if (box.showModal) box.showModal(); else window.open(img.src, "_blank");
    };
    document.querySelectorAll(".shot[data-full]").forEach(function (shot) {
      shot.addEventListener("click", function () { openShot(shot); });
      shot.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openShot(shot); } });
    });
    $("lightboxClose").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
  }

  /* ── Seasons: winter (November to March) features snow shoveling; April to October, landscaping ── */
  var now = new Date(), m = now.getMonth(), y = now.getFullYear();
  var winter = m >= 10 || m <= 2;
  var season = winter ? "snow" : "yard";
  var winterLabel = (m >= 10 ? y : y - 1) + "–" + String(m >= 10 ? y + 1 : y).slice(-2);

  /* ── Snow & Yards page: tabs, form and service-area map ── */
  var tabs = { snow: $("tab-snow"), yard: $("tab-yard") };
  var show = function () {};
  if (tabs.snow) {
    var panels = { snow: $("panel-snow"), yard: $("panel-yard") };
    var service = $("seasonService"), timing = $("seasonTiming"), subject = $("seasonSubject");
    if (winter) {
      setText(".js-snow-preseason", "Sign up any time this winter, or reserve your spot for next winter.");
      setText(".js-yard-preseason", "Pre-register now for the " + (m >= 10 ? y + 1 : y) + " season and you are first on the list when it opens.");
    } else {
      setText(".js-snow-preseason", "Pre-register now for winter " + y + "–" + String(y + 1).slice(-2) + " and your driveway is on the list before the first snow.");
      setText(".js-yard-preseason", "Sign up any time this season, or reserve your spot for next year.");
    }
    var syncForm = function () {
      var v = service.value;
      var wantSnow = v === "Snow shoveling" || v === "Both", wantYard = v === "Landscaping" || v === "Both";
      document.querySelectorAll('[data-for="snow"]').forEach(function (el) { el.hidden = !wantSnow; });
      document.querySelectorAll('[data-for="yard"]').forEach(function (el) { el.hidden = !wantYard; });
      var inSeason = (v === "Snow shoveling" && winter) || (v === "Landscaping" && !winter);
      if (v !== "Both") timing.value = inSeason ? "Start this season" : "Pre-register for next season";
      subject.value = v + " sign-up (" + timing.value.toLowerCase() + ") from Syme Skyworks website";
    };
    show = function (which, fromForm) {
      ["snow", "yard"].forEach(function (k) {
        var on = k === which;
        tabs[k].setAttribute("aria-selected", on ? "true" : "false");
        tabs[k].tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
      });
      if (!fromForm) { service.value = which === "snow" ? "Snow shoveling" : "Landscaping"; syncForm(); }
    };
    tabs.snow.addEventListener("click", function () { show("snow"); });
    tabs.yard.addEventListener("click", function () { show("yard"); });
    [tabs.snow, tabs.yard].forEach(function (t) {
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") { var nx = t === tabs.snow ? "yard" : "snow"; show(nx); tabs[nx].focus(); }
      });
    });
    service.addEventListener("change", function () {
      syncForm();
      if (service.value !== "Both") show(service.value === "Snow shoveling" ? "snow" : "yard", true);
    });
    timing.addEventListener("change", syncForm);
    var hashTab = location.hash === "#landscaping" ? "yard" : location.hash === "#snow" ? "snow" : null;
    show(hashTab || season);

    // Map: a ring around the Charles Carey loop (no pin), loaded when it scrolls into view
    var mapEl = $("areaMap"), mapMade = false;
    var makeMap = function () {
      if (mapMade) return; mapMade = true;
      if (!window.L) { mapEl.innerHTML = '<p style="padding:24px;color:#98A0AB">The map could not load. The service area is Charles Carey in Canmore.</p>'; return; }
      var centre = [51.07499, -115.36274]; // middle of the Charles Carey loop
      var map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
      map.fitBounds(L.latLng(centre).toBounds(560), { padding: [14, 14] });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      L.circle(centre, { radius: 210, color: "#C0A062", weight: 2, dashArray: "6 6", fillColor: "#C0A062", fillOpacity: 0.12, interactive: false }).addTo(map);
    };
    if (mapEl) {
      if ("IntersectionObserver" in window) {
        var mo = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { makeMap(); mo.disconnect(); } }, { rootMargin: "300px" });
        mo.observe(mapEl);
      } else { window.addEventListener("load", makeMap); }
    }
  }

  /* ── Seasonal pop-up: once per visitor per season, a few seconds after a page opens ── */
  var pop = $("seasonPop");
  if (pop) {
    var key = "ssw-pop-" + (winter ? "snow-" + winterLabel : "yard-" + y);
    var seen = function () { try { return localStorage.getItem(key) === "1"; } catch (e) { return false; } };
    var remember = function () { try { localStorage.setItem(key, "1"); } catch (e) {} };
    if (!winter) {
      setText("#popEyebrow", "Landscaping " + y);
      setText("#popTitle", "Landscaping sign-ups are open");
      setText("#popText", "Lawn mowing, weeding and yard cleanup on Charles Carey. Free quotes.");
      $("popCta").setAttribute("href", "snow.html#landscaping");
    } else {
      setText("#popEyebrow", "Winter " + winterLabel);
      $("popCta").setAttribute("href", "snow.html#snow");
    }
    var closePop = function () { pop.classList.remove("show"); remember(); setTimeout(function () { pop.hidden = true; }, 450); };
    if (!seen() && !/[?&]nopopup/.test(location.search)) {
      setTimeout(function () { pop.hidden = false; requestAnimationFrame(function () { pop.classList.add("show"); }); }, 3500);
      $("popClose").addEventListener("click", closePop);
      $("popCta").addEventListener("click", function (e) {
        closePop();
        if (tabs.snow) { e.preventDefault(); show(season); $("seasonal").scrollIntoView({ behavior: "smooth" }); }
      });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !pop.hidden) closePop(); });
    }
  }

  /* ── Contact page: pre-select the service from links such as contact.html?service=IT%20support ── */
  var sel = $("contactService");
  if (sel) {
    var want = new URLSearchParams(location.search).get("service");
    if (want) for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === want) { sel.selectedIndex = i; break; }
  }
})();
