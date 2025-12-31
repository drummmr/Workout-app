let timer = null;
let currentWorkout = null;

/* ===================== WORKOUT DATA ===================== */
const workouts = {
  A: [
    { section: "Day A – Squat + Push (35 min)" },

    { section: "Warm-Up (8–10 min)" },
    { name: "Jump Rope", sets: "2", reps: "1 min" },
    { name: "Glute Bridge", sets: "2", reps: "15" },
    { name: "World’s Greatest Stretch", sets: "2", reps: "5/side" },

    { section: "Strength Superset (15 min)" },
    { name: "Barbell Back Squat", sets: "4", reps: "5" },
    { name: "Push-Ups or Bench Press", sets: "4", reps: "6–10", note: "Alternate movements" },

    { section: "Kettlebell Volume (10 min)" },
    { name: "Goblet Squat", sets: "3", reps: "12" },
    { name: "Single-Arm KB Overhead Press", sets: "3", reps: "8/side" },

    { section: "Finisher (5–7 min)" },
    { name: "KB Swings + Burpees", reps: "10 swings / 10 burpees", note: "Repeat continuously" },

    { section: "Cooldown (5–7 min)" },
    { name: "Hamstring Stretch", sets: "2", reps: "30 sec" },
    { name: "Couch Stretch", sets: "2", reps: "45 sec/side" },
    { name: "Breathing Reset", sets: "2", reps: "60 sec" }
  ],

  B: [
    { section: "Day B – Hinge + Pull (35 min)" },

    { section: "Warm-Up (8–10 min)" },
    { name: "Jump Rope", sets: "2", reps: "1 min" },
    { name: "Glute Bridge", sets: "2", reps: "15" },
    { name: "World’s Greatest Stretch", sets: "2", reps: "5/side" },

    { section: "Strength Superset (15 min)" },
    { name: "Deadlift", sets: "4", reps: "4–5" },
    { name: "Pull-Ups or Lat Pulldown", sets: "4", reps: "6–10" },

    { section: "Kettlebell Volume (10 min)" },
    { name: "KB Romanian Deadlift", sets: "3", reps: "12" },
    { name: "Single-Arm KB Row", sets: "3", reps: "10/side" },

    { section: "Finisher (5–7 min)" },
    { name: "KB Swings + Goblet Squats", reps: "20 swings / 15 squats", note: "2–3 fast rounds" },

    { section: "Cooldown (5–7 min)" },
    { name: "Hamstring Stretch", sets: "2", reps: "30 sec" },
    { name: "Couch Stretch", sets: "2", reps: "45 sec/side" },
    { name: "Breathing Reset", sets: "2", reps: "60 sec" }
  ],

  C: [
    { section: "Day C – Full-Body Conditioning (30–40 min)" },

    { section: "Warm-Up (8–10 min)" },
    { name: "Jump Rope", sets: "2", reps: "1 min" },
    { name: "Glute Bridge", sets: "2", reps: "15" },
    { name: "World’s Greatest Stretch", sets: "2", reps: "5/side" },

    { section: "Power & Strength (15 min)" },
    { name: "Clean & Press (Barbell or KB)", sets: "5", reps: "3" },
    { name: "Front Squat or Double KB Squat", sets: "4", reps: "6" },

    { section: "Conditioning Circuit (10–15 min)" },
    { name: "KB Swings", reps: "10" },
    { name: "Reverse Lunges", reps: "8/leg" },
    { name: "Plank", reps: "30 sec", note: "AMRAP" },

    { section: "Cooldown (5–7 min)" },
    { name: "Hamstring Stretch", sets: "2", reps: "30 sec" },
    { name: "Couch Stretch", sets: "2", reps: "45 sec/side" },
    { name: "Breathing Reset", sets: "2", reps: "60 sec" }
  ],

  HIIT: [
    { section: "HIIT Options" },
    { name: "Tabata 20/10 x8", action: startTabata },
    { name: "HIIT 30/30 x10", action: startHIIT3030 },
    { name: "EMOM x10", action: startEMOM }
  ],

  MOBILITY: [
    { section: "Full Mobility Session" },
    { name: "World’s Greatest Stretch", reps: "5/side" },
    { name: "90/90 Hip Mobility", reps: "60 sec" },
    { name: "Thoracic Rotation", reps: "8/side" },
    { name: "Couch Stretch", reps: "60 sec/side" },
    { name: "Breathing Reset", reps: "60 sec" }
  ]
};

/* ===================== RENDER ===================== */
function loadWorkout(type) {
  currentWorkout = type;
  const ul = document.getElementById("workout");
  ul.innerHTML = "";

  workouts[type].forEach(item => {
    if (item.section) {
      const li = document.createElement("li");
      li.textContent = item.section;
      li.className = "section";
      ul.appendChild(li);
      return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.name}</strong>
      ${item.sets ? `<div>${item.sets} × ${item.reps}</div>` : ""}
      ${!item.sets && item.reps ? `<div>${item.reps}</div>` : ""}
      ${item.note ? `<div style="opacity:.6">${item.note}</div>` : ""}
    `;
    if (item.action) li.onclick = item.action;
    ul.appendChild(li);
  });
}

/* ===================== LOGGING ===================== */
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

/* ===================== LIBRARY ===================== */
function openLibrary() {
  const list = document.getElementById("libraryList");
  list.innerHTML = "";
  const set = new Set();

  Object.values(workouts).forEach(day =>
    day.forEach(item => item.name && set.add(item.name))
  );

  [...set].sort().forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });

  document.getElementById("libraryModal").style.display = "block";
}

function closeLibrary() {
  document.getElementById("libraryModal").style.display = "none";
}

/* ===================== TIMER PLACEHOLDERS ===================== */
function startTabata(){}
function startHIIT3030(){}
function startEMOM(){}
