/* =========================
Rio Ascension — script.js
All comments in English
========================= */

/* --------- DOM selectors --------- */
const playBtn = document.getElementById("play-btn");
const rioEl = document.getElementById("rio-count");
const cpsEl = document.getElementById("cps-count");
const steps = Array.from(document.querySelectorAll(".step"));

/* --------- Game state --------- */
// Base state: Rio currency and CPS (Chakra Per Second)
let rio = 0;
let cps = 0;

// Costs mapped from timeline steps (read from data-cost in HTML)
const ranks = steps.map((step) => ({
el: step,
name: step.textContent.trim(),
cost: Number(step.dataset.cost || "0"),
unlocked: false,
}));

/* --------- Persistence (localStorage) --------- */
const SAVE_KEY = "rioAscension_save_v1";

function save() {
const data = {
rio,
cps,
unlocked: ranks.map((r) => r.unlocked),
};
localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function load() {
const raw = localStorage.getItem(SAVE_KEY);
if (!raw) return;
try {
const data = JSON.parse(raw);
rio = Number(data.rio) || 0;
cps = Number(data.cps) || 0;
// Restore unlocked ranks
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
// Show Rio as compact number (e.g., 12,345)
rioEl.textContent = rio.toLocaleString("fr-FR");
cpsEl.textContent = cps.toLocaleString("fr-FR");
}

/* --------- Progression logic --------- */
// Try to unlock ranks in order if player has enough Rio
function tryUnlockRanks() {
ranks.forEach((r) => {
if (!r.unlocked && rio >= r.cost) {
r.unlocked = true;
r.el.classList.add("active");
// Reward CPS on unlock (example scaling)
cps += calcCPSReward(r.cost);
}
});
}

// CPS reward scaling based on rank cost (simple curve)
function calcCPSReward(cost) {
// Example: 1% of cost divided by 1000, rounded
// Genin(10k) => +100 CPS; Chunin(25k) => +250 CPS; etc.
return Math.round((cost * 0.01) / 1_000);
}

/* --------- Click to earn --------- */
// Each click grants instant Rio and attempts unlocks
playBtn.addEventListener("click", () => {
// Base click gain (you can tune this)
const gain = 500;
rio += gain;
tryUnlockRanks();
renderHUD();
save();
});

/* --------- Passive CPS tick --------- */
// Adds CPS to Rio every second
setInterval(() => {
if (cps > 0) {
rio += cps;
tryUnlockRanks();
renderHUD();
save();
}
}, 1000);

/* --------- Scroll reveal (fade-in) --------- */
function onScrollReveal() {
document.querySelectorAll(".fade-in").forEach((el) => {
const rect = el.getBoundingClientRect();
if (rect.top < window.innerHeight - 100) {
el.style.opacity = 1;
el.style.transform = "translateY(0)";
el.style.transition = "all 0.8s ease";
}
});
}
document.addEventListener("scroll", onScrollReveal);

/* --------- Utilities --------- */
// Optional: format big numbers (K, M) if you prefer compact HUD
function formatCompact(n) {
if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
return String(n);
}

/* --------- Init --------- */
(function init() {
// Prepare initial fade-in state
document.querySelectorAll(".fade-in").forEach((el) => {
el.style.opacity = 0;
el.style.transform = "translateY(50px)";
});

// Load save and render
load();
renderHUD();
onScrollReveal();

// Ensure step backgrounds reflect initial unlocked state
tryUnlockRanks();
})();