/* =========================
Rio Ascension — script.js
Improved version with animations + marketing counter
========================= */

/* --------- DOM selectors --------- */
const playBtn = document.querySelector(".play-btn");
const rioEl = document.getElementById("rio-count");
const cpsEl = document.getElementById("cps-count");
const steps = Array.from(document.querySelectorAll(".step"));

/* --------- Game state --------- */
let rio = 0;
let cps = 0;

const ranks = steps.map((step) => ({
  el: step,
  name: step.textContent.trim(),
  cost: Number(step.dataset.cost || "0"),
  unlocked: false,
}));

/* --------- Persistence --------- */
const SAVE_KEY = "rioAscension_save_v1";

function save() {
  const data = { rio, cps, unlocked: ranks.map((r) => r.unlocked) };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    rio = Number(data.rio) || 0;
    cps = Number(data.cps) || 0;
    if (Array.isArray(data.unlocked)) {
      ranks.forEach((r, i) => {
        r.unlocked = Boolean(data.unlocked[i]);
        if (r.unlocked) r.el.classList.add("active");
      });
    }
    renderHUD();
  } catch (e) {
    console.warn("Load failed:", e);
  }
}

/* --------- HUD rendering --------- */
function renderHUD() {
  rioEl.textContent = formatCompact(rio);
  cpsEl.textContent = formatCompact(cps);
}

/* --------- Progression logic --------- */
function tryUnlockRanks() {
  ranks.forEach((r) => {
    if (!r.unlocked && rio >= r.cost) {
      r.unlocked = true;
      r.el.classList.add("active", "glow");
      setTimeout(() => r.el.classList.remove("glow"), 1200);
      cps += calcCPSReward(r.cost);
    }
  });
}

// Balanced CPS reward scaling
function calcCPSReward(cost) {
  return Math.max(1, Math.round(Math.log10(cost)));
}

/* --------- Click to earn --------- */
playBtn.addEventListener("click", () => {
  const gain = 500;
  rio += gain;
  tryUnlockRanks();
  renderHUD();
  save();
});

/* --------- Passive CPS tick --------- */
setInterval(() => {
  if (cps > 0) {
    rio += cps;
    tryUnlockRanks();
    renderHUD();
    save();
  }
}, 1000);
/* --------- Scroll reveal (IntersectionObserver) --------- */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
          entry.target.style.transition = "all 0.8s ease";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}

/* --------- Marketing dynamic player counter --------- */
(function initPlayerCounter() {
  const playerCountEl = document.getElementById("player-count");
  if (!playerCountEl) return;

  let playerCount =
    parseInt(playerCountEl.textContent.replace(/\s/g, ""), 10) || 1245;

  setInterval(() => {
    const increment = Math.floor(Math.random() * 4); // +0 à +3 joueurs
    playerCount += increment;
    playerCountEl.textContent = playerCount.toLocaleString("fr-FR");
  }, 3000);
})();

/* --------- Utilities --------- */
function formatCompact(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

/* --------- Init --------- */
(function init() {
  // Ensure initial fade-in state
  document.querySelectorAll(".fade-in").forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(50px)";
  });

  load();
  renderHUD();
  initScrollReveal();
  tryUnlockRanks();
})();

