let timer = null;
let currentWorkout = null;
let audioCtx = null;
let audioUnlocked = false;

/* ================= AUDIO ================= */

function unlockAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  audioUnlocked = true;
}

function enableSound() {
  unlockAudio();
  document.getElementById("soundBtn").style.display = "none";
}

function beep(freq = 1000, dur = 0.15) {
  if (!audioUnlocked) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  o.frequency.value = freq;
  g.gain.value = 0.3;
  o.start();
  o.stop(audioCtx.currentTime + dur);
}

/* ================= TIMER HELPERS ================= */

function updateDisplay(sec) {
  document.getElementById("time").textContent =
    `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;
}

function setPhase(text, cls) {
  const p = document.getElementById("phaseLabel");
  p.textContent = text;
  p.className = cls;
}

function clearPhase() {
  document.getElementById("phaseLabel").textContent = "";
}

function setProgress(t) {
  document.getElementById("progressLabel").textContent = t;
}

function clearProgress() {
  document.getElementById("progressLabel").textContent = "";
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
  clearPhase();
  clearProgress();
  updateDisplay(0);
}

/* ================= HIIT TIMERS ================= */

function startTabata() {
  unlockAudio();
  stopTimer();
  let round = 1, phase = "work", time = 20;

  setPhase("WORK","work");
  setProgress(`Round ${round}/8`);
  updateDisplay(time);
  beep();

  timer = setInterval(() => {
    time--;
    updateDisplay(time);
    if (time <= 0) {
      beep();
      if (phase === "work") {
        phase = "rest";
        time = 10;
        setPhase("REST","rest");
      } else {
        round++;
        if (round > 8) { stopTimer(); return; }
        phase = "work";
        time = 20;
        setPhase("WORK","work");
        setProgress(`Round ${round}/8`);
      }
    }
  }, 1000);
}

function startHIIT3030() {
  unlockAudio();
  stopTimer();
  let round = 1, phase = "work", time = 30;

  setPhase("WORK","work");
  setProgress(`Round ${round}/10`);
  updateDisplay(time);
  beep();

  timer = setInterval(() => {
    time--;
    updateDisplay(time);
    if (time <= 0) {
      beep();
      if (phase === "work") {
        phase = "rest";
        time = 30;
        setPhase("REST","rest");
      } else {
        round++;
        if (round > 10) { stopTimer(); return; }
        phase = "work";
        time = 30;
        setPhase("WORK","work");
        setProgress(`Round ${round}/10`);
      }
    }
  }, 1000);
}

function startEMOM() {
  unlockAudio();
  stopTimer();
  let minute = 1, time = 60;

  setPhase("EMOM","work");
  setProgress(`Minute ${minute}/10`);
  updateDisplay(time);
  beep();

  timer = setInterval(() => {
    time--;
    updateDisplay(time);
    if (time <= 0) {
      beep();
      minute++;
      if (minute > 10) { stopTimer(); return; }
      time = 60;
      setProgress(`Minute ${minute}/10`);
    }
  }, 1000);
}

/* ================= WORKOUT DATA ================= */

const workouts = {
  A: [
    { section: "Warm-Up" },
    { name: "Jump Rope", sets: "2", reps: "1 min" },
    { name: "World’s Greatest Stretch", sets: "2", reps: "5/side" },

    { section: "Main Lifts" },
    { name: "Back Squat", sets: "4", reps: "5", rest: "2–3 min" },
    { name: "Bench Press", sets: "4", reps: "6", rest: "2 min" },
    { name: "Bent Over Row", sets: "3", reps: "8", rest: "90 sec" },

    { section: "Finisher" },
    { name: "Kettlebell Swings", sets: "3", reps: "20" },

    { section: "Cooldown" },
    { name: "Hamstring Stretch", sets: "2", reps: "30 sec" }
  ],

  B: [
    { section: "Main Lifts" },
    { name: "Deadlift", sets: "4", reps: "3–5", rest: "3 min" },
    { name: "Overhead Press", sets: "4", reps: "6" },
    { name: "Pull-Ups", sets: "3", reps: "AMRAP" },

    { section: "Cooldown" },
    { name: "Couch Stretch", sets: "2", reps: "45 sec/side" }
  ],

  C: [
    { section: "Main Lifts" },
    { name: "Front Squat", sets: "4", reps: "6" },
    { name: "Romanian Deadlift", sets: "3", reps: "8" },
    { name: "Push-Ups", sets: "3", reps: "AMRAP" },

    { section: "Cooldown" },
    { name: "90/90 Hip Mobility", sets: "2", reps: "60 sec" }
  ],

  HIIT: [
    { section: "HIIT Options" },
    { name: "Tabata (20/10 x 8)", action: startTabata },
    { name: "HIIT 30/30 x 10", action: startHIIT3030 },
    { name: "EMOM x 10", action: startEMOM }
  ],

  MOBILITY: [
    { section: "Mobility Flow" },
    { name: "World’s Greatest Stretch", sets: "2", reps: "5/side" },
    { name: "Thoracic Rotation", sets: "2", reps: "8/side" },
    { name: "Breathing Reset", sets: "3", reps: "60 sec" }
  ]
};

/* ================= VIDEO MAP ================= */

const videoMap = {
  "Jump Rope": "https://www.youtube.com/watch?v=1BZM8k1mH8Y",
  "World’s Greatest Stretch": "https://www.youtube.com/watch?v=Fsa_CjlT6IY",
  "Back Squat": "https://www.youtube.com/watch?v=SW_C1A-rejs",
  "Bench Press": "https://www.youtube.com/watch?v=rT7DgCr-3pg",
  "Bent Over Row": "https://www.youtube.com/watch?v=FWJR5Ve8bnQ",
  "Kettlebell Swings": "https://www.youtube.com/watch?v=YSxHifyI6s8",
  "Hamstring Stretch": "https://www.youtube.com/watch?v=Z7ZKzj9gJpU",
  "Deadlift": "https://www.youtube.com/watch?v=op9kVnSso6Q",
  "Overhead Press": "https://www.youtube.com/watch?v=2yjwXTZQDDI",
  "Pull-Ups": "https://www.youtube.com/watch?v=eGo4IYlbE5g",
  "Couch Stretch": "https://www.youtube.com/watch?v=GvZp3D7xvGk",
  "Front Squat": "https://www.youtube.com/watch?v=v-mQm_droHg",
  "Romanian Deadlift": "https://www.youtube.com/watch?v=2SHsk9AzdjA",
  "Push-Ups": "https://www.youtube.com/watch?v=IODxDxX7oi4",
  "90/90 Hip Mobility": "https://www.youtube.com/watch?v=2uYJZfB3k_U",
  "Thoracic Rotation": "https://www.youtube.com/watch?v=7vE7n6Lw3tU",
  "Breathing Reset": "https://www.youtube.com/watch?v=8TuRYV71Rgo"
};

/* ================= RENDER WORKOUT ================= */

function loadWorkout(type) {
  currentWorkout = type;
  const ul = document.getElementById("workout");
  ul.innerHTML = "";

  workouts[type].forEach(item => {
    if (item.section) {
      const h = document.createElement("li");
      h.textContent = item.section;
      h.className = "section";
      ul.appendChild(h);
      return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <div style="font-weight:700">${item.name}</div>
      ${item.sets ? `<div>${item.sets} × ${item.reps}</div>` : ""}
      ${item.rest ? `<div style="opacity:.6">Rest: ${item.rest}</div>` : ""}
    `;

    if (item.action) li.onclick = item.action;
    ul.appendChild(li);
  });
}

/* ================= LOGGING ================= */

function logWorkout() {
  if (!currentWorkout) return alert("Start a workout first");
  const log = JSON.parse(localStorage.getItem("log")) || [];
  log.push({ workout: currentWorkout, date: new Date().toLocaleString() });
  localStorage.setItem("log", JSON.stringify(log));
  updateLastWorkout();
}

function updateLastWorkout() {
  const log = JSON.parse(localStorage.getItem("log")) || [];
  if (!log.length) return;
  const last = log[log.length - 1];
  document.getElementById("lastWorkout").textContent =
    `Last workout: ${last.workout} (${last.date})`;
}
updateLastWorkout();

/* ================= LIBRARY ================= */

function openLibrary() {
  const list = document.getElementById("libraryList");
  list.innerHTML = "";
  const exercises = new Set();

  Object.values(workouts).forEach(day =>
    day.forEach(item => item.name && exercises.add(item.name))
  );

  [...exercises].sort().forEach(name => {
    const li = document.createElement("li");
    li.innerHTML = videoMap[name]
      ? `<a href="${videoMap[name]}" target="_blank">${name}</a>`
      : `<span style="opacity:.5">${name} (video coming)</span>`;
    list.appendChild(li);
  });

  document.getElementById("libraryModal").style.display = "block";
}

function closeLibrary() {
  document.getElementById("libraryModal").style.display = "none";
}
