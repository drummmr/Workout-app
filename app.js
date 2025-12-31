/**********************
 STATE
**********************/
let timer = null;
let soundEnabled = false;
let audioCtx = null;
let currentWorkout = null;

/**********************
 AUDIO
**********************/
function toggleSound() {
  soundEnabled = !soundEnabled;
  if (soundEnabled && !audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  alert(soundEnabled ? "Sound enabled" : "Sound muted");
}

function beep(freq = 1200, dur = 0.15) {
  if (!soundEnabled || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
  osc.stop(audioCtx.currentTime + dur);
}

/**********************
 TIMER HELPERS
**********************/
function updateTimer(sec) {
  document.getElementById("timer").textContent =
    `${Math.floor(sec / 60).toString().padStart(2, "0")}:${(sec % 60)
      .toString()
      .padStart(2, "0")}`;
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
  document.getElementById("phaseLabel").textContent = "READY";
  document.getElementById("progressFill").style.width = "0%";
  document.querySelectorAll(".exercise").forEach(e => e.classList.remove("active"));
}

/**********************
 HIIT TIMERS (BUTTON-WIRED)
**********************/
function startHIIT3030(btn) {
  stopTimer();
  highlight(btn);

  let phase = "WORK";
  let time = 30;
  let rounds = 10;
  let max = 30;

  document.getElementById("phaseLabel").textContent = phase;
  updateTimer(time);
  beep();

  timer = setInterval(() => {
    time--;
    updateTimer(time);
    document.getElementById("progressFill").style.width =
      `${((max - time) / max) * 100}%`;

    if (time === 0) {
      beep();
      if (phase === "WORK") {
        phase = "REST";
        time = 30;
      } else {
        rounds--;
        if (rounds === 0) {
          beep(400, 0.5);
          stopTimer();
          return;
        }
        phase = "WORK";
        time = 30;
      }
      max = time;
      document.getElementById("phaseLabel").textContent = phase;
    }
  }, 1000);
}

/**********************
 WORKOUT LOGGING
**********************/
function logWorkout() {
  if (!currentWorkout) return;
  const log = JSON.parse(localStorage.getItem("workoutLog") || "[]");
  log.push({ workout: currentWorkout, date: new Date().toISOString() });
  localStorage.setItem("workoutLog", JSON.stringify(log));
  document.getElementById("logStatus").textContent =
    `Logged ${currentWorkout} on ${new Date().toLocaleDateString()}`;
}

/**********************
 WORKOUT DATA (UNCHANGED)
**********************/
const workouts = {
  A: [
    { section: "Warm-Up" },
    { name: "World’s Greatest Stretch", reps: "5/side" },
    { name: "Glute Bridge", reps: "15" },
    { name: "Push-Ups", reps: "10" },
    { section: "Strength Superset" },
    { note: "Alternate movements" },
    { name: "Barbell Back Squat", sets: 4, reps: "5" },
    { name: "Push-Ups or Bench Press", sets: 4, reps: "6–10" },
    { section: "Kettlebell Volume" },
    { name: "Goblet Squat", sets: 3, reps: "12" },
    { name: "Single-Arm KB Overhead Press", sets: 3, reps: "8/side" },
    { section: "Finisher" },
    { note: "Repeat continuously" },
    { name: "Kettlebell Swings", reps: "10" },
    { name: "Burpees", reps: "10" },
    { section: "Cooldown" },
    { name: "Couch Stretch", reps: "1 min/side" },
    { name: "Breathing Reset", reps: "2 min" }
  ],

  HIIT: [
    { section: "HIIT Option 1 – 30/30" },
    { name: "Start 30/30 Timer", action: startHIIT3030 }
  ]
};

/**********************
 RENDER
**********************/
function loadWorkout(type) {
  stopTimer();
  currentWorkout = type;

  const ul = document.getElementById("workout");
  ul.innerHTML = "";

  workouts[type].forEach(item => {
    if (item.section) {
      const li = document.createElement("li");
      li.className = "section";
      li.textContent = item.section;
      ul.appendChild(li);
      return;
    }

    if (item.note) {
      const li = document.createElement("li");
      li.className = "block";
      li.innerHTML = `<div class="blockNote">${item.note}</div>`;
      ul.appendChild(li);
      return;
    }

    const li = document.createElement("li");
    li.className = "exercise";

    if (item.action) {
      const btn = document.createElement("button");
      btn.textContent = item.name;
      btn.onclick = () => item.action(btn);
      li.appendChild(btn);
    } else {
      li.innerHTML = `<strong>${item.name}</strong><div>${item.sets ? `${item.sets} × ${item.reps}` : item.reps}</div>`;
    }

    ul.appendChild(li);
  });
}

/**********************
 LIBRARY (FULL COVERAGE)
**********************/
const videoMap = {
  "World’s Greatest Stretch": "https://youtu.be/Fsa_CjlT6IY",
  "Glute Bridge": "https://youtu.be/m2Zx-57cSok",
  "Push-Ups": "https://youtu.be/IODxDxX7oi4",
  "Barbell Back Squat": "https://youtu.be/SW_C1A-rejs",
  "Bench Press": "https://youtu.be/rT7DgCr-3pg",
  "Goblet Squat": "https://youtu.be/6xwGFn-J_QA",
  "Single-Arm KB Overhead Press": "https://youtu.be/spkG8z6p0oQ",
  "Kettlebell Swings": "https://youtu.be/YSxHifyI6s8",
  "Burpees": "https://youtu.be/TU8QYVW0gDU",
  "Couch Stretch": "https://youtu.be/GvZp3D7xvGk",
  "Breathing Reset": "https://youtu.be/8TuRYV71Rgo"
};

function openLibrary() {
  const list = document.getElementById("libraryList");
  list.innerHTML = "";

  Object.entries(videoMap).forEach(([name, url]) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${url}" target="_blank">${name}</a>`;
    list.appendChild(li);
  });

  document.getElementById("libraryModal").style.display = "block";
}

function closeLibrary() {
  document.getElementById("libraryModal").style.display = "none";
}

function highlight(el) {
  document.querySelectorAll(".exercise").forEach(e => e.classList.remove("active"));
  el.closest(".exercise").classList.add("active");
}
