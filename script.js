// JS v2 refresh
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

// ================= CLOCKS & CALENDARS =================
function formatCEST() {
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
    timeZone: "Europe/Zurich"
  };
  const el = $("#clock-cest span");
  if (el) el.textContent = new Intl.DateTimeFormat("en-GB", opts).format(now).replace(",", " —");
}

function formatHijri() {
  const el = $("#cal-hijri span");
  if (!el) return;
  try {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    el.textContent = fmt.format(now) + " AH";
  } catch {
    el.textContent = "Hijri not supported";
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
      timeZone: tz
    }).format(now);

  const ist = $("#tz-ist span");
  const pkt = $("#tz-pkt span");
  if (ist) ist.textContent = fmt("Asia/Kolkata");
  if (pkt) pkt.textContent = fmt("Asia/Karachi");
}

// ================= NAVIGATION =================
function initNavigation() {
  $$(".nav-item.has-sub > .nav-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const li = e.currentTarget.closest(".nav-item");
      const open = li.classList.contains("open");
      $$(".nav-item.open").forEach(n => n.classList.remove("open"));
      if (!open) li.classList.add("open");
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".navbar")) {
      $$(".nav-item.open").forEach(n => n.classList.remove("open"));
    }
  });

  const hamburger = $("#hamburger");
  const mobileMenu = $("#mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));

      if (!expanded) {
        mobileMenu.innerHTML = "";
        const clone = $("#nav-list").cloneNode(true);
        clone.id = "nav-list-mobile";
        clone.querySelectorAll(".nav-item.has-sub > .nav-btn").forEach(b => {
          const a = document.createElement("a");
          a.textContent = b.textContent;
          a.className = "nav-btn";
          a.href = "#";
          b.replaceWith(a);
        });
        mobileMenu.appendChild(clone);
        mobileMenu.hidden = false;
      } else {
        mobileMenu.hidden = true;
      }
    });
  }
}

// ================= WEATHER =================
const cities = [
  { name:"Zurich", lat:47.3769, lon:8.5417 },
  { name:"Jammu", lat:32.7266, lon:74.8570 },
  { name:"Kashmir", lat:34.0837, lon:74.7973 },
  { name:"Ladakh", lat:34.1526, lon:77.5771 },
  { name:"Gilgit", lat:35.9208, lon:74.3080 },
  { name:"Baltistan", lat:35.3025, lon:75.6360 },
  { name:"Muzaffarabad", lat:34.37, lon:73.47 },
  { name:"Rawalakot", lat:33.8578, lon:73.7604 }
];

const codeToIcon = c => {
  if ([0].includes(c)) return "☀️";
  if ([1,2,3].includes(c)) return "⛅";
  if ([45,48].includes(c)) return "🌫️";
  if ([61,63,65,80,81,82].includes(c)) return "🌧️";
  if ([71,73,75,85,86].includes(c)) return "🌨️";
  if ([95,96,99].includes(c)) return "⛈️";
  return "🌡️";
};

async function loadWeather() {
  const bar = $("#weather-bar");
  if (!bar) return;
  bar.textContent = "";

  for (const c of cities) {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code`);
      const data = await res.json();
      const t = data.current?.temperature_2m ?? "—";
      const icon = codeToIcon(data.current?.weather_code);
      const el = document.createElement("div");
      el.className = "city";
      el.innerHTML = `<span class="name">${c.name}:</span> <span class="temp">${t}°C ${icon}</span>`;
      bar.appendChild(el);
    } catch {
      const el = document.createElement("div");
      el.className = "city";
      el.textContent = `${c.name}: — °C`;
      bar.appendChild(el);
    }
  }
}

// ================= SEARCH =================
function fakeSearch(){
  const input = $("#search-input");
  if (!input) return;
  const q = input.value.trim();
  if (q) alert(`Search for: ${q}`);
}

// ================= MODALS & FOOTER =================
function initFooterAndModal() {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const dlg = $("#contact-modal");
  const openBtn = $("#open-contact");
  const closeBtn = $("#close-contact");

  if (dlg && openBtn) openBtn.addEventListener("click", () => dlg.showModal());
  if (dlg && closeBtn) closeBtn.addEventListener("click", () => dlg.close());
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  updateTimes();
  setInterval(updateTimes, 1000);

  initNavigation();
  loadWeather();
  initFooterAndModal();
});
