// =======================
// SAFE SELECTORS
// =======================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// =======================
// DOM READY
// =======================
document.addEventListener("DOMContentLoaded", () => {

  // =======================
  // FOOTER YEAR
  // =======================
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =======================
  // CLOCKS & CALENDARS
  // =======================
  function updateTimes() {
    const now = new Date();

    try {
      const cest = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Europe/Zurich"
      }).format(now);

      const el = $("#clock-cest span");
      if (el) el.textContent = cest.replace(",", " —");
    } catch {}

    try {
      const hijri = new Intl.DateTimeFormat("en-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(now);

      const el = $("#cal-hijri span");
      if (el) el.textContent = hijri + " AH";
    } catch {}

    try {
      const gYear = now.getFullYear();
      const vsYear = now.getMonth() >= 3 ? gYear + 57 : gYear + 56;
      const el = $("#cal-hindi span");
      if (el) el.textContent = "VS " + vsYear;
    } catch {}

    const tz = (id, zone) => {
      const el = $(id + " span");
      if (!el) return;
      el.textContent = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: zone
      }).format(now);
    };

    tz("#tz-ist", "Asia/Kolkata");
    tz("#tz-pkt", "Asia/Karachi");
  }

  updateTimes();
  setInterval(updateTimes, 1000);

  // =======================
  // NAVIGATION DROPDOWNS
  // =======================
  $$(".nav-item.has-sub > .nav-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const li = btn.closest(".nav-item");
      $$(".nav-item.open").forEach(n => n !== li && n.classList.remove("open"));
      li.classList.toggle("open");
    });
  });

  document.addEventListener("click", () => {
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
  });

  // =======================
  // MOBILE MENU
  // =======================
  const hamburger = $("#hamburger");
  const mobileMenu = $("#mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!open));

      if (!open) {
        mobileMenu.innerHTML = "";
        const clone = $("#nav-list")?.cloneNode(true);
        if (clone) {
          clone.id = "nav-list-mobile";
          clone.querySelectorAll(".dropdown").forEach(d => d.remove());
          mobileMenu.appendChild(clone);
        }
        mobileMenu.hidden = false;
      } else {
        mobileMenu.hidden = true;
      }
    });
  }

  // =======================
  // WEATHER BAR
  // =======================
  const cities = [
    ["Zurich", 47.3769, 8.5417],
    ["Jammu", 32.7266, 74.857],
    ["Kashmir", 34.0837, 74.7973],
    ["Ladakh", 34.1526, 77.5771],
    ["Gilgit", 35.9208, 74.308],
    ["Baltistan", 35.3025, 75.636],
    ["Muzaffarabad", 34.37, 73.47],
    ["Rawalakot", 33.8578, 73.7604]
  ];

  const weatherBar = $("#weather-bar");

  async function loadWeather() {
    if (!weatherBar) return;
    weatherBar.innerHTML = "";

    for (const [name, lat, lon] of cities) {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await res.json();
        const t = data?.current_weather?.temperature ?? "—";
        const div = document.createElement("div");
        div.className = "city";
        div.innerHTML = `<span>${name}:</span> <strong>${t}°C</strong>`;
        weatherBar.appendChild(div);
      } catch {
        const div = document.createElement("div");
        div.className = "city";
        div.textContent = name + ": —";
        weatherBar.appendChild(div);
      }
    }
  }

  loadWeather();

  // =======================
  // TICKER
  // =======================
  const tickerItems = $("#ticker-items");
  if (tickerItems && tickerItems.children.length) {
    tickerItems.innerHTML += tickerItems.innerHTML;
  }

  // =======================
  // CONTACT MODAL
  // =======================
  const dlg = $("#contact-modal");
  $("#open-contact")?.addEventListener("click", () => dlg?.showModal());
  $("#close-contact")?.addEventListener("click", () => dlg?.close());

  // =======================
  // SHARE & STICKY BAR
  // =======================
  function tryShare() {
    if (navigator.share) {
      navigator.share({ title: document.title, url: location.href });
    } else {
      navigator.clipboard?.writeText(location.href);
      alert("Link copied");
    }
  }

  $("#share-btn")?.addEventListener("click", tryShare);
  $("#sticky-share")?.addEventListener("click", tryShare);
  $("#sticky-like")?.addEventListener("click", () => alert("Thanks ❤️"));
  $("#sticky-menu")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $("#sticky-search")?.addEventListener("click", () => $("#search-input")?.focus());

});
