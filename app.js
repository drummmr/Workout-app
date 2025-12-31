let currentTime = 0;
let totalTime = 0;
let timer = null;
let activeElement = null;
let intervalConfig = null;
let nextBeepAt = null;

/* =====================
   AUDIO
===================== */

const beepCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(freq = 1000, duration = 0.12) {
  const osc = beepCtx.createOscillator();
  const gain = beepCtx.createGain();
  osc.connect(gain);
  gain.connect(beepCtx.destination);
  osc.frequency.value = freq;
  osc.start();
  osc.stop(beepCtx.currentTime + duration);
}

/* =====================
   INTERVAL PRESETS
===================== */

const intervalPresets = {
  intervals30: { pattern: [30, 30] },   // HIIT
  tabata: { pattern: [20, 10] },        // Tabata
  emom: { pattern: [60] }               // EMOM
};

/* =====================
   COOLDOWNS (UNCHANGED)
===================== */

const cooldownStrength = [
  { name: "Easy Walk / Spin", time: 120 },
  { name: "Couch Stretch", time: 60 },
  { name: "Hamstring Stretch", time: 60 },
  { name: "Chest / Shoulder Opener", time: 60 },
  { name: "Supine Nasal Breathing", time: 120 }
];

const cooldownHIIT = [
  { name: "Slow Walk / Easy Spin", time: 180 },
  { name: "Standing Quad Stretch", time: 60 },
  { name: "Hip Flexor Stretch", time: 60 },
  { name: "Deep Nasal Breathing", time: 120 }
];

const cooldownLow = [
  { name: "Easy Walk", time: 120 },
  { name: "Calf Stretch", time: 60 },
  { name: "Nasal Breathing", time: 120 }
];

const cooldownMobility = [
  { name: "Supine Breathing Reset", time: 180 }
];

/* =====================
   WORKOUT DATA
===================== */

const workouts = {
  HIIT: {
    sections: [
      {
        title: "HIIT Option 1 – Intervals (30/30)",
        items: [
          { name: "30s Hard / 30s Easy × 10", time: 600, preset: "intervals30" }
        ]
      },
      {
        title: "HIIT Option 2 – Tabata",
        items: [
          { name: "20s On / 10s Off × 8 (2–3 Rounds)", time: 480, preset: "tabata" }
        ]
      },
      {
        title: "HIIT Option 3 – EMOM",
        items: [
          { name: "EMOM 12–15 min", time: 900, preset: "emom" }
        ]
      },
      { title: "Cool Down", items: cooldownHIIT }
    ]
  }
};

/* =====================
   LOAD WORKOUT
===================== */

function loadWorkout(key) {
  const ul = document.getElementById("workout");
  ul.innerHTML = "";
  activeElement = null;

  workouts[key].sections.forEach(section => {
    const header = document.createElement("li");
    header.innerHTML = `<strong>${section.title}</strong>`;
    ul.appendChild(header);

    section.items.forEach(ex => {
      const li = document.createElement("li");
      li.innerHTML = `${ex.name}<br>⏱ ${ex.time}s`;

      li.onclick = () => setTimer(ex.time, ex.preset || null, li);
      ul.appendChild(li);
    });
  });
}

/* =====================
   TIMER SETUP
===================== */

function setTimer(seconds, presetKey, element) {
  pauseTimer();

  currentTime = seconds;
  totalTime = seconds;
  updateTimer();

  intervalConfig = presetKey ? intervalPresets[presetKey] : null;
  nextBeepAt = intervalConfig ? totalTime - intervalConfig.pattern[0] : null;

  if (activeElement) activeElement.classList.remove("active");
  activeElement = element;
  if (activeElement) activeElement.classList.add("active");
}

/* =====================
   TIMER LOOP
===================== */

function startTimer() {
  if (timer) return;

  let patternIndex = 0;
  let segmentRemaining = intervalConfig ? intervalConfig.pattern[0] : null;

  timer = setInterval(() => {
    if (currentTime <= 0) {
      playBeep(400, 0.4); // end beep
      pauseTimer();
      return;
    }

    currentTime--;
    updateTimer();

    if (intervalConfig) {
      segmentRemaining--;

      if (segmentRemaining === 0) {
        playBeep(1200, 0.12); // interval change

        patternIndex = (patternIndex + 1) % intervalConfig.pattern.length;
        segmentRemaining = intervalConfig.pattern[patternIndex];
      }
    }
  }, 1000);
}

/* =====================
   CONTROLS
===================== */

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  pauseTimer();
  updateTimer();
}

function updateTimer() {
  const m = Math.floor(currentTime / 60);
  const s = currentTime % 60;
  document.getElementById("time").textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}
