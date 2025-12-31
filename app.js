const workouts = {
  A: [
    { section: "Warm-Up (5–7 min)" },
    { name: "World’s Greatest Stretch", reps: "5/side" },
    { name: "Glute Bridge", reps: "15" },
    { name: "Push-Ups", reps: "10" },

    { section: "Strength Superset (15 min)" },
    { note: "Alternate movements" },
    { name: "Barbell Back Squat", sets: 4, reps: "5" },
    { name: "Push-Ups or Bench Press", sets: 4, reps: "6–10" },

    { section: "Kettlebell Volume (10 min)" },
    { name: "Goblet Squat", sets: 3, reps: "12" },
    { name: "Single-Arm KB Overhead Press", sets: 3, reps: "8/side" },

    { section: "Finisher (5–7 min)" },
    { note: "Repeat continuously" },
    { name: "Kettlebell Swings", reps: "10" },
    { name: "Burpees", reps: "10" },

    { section: "Cooldown (5 min)" },
    { name: "Couch Stretch", reps: "1 min/side" },
    { name: "Chest Opener Stretch", reps: "1–2 min" }
  ],

  B: [
    { section: "Warm-Up (5–7 min)" },
    { name: "Hip Hinge Drill", reps: "15" },
    { name: "Band Pull-Aparts", reps: "20" },

    { section: "Strength Superset (15 min)" },
    { note: "Alternate movements" },
    { name: "Deadlift", sets: 4, reps: "4–5" },
    { name: "Pull-Ups or Lat Pulldown", sets: 4, reps: "6–10" },

    { section: "Kettlebell Volume (10 min)" },
    { name: "KB Romanian Deadlift", sets: 3, reps: "12" },
    { name: "Single-Arm KB Row", sets: 3, reps: "10/side" },

    { section: "Finisher (5–7 min)" },
    { note: "2–3 fast rounds" },
    { name: "Kettlebell Swings", reps: "20" },
    { name: "Goblet Squats", reps: "15" },

    { section: "Cooldown (5 min)" },
    { name: "Hamstring Stretch", reps: "1 min/side" },
    { name: "Lat Stretch", reps: "1 min/side" }
  ],

  C: [
    { section: "Warm-Up (5–7 min)" },
    { name: "Jump Rope", reps: "2 min" },
    { name: "Bodyweight Squats", reps: "15" },

    { section: "Power & Strength (15 min)" },
    { name: "Clean & Press (Barbell or KB)", sets: 5, reps: "3" },
    { name: "Front Squat or Double KB Squat", sets: 4, reps: "6" },

    { section: "Conditioning Circuit (10–15 min)" },
    { note: "AMRAP" },
    { name: "Kettlebell Swings", reps: "10" },
    { name: "Reverse Lunges", reps: "8/leg" },
    { name: "Plank", reps: "30 sec" },

    { section: "Cooldown (5 min)" },
    { name: "Hip Flexor Stretch", reps: "1 min/side" },
    { name: "Breathing Reset", reps: "2 min" }
  ],

  HIIT: [
    { section: "HIIT Option 1 – 30/30 Intervals" },
    { name: "Jump Rope", reps: "30 sec work / 30 sec rest × 10 rounds" },

    { section: "HIIT Option 2 – Tabata" },
    { name: "Burpees", reps: "20 sec work / 10 sec rest × 8 rounds" },

    { section: "HIIT Option 3 – Mixed Conditioning" },
    { name: "Kettlebell Swings", reps: "30 sec" },
    { name: "Mountain Climbers", reps: "30 sec" },
    { name: "Rest", reps: "30 sec × 5 rounds" }
  ],

  MOBILITY: [
    { section: "Mobility Day (20–30 min)" },
    { name: "90/90 Hip Mobility", reps: "1 min/side" },
    { name: "World’s Greatest Stretch", reps: "5/side" },
    { name: "Thoracic Rotation", reps: "10/side" },
    { name: "Couch Stretch", reps: "1–2 min/side" },
    { name: "Breathing Reset", reps: "3–5 min" }
  ]
};

function loadWorkout(type) {
  const ul = document.getElementById("workout");
  ul.innerHTML = "";
  let inBlock = false;

  workouts[type].forEach(item => {
    if (item.section) {
      inBlock = false;
      const li = document.createElement("li");
      li.className = "section";
      li.textContent = item.section;
      ul.appendChild(li);
      return;
    }

    if (item.note) {
      inBlock = true;
      const li = document.createElement("li");
      li.className = "block";
      li.innerHTML = `<div class="blockNote">${item.note}</div>`;
      ul.appendChild(li);
      return;
    }

    const li = document.createElement("li");
    li.className = inBlock ? "exercise sub" : "exercise";
    li.innerHTML = `
      <strong>${item.name}</strong>
      <div>${item.sets ? `${item.sets} × ${item.reps}` : item.reps}</div>
    `;
    ul.appendChild(li);
  });
}

/* EXERCISE LIBRARY */
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
