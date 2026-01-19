// JS v2 refresh
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
$("#year").textContent = new Date().getFullYear();

function formatCEST() {
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZone: 'Europe/Zurich' };
  $("#clock-cest span").textContent = new Intl.DateTimeFormat('en-GB', opts).format(now).replace(',', ' —');
}
function formatHijri() {
  try{
    const now = new Date();
    const opts = { day:'numeric', month:'long', year:'numeric', calendar:'islamic' };
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic', opts);
    $("#cal-hijri span").textContent = fmt.format(now) + " AH";
  }catch(e){
    $("#cal-hijri span").textContent = "Hijri calendar not supported";
  }
}
function formatVikramSamvatApprox(){
  const now = new Date();
  const gYear = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const vsYear = (m >= 3) ? gYear + 57 : gYear + 56;
  const months = ["Pausha","Magha","Phalguna","Chaitra","Vaisakh","Jyeshtha","Ashadha","Shravana","Bhadrapada","Ashwin","Kartik","Margashirsha"];
  const map = [9,10,11,3,4,5,6,7,8,0,1,2];
  const vsMonth = months[ map[m] ];
  $("#cal-hindi span").textContent = `${vsMonth} ${d}, ${vsYear} VS`;
}
function updateTimes(){
  formatCEST();
  formatHijri();
  formatVikramSamvatApprox();
  const now = new Date();
  const fmt = (tz) => new Intl.DateTimeFormat('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZone: tz }).format(now);
  $("#tz-ist span").textContent = fmt('Asia/Kolkata');
  $("#tz-pkt span").textContent = fmt('Asia/Karachi');
}
updateTimes();
setInterval(updateTimes, 1000);

// nav
$$(".nav-item.has-sub > .nav-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const li = e.currentTarget.closest(".nav-item");
    const isOpen = li.classList.contains("open");
    $$(".nav-item.open").forEach(n => n.classList.remove("open"));
    if(!isOpen){ li.classList.add("open"); }
  });
});
document.addEventListener("click", (e) => {
  if(!e.target.closest(".navbar")) $$(".nav-item.open").forEach(n => n.classList.remove("open"));
});

const hamburger = $("#hamburger");
const mobileMenu = $("#mobile-menu");
hamburger.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!expanded));
  if(!expanded){
    mobileMenu.innerHTML = "";
    const clone = $("#nav-list").cloneNode(true);
    clone.id = "nav-list-mobile";
    clone.querySelectorAll(".nav-item.has-sub > .nav-btn").forEach(b => {
      const text = b.textContent;
      const a = document.createElement("a");
      a.textContent = text;
      a.className = "nav-btn";
      a.href = "#";
      b.replaceWith(a);
    });
    mobileMenu.appendChild(clone);
    mobileMenu.hidden = false;
  }else{
    mobileMenu.hidden = true;
  }
});

const cities = [
  { key:"zurich", name:"Zurich", lat:47.3769, lon:8.5417 },
  { key:"jammu", name:"Jammu", lat:32.7266, lon:74.8570 },
  { key:"kashmir", name:"Kashmir", lat:34.0837, lon:74.7973 },
  { key:"ladakh", name:"Ladakh", lat:34.1526, lon:77.5771 },
  { key:"gilgit", name:"Gilgit", lat:35.9208, lon:74.3080 },
  { key:"baltistan", name:"Baltistan", lat:35.3025, lon:75.6360 },
  { key:"muzaffarabad", name:"Muzaffarabad", lat:34.37, lon:73.47 },
  { key:"rawalakot", name:"Rawalakot", lat:33.8578, lon:73.7604 }
];
const weatherBar = $("#weather-bar");
const codeToIcon = (code)=>{
  if([0].includes(code)) return "☀️";
  if([1,2,3].includes(code)) return "⛅";
  if([45,48].includes(code)) return "🌫️";
  if([51,53,55,56,57].includes(code)) return "🌦️";
  if([61,63,65,66,67,80,81,82].includes(code)) return "🌧️";
  if([71,73,75,77,85,86].includes(code)) return "🌨️";
  if([95,96,99].includes(code)) return "⛈️";
  return "🌡️";
};
function createCityChip(name, text){
  const el = document.createElement("div");
  el.className = "city";
  el.innerHTML = `<span class="name">${name}:</span> <span class="temp">${text}</span>`;
  return el;
}
async function loadWeather(){
  weatherBar.textContent = "";
  for(const c of cities){
    const urlNew = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code`;
    const urlOld = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`;
    try{
      let res = await fetch(urlNew);
      if(!res.ok) throw new Error("new API failed");
      let data = await res.json();
      let t = data?.current?.temperature_2m ?? null;
      let code = data?.current?.weather_code ?? null;
      if(t===null){
        const r2 = await fetch(urlOld);
        const d2 = await r2.json();
        t = d2?.current_weather?.temperature ?? "—";
        code = d2?.current_weather?.weathercode ?? null;
      }
      const icon = codeToIcon(Number(code));
      weatherBar.appendChild(createCityChip(c.name, `${t}°C ${icon}`));
    }catch(e){
      weatherBar.appendChild(createCityChip(c.name, "— °C"));
    }
  }
}
loadWeather();

function setTickerItems(items){
  const ul = $("#ticker-items");
  ul.innerHTML = "";
  items.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t.toUpperCase();
    ul.appendChild(li);
  });
}
function fakeSearch(){
  const q = $("#search-input").value.trim();
  if(!q) return;
  alert(`Search for: ${q}\n(Implement real search or connect to your CMS.)`);
}
const dlg = $("#contact-modal");
$("#open-contact").addEventListener("click", ()=> dlg.showModal());
$("#close-contact").addEventListener("click", ()=> dlg.close());
function tryShare(){
  if(navigator.share){
    navigator.share({ title: document.title, url: location.href }).catch(()=>{});
  }else{
    navigator.clipboard?.writeText(location.href);
    alert("Link copied to clipboard.");
  }
}
$("#share-btn").addEventListener("click", tryShare);
$("#sticky-share").addEventListener("click", tryShare);
$("#sticky-menu").addEventListener("click", ()=> window.scrollTo({top:0, behavior:'smooth'}));
$("#sticky-search").addEventListener("click", ()=> $("#search-input").focus());
$("#sticky-like").addEventListener("click", ()=> alert("Thanks for your support ❤️"));


/* ===== Content loader (JSON-driven) ===== */
async function loadJSON(path) {
  // Support both layouts:
  // 1) /content/*.json (recommended)
  // 2) /*.json at repo root (older GitHub uploads)
  const tryFetch = async (p) => {
    const url = new URL(p, document.baseURI);
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (res.ok) return res;
    return null;
  };

  let res = await tryFetch(path);

  if (!res && path.startsWith("content/")) {
    res = await tryFetch(path.replace(/^content\//, ""));
  }

  if (!res) {
    throw new Error("Failed to load " + path);
  }

  return await res.json();
}

function setText(el, text) {
  if (!el) return;
  el.textContent = text;
}

function renderTicker(items){
  const ul = document.getElementById("ticker-items");
  if(!ul) return;

  // IMPORTANT: do not override HTML ticker if items already exist
  if (ul.children.length > 0) {
    return;
  }

  ul.innerHTML = "";
  (items || []).forEach((t) => {
    const li = document.createElement("li");
    li.textContent = String(t || "");
    ul.appendChild(li);
  });

  if(ul.children.length){
    ul.innerHTML += ul.innerHTML;
  }

  requestAnimationFrame(() => {
    const half = Math.max(ul.scrollWidth / 2, 1);
    ul.style.setProperty("--ticker-distance", `${half}px`);
  });
}


function renderTopVlogs(videos, channelUrl) {
  const vlogSection = document.getElementById("vlog");
  if (!vlogSection || !Array.isArray(videos)) return;

  const sorted = [...videos].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const top3 = sorted.slice(0, 3);

  const cards = vlogSection.querySelectorAll("article.card.video");
  if (!cards.length) return;

  top3.forEach((v, idx) => {
    const card = cards[idx];
    if (!card) return;

    const cat = card.querySelector(".badge.cat");
    const dur = card.querySelector(".badge.duration");
    const title = card.querySelector(".card-body h3");
    const desc = card.querySelector(".card-body p");
    if (cat) cat.textContent = v.category || "Video";
    if (dur) dur.textContent = v.duration || "";
    if (title) title.textContent = v.title || "Video";
    if (desc) desc.textContent = v.description || "";

    const media = card.querySelector(".media");
    if (!media) return;

    const oldImg = media.querySelector("img");
    if (oldImg) oldImg.remove();

    // Avoid duplicate iframes
    let iframe = media.querySelector("iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.loading = "lazy";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "0";
      media.appendChild(iframe);
    }
    const id = (v.youtubeId || "").trim();
    iframe.src = id ? ("https://www.youtube.com/embed/" + encodeURIComponent(id)) : "";
  });

  // Set "Visit Channel" buttons if present
  const btns = vlogSection.querySelectorAll('a[href*="youtube"], a.visit-channel, button.visit-channel');
  btns.forEach((b) => {
    if (b.tagName.toLowerCase() === "a") {
      b.href = channelUrl || b.href;
      b.target = "_blank";
      b.rel = "noopener";
    }
  });

  const visitBtn = document.querySelector('a[href*="themirrorjammukashmir"], a#visitChannel');
  if (visitBtn && channelUrl) {
    visitBtn.href = channelUrl;
    visitBtn.target = "_blank";
    visitBtn.rel = "noopener";
  }
}

async function applyContent() {
  try {
    const [site, articles, vlogs] = await Promise.all([
      loadJSON("content/site.json"),
      loadJSON("content/articles.json"),
      loadJSON("content/vlogs.json"),
    ]);

    // Header text (only if elements exist)
    const titleEl = document.querySelector(".site-title, .masthead h1, header h1");
    if (titleEl && site.siteTitle) titleEl.textContent = site.siteTitle;

    const taglineEl = document.querySelector(".site-tagline, .masthead p, header .tagline");
    if (taglineEl && site.siteTagline) taglineEl.textContent = site.siteTagline;

    renderTicker(site.ticker || []);

    renderTopVlogs((vlogs && vlogs.videos) ? vlogs.videos : [], site.youtubeChannelUrl || "");
  } catch (e) {
    console.warn("Content load skipped:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyContent();

  // Image fallback to avoid broken icons and keep badges aligned.
  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='100%25' height='100%25' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='42' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  document.querySelectorAll("img").forEach((img) => {
    img.loading = img.loading || "lazy";

    const onImgError = () => {
      if (img.dataset && img.dataset.placeholder) {
        window.replaceWithPlaceholder(img);
        return;
      }
      if (img.dataset.fallbackApplied === "1") {
        img.style.display = "none";
        return;
      }
      img.dataset.fallbackApplied = "1";
      img.src = placeholder;
      img.classList.add("img-fallback");
    };

    img.addEventListener("error", onImgError);

    // If the image already failed before the handler was attached, fix it immediately.
    if (img.complete && img.naturalWidth === 0) {
      onImgError();
    }
  });
});

// Replace broken images with branded text placeholders (used on GitHub/Netlify when assets fail)
window.replaceWithPlaceholder = function(imgEl){
  try {
    const text = (imgEl && imgEl.dataset && imgEl.dataset.placeholder) ? imgEl.dataset.placeholder : 'Image unavailable';
    const accent = (imgEl && imgEl.dataset && imgEl.dataset.accent) ? imgEl.dataset.accent : '';

    const placeholder = document.createElement('div');
    placeholder.className = 'media-placeholder' + (accent ? (' accent-' + accent) : '');
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', text);

    const inner = document.createElement('div');
    inner.className = 'media-placeholder-inner';
    inner.textContent = text;

    placeholder.appendChild(inner);

    // Keep the same height as the image area
    const h = imgEl && imgEl.getAttribute('height');
    if (h) placeholder.style.height = h + 'px';

    imgEl.replaceWith(placeholder);
  } catch (e) {
    // If anything goes wrong, just hide the broken image
    if (imgEl) imgEl.style.display = 'none';
  }
};

