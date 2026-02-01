// JS v2 refresh (FULLY FIXED & STABLE)

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ================= YEAR ================= */
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ================= CLOCKS & CALENDARS ================= */

function formatCEST() {
  const el = $("#clock-cest span");
  if (!el) return;
  const now = new Date();
  const opts = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Europe/Zurich",
  };
  el.textContent = new Intl.DateTimeFormat("en-GB", opts)
    .format(now)
    .replace(",", " —");
}

function formatHijri() {
  const el = $("#cal-hijri span");
  if (!el) return;
  try {
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    el.textContent = fmt.format(new Date()) + " AH";
  } catch {
    el.textContent = "Hijri unavailable";
  }
}

function formatVikramSamvatApprox() {
  const el = $("#cal-hindi span");
  if (!el) return;
  const now = new Date();
  const gYear = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const vsYear = m >= 3 ? gYear + 57 : gYear + 56;
  const months = [
    "Pausha","Magha","Phalguna","Chaitra","Vaisakh","Jyeshtha",
    "Ashadha","Shravana","Bhadrapada","Ashwin","Kartik","Margashirsha"
  ];
  const map = [9,10,11,3,4,5,6,7,8,0,1,2];
  el.textContent = `${months[map[m]]} ${d}, ${vsYear} VS`;
}

function updateTimes() {
  formatCEST();
  formatHijri();
  formatVikramSamvatApprox();

  const now = new Date();
  const fmt = tz =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: tz,
    }).format(now);

  const ist = $("#tz-ist span");
  const pkt = $("#tz-pkt span");
  if (ist) ist.textContent = fmt("Asia/Kolkata");
  if (pkt) pkt.textContent = fmt("Asia/Karachi");
}

updateTimes();
setInterval(updateTimes, 1000);

/* ================= WEATHER ================= */

const cities = [
  { name: "Zurich", lat: 47.3769, lon: 8.5417 },
  { name: "Jammu", lat: 32.7266, lon: 74.857 },
  { name: "Kashmir", lat: 34.0837, lon: 74.7973 },
  { name: "Ladakh", lat: 34.1526, lon: 77.5771 },
  { name: "Rawalakot", lat: 33.8578, lon: 73.7604 },
  { name: "Gilgit", lat: 35.9208, lon: 74.308 },
  { name: "Baltistan", lat: 35.3025, lon: 75.636 },
  { name: "Muzaffarabad", lat: 34.37, lon: 73.47 },
];

const weatherBar = $("#weather-bar");

function createCityChip(name, text) {
  const el = document.createElement("div");
  el.className = "city";
  el.innerHTML = `<span class="name">${name}:</span> <span class="temp">${text}</span>`;
  return el;
}

async function loadWeather() {
  if (!weatherBar) return;
  weatherBar.innerHTML = "";

  for (const c of cities) {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
      );
      const data = await res.json();
      const t = data?.current_weather?.temperature;
      weatherBar.appendChild(
        createCityChip(c.name, t !== undefined ? `${t}°C` : "— °C")
      );
    } catch {
      weatherBar.appendChild(createCityChip(c.name, "— °C"));
    }
  }
}

loadWeather();

/* ================= IMAGE PLACEHOLDERS ================= */

window.replaceWithPlaceholder = function (imgEl) {
  if (!imgEl || !imgEl.parentElement) return;

  const text = imgEl.dataset?.placeholder || "Image unavailable";
  const accent = imgEl.dataset?.accent || "";

  const wrap = document.createElement("div");
  wrap.className = "media-placeholder" + (accent ? " accent-" + accent : "");

  const inner = document.createElement("div");
  inner.className = "media-placeholder-inner";
  inner.textContent = text;

  wrap.appendChild(inner);
  imgEl.replaceWith(wrap);
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      if (img.dataset?.placeholder) {
        replaceWithPlaceholder(img);
      } else {
        img.style.display = "none";
      }
    });
  });
});

/* ================= SHARE ================= */

function tryShare() {
  if (navigator.share) {
    navigator.share({ title: document.title, url: location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(location.href);
    alert("Link copied to clipboard.");
  }
}

$("#share-btn")?.addEventListener("click", tryShare);
$("#sticky-share")?.addEventListener("click", tryShare);
/* ================= NAVIGATION DROPDOWNS ================= */

function closeAllDropdowns(except = null) {
  document.querySelectorAll(".nav-item.open").forEach(item => {
    if (item !== except) item.classList.remove("open");
  });
}

// Desktop dropdowns
document.querySelectorAll(".nav-item.has-sub > .nav-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();

    const item = btn.closest(".nav-item");
    const isOpen = item.classList.contains("open");

    closeAllDropdowns(item);

    if (!isOpen) {
      item.classList.add("open");
    } else {
      item.classList.remove("open");
    }
  });
});

// Close dropdowns when clicking outside
document.addEventListener("click", () => {
  closeAllDropdowns();
});

// Keyboard accessibility
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeAllDropdowns();
  }
});
