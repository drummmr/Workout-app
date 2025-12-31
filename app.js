let currentTime = 0;
let timer = null;

/* =====================
   COOLDOWN LIBRARIES
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
   WORKOUT DEFINITIONS
===================== */

const workouts = {

  A: {
    sections: [
      {
        title: "Warm-Up",
        items: [
          { name: "Jump Rope / March", time: 60 },
          { name: "World’s Greatest Stretch", time: 45 },
          { name: "KB Halos", time: 30 }
        ]
      },
      {
        title: "Main Lifts",
        items: [
          { name: "Back Squat – 4×5", time: 90 },
          { name: "Bench Press – 4×8", time: 90 }
        ]
      },
      {
        title: "Kettlebell Volume / Finisher",
        items: [
          { name: "KB Goblet Squat – 3×12", time: 60 },
          { name: "KB Push Press – 3×8/side", time: 60 }
        ]
      },
      {
        title: "Cool Down",
        items: cooldownStrength
      }
    ]
  },

  B: {
    sections: [
      {
        title: "Warm-Up",
        items: [
          { name: "Row / Bike Easy", time: 60 },
          { name: "Hip Openers", time: 45 },
          { name: "Glute Bridges", time: 45 }
        ]
      },
      {
        title: "Main Lifts",
        items: [
          { name: "Deadlift – 4×5", time: 120 },
          { name: "Pull-Ups – 4×8", time: 90 }
        ]
      },
      {
        title: "Kettlebell Volume / Finisher",
        items: [
          { name: "KB Swings – 10×15", time: 45 }
        ]
      },
      {
        title: "Cool Down",
        items: cooldownStrength
      }
    ]
  },

  C: {
    sections: [
      {
        title: "Warm-Up",
        items: [
          { name: "Jump Rope / Shadow Box", time: 60 },
          { name: "Thoracic Rotations", time: 45 },
          { name: "KB Halos", time: 30 }
        ]
      },
      {
        title: "Main Lifts",
        items: [
          { name: "Clean & Press – 5×3", time: 90 },
          { name: "Front Squat – 4×6", time: 90 }
        ]
      },
      {
        title: "Kettlebell Volume / Finisher",
        items: [
          { name: "KB Rows – 4×12", time: 60 },
          { name: "KB Lunges – 3×10/side", time: 60 }
        ]
      },
      {
        title: "Cool Down",
        items: cooldownStrength
      }
    ]
  },

  MOB: {
    sections: [
      {
        title: "Mobility Flow",
        items: [
          { name: "Breathing Reset", time: 120 },
          { name: "Cat–Cow", time: 60 },
          { name: "World’s Greatest Stretch", time: 60 },
          { name: "90/90 Hip Rotations", time: 60 },
          { name: "Deep Squat Hold + Pry", time: 90 },
          { name: "Thoracic Rotations", time: 60 },
          { name: "Shoulder CARs", time: 60 }
        ]
      },
      {
        title: "Cool Down",
        items: cooldownMobility
      }
    ]
  },

  /* =====================
     CARDIO – HIIT (3 OPTIONS)
  ===================== */

  HIIT: {
    sections: [
      {
        title: "HIIT Option 1 – Classic Intervals",
        items: [
          { name: "Warm-Up: Easy Cardio", time: 180 },
          { name: "30s Hard / 30s Easy × 10", time: 600 }
        ]
      },
      {
        title: "HIIT Option 2 – Tabata",
        items: [
          { name: "Warm-Up: Dynamic Movement", time: 180 },
          { name: "20s On / 10s Off × 8 (2–3 Rounds)", time: 480 }
        ]
      },
      {
        title: "HIIT Option 3 – EMOM",
        items: [
          { name: "Warm-Up: Light KB + Mobility", time: 180 },
          { name: "EMOM 12–15 min (Swings / Push-Ups / Squats)", time: 900 }
        ]
      },
      {
        title: "Cool Down",
        items: cooldownHIIT
      }
    ]
  },

  /* =====================
     CARDIO – LOW INTENSITY
  ===================== */

  LOW: {
    sections: [
      {
        title: "Low-Intensity Cardio (KISS)",
        items: [
          { name: "Incline Walk / Easy Bike", time: 1200 }
        ]
      },
      {
        title: "Cool Down",
        items: cooldownLow
      }
    ]
  }
};

/* =====================
   APP LOGIC
===================== */

function loadWorkout(key) {
  const ul = document.getElementById("workout");
  ul.innerHTML = "";

  workouts[key].sections.forEach(section => {
    const header = document.createElement("li");
    header.innerHTML = `<strong>${section.title}</strong>`;
    ul.appendChild(header);

    section.items.forEach(ex => {
      const li = document.createElement("li");
      li.innerHTML = `${ex.name}<br>⏱ ${ex.time}s`;
      li.onclick = () => setTimer(ex.time);
      ul.appendChild(li);
    });
  });
}

function setTimer(seconds) {
  currentTime = seconds;
  updateTimer();
}

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      updateTimer();
      if (currentTime === 0) navigator.vibrate?.(300);
    } else pauseTimer();
  }, 1000);
}

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
