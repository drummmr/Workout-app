let currentTime = 0;
let timer = null;

const workouts = {
  A: {
    sections: [
      {
        title: "Warm-Up",
        items: [
          { name: "Jump Rope / March", time: 60, video: "https://youtu.be/1BZM9i5dP7s" },
          { name: "World’s Greatest Stretch", time: 45, video: "https://youtu.be/F7W4s5TbUpQ" },
          { name: "KB Halos", time: 30, video: "https://youtu.be/1k8j6dR6sR8" }
        ]
      },
      {
        title: "Main Lifts",
        items: [
          { name: "Back Squat – 4×5", time: 90, video: "https://youtu.be/ultWZbUMPL8" },
          { name: "Bench Press – 4×8", time: 90, video: "https://youtu.be/rT7DgCr-3pg" }
        ]
      },
      {
        title: "Kettlebell Volume / Finisher",
        items: [
          { name: "KB Goblet Squat – 3×12", time: 60, video: "https://youtu.be/6xwGFn-J_QA" },
          { name: "KB Push Press – 3×8/side", time: 60, video: "https://youtu.be/2yjwXTZQDDI" }
        ]
      }
    ]
  },

  B: {
    sections: [
      {
        title: "Warm-Up",
        items: [
          { name: "Row / Bike Easy", time: 60, video: "" },
          { name: "Hip Openers", time: 45, video: "" },
          { name: "Glute Bridges", time: 45, video: "" }
        ]
      },
      {
        title: "Main Lifts",
        items: [
          { name: "Deadlift – 4×5", time: 120, video: "https://youtu.be/op9kVnSso6Q" },
          { name: "Pull-Ups – 4×8", time: 90, video: "https://youtu.be/eGo4IYlbE5g" }
        ]
      },
      {
        title: "Kettlebell Volume / Finisher",
        items: [
          { name: "KB Swings – 10×15", time: 45, video: "https://youtu.be/YSxHifyI6s8" }
        ]
      }
    ]
  },

  C: {
    sections: [
      {
        title: "Warm-Up",
        items: [
          { name: "Jump Rope / Shadow Box", time: 60, video: "" },
          { name: "Thoracic Rotations", time: 45, video: "" },
          { name: "KB Halos", time: 30, video: "" }
        ]
      },
      {
        title: "Main Lifts",
        items: [
          { name: "Clean & Press – 5×3", time: 90, video: "https://youtu.be/8gU7xgT2a1k" },
          { name: "Front Squat – 4×6", time: 90, video: "https://youtu.be/t4DkL9a0GkI" }
        ]
      },
      {
        title: "Kettlebell Volume / Finisher",
        items: [
          { name: "KB Rows – 4×12", time: 60, video: "" },
          { name: "KB Lunges – 3×10/side", time: 60, video: "" }
        ]
      }
    ]
  },

  HIIT: {
    sections: [
      {
        title: "HIIT Cardio",
        items: [
          { name: "30s Hard / 30s Easy × 10", time: 600, video: "" },
          { name: "Bike / Rower / Run", time: 600, video: "" }
        ]
      }
    ]
  },

  LOW: {
    sections: [
      {
        title: "Low-Intensity Cardio (KISS)",
        items: [
          { name: "Incline Walk / Easy Bike", time: 1200, video: "" }
        ]
      }
    ]
  }
};

function loadWorkout(key) {
  const ul = document.getElementById("workout");
  ul.innerHTML = "";

  workouts[key].sections.forEach(section => {
    const header = document.createElement("li");
    header.innerHTML = `<strong>${section.title}</strong>`;
    ul.appendChild(header);

    section.items.forEach(ex => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${ex.name}<br>
        ⏱ ${ex.time}s<br>
        ${ex.video ? `<a href="${ex.video}" target="_blank">▶ Demo</a>` : ""}
      `;
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
