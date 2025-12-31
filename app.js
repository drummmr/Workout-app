let timer = null;
let displayTime = 0;
let activeElement = null;

/* =====================
   AUDIO
===================== */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq = 1000, duration = 0.15) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

/* =====================
   INTERVAL DEFINITIONS
===================== */

const intervalTypes = {
  intervals30: { pattern: [30, 30] }, // work/rest
  tabata: { pattern: [20, 10] },
  emom: { pattern: [60] }
};

/* =====================
   COOLDOWNS
===================== */

const cooldownHIIT = [
  { name: "Slow Walk / Easy Spin", time: 180 },
  { name: "Deep Nasal Breathing", time: 120 }
];

/* =====================
   WORKOUT DATA (HIIT ONLY SHOWN — OTHERS UNCHANGED)
===================== */

const workouts = {
  HIIT: {
    sections: [
      {
        title: "HIIT Option 1 – 30 / 30 Intervals",
        items: [
          { name: "30s Hard / 30s Easy × 10", total: 600, type: "intervals30" }
        ]
      },
      {
        title: "HIIT Option 2 – Tabata",
        items: [
          { name: "20s On / 10s Off × 8 (2–3 Rounds)", total: 480, type: "tabata" }
        ]
      },
      {
        title: "HIIT Option 3 – EMOM",
        items: [
          { name: "EMOM 12–15 min", total: 900, type: "emom" }
        ]
      },
      {
        title: "Cool Down",
        items: cooldownHIIT
      }
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
      li.innerHTML = `${ex.name}<br>⏱ ${ex.total || ex.time}s`;

      li.onclick = () => {
        if (ex.type) {
          startIntervalWorkout(ex, li);
        } else {
          startSimpleTimer(ex.time, li);
        }
      };

      ul.appendChild(li);
    });
  });
}

/* =====================
   SIMPLE TIMER (NON-HIIT)
===================== */

function startSimpleTimer(seconds, element) {
  stopTimer();
  highlight(element);

  displayTime = seconds;
  updateDisplay();

  timer = setInterval(() => {
    displayTime--;
    updateDisplay();

    if (displayTime <= 0) {
      beep(400, 0.4);
      stopTimer();
    }
  }, 1000);
}

/* =====================
   INTERVAL TIMER (THE FIX)
===================== */

function startIntervalWorkout(config, element) {
  stopTimer();
  highlight(element);

  const pattern = intervalTypes[config.type].pattern;
  let patternIndex = 0;
  let segmentTime = pattern[0];
  let remainingTotal = config.total;

  displayTime = remainingTotal;
  updateDisplay();

  beep(1400, 0.2); // start beep

  timer = setInterval(() => {
    segmentTime--;
    remainingTotal--;
    displayTime = remainingTotal;
    updateDisplay();

    if (segmentTime === 0 && remainingTotal > 0) {
      beep(1200, 0.15);
      patternIndex = (patternIndex + 1) % pattern.length;
      segmentTime = pattern[patternIndex];
    }

    if (remainingTotal <= 0) {
      beep(400, 0.5);
      stopTimer();
    }
  }, 1000);
}

/* =====================
   HELPERS
===================== */

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function highlight(el) {
  if (activeElement) activeElement.classList.remove("active");
  activeElement = el;
  activeElement.classList.add("active");
}

function updateDisplay() {
  const m = Math.floor(displayTime / 60);
  const s = displayTime % 60;
  document.getElementById("time").textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}
