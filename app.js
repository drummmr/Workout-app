let timer = null;
let activeElement = null;

/* ================= AUDIO ================= */

/* ================= AUDIO ================= */

let audioCtx = null;
let audioUnlocked = false;

function unlockAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  audioUnlocked = true;
}

function beep(freq = 1000, duration = 0.15) {
  if (!audioUnlocked) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

/* ================= UI HELPERS ================= */

function updateDisplay(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  document.getElementById("time").textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function highlight(el) {
  if (activeElement) activeElement.classList.remove("active");
  activeElement = el;
  activeElement.classList.add("active");
}

function setPhase(label, type) {
  const el = document.getElementById("phaseLabel");
  el.textContent = label;
  el.className = "";
  el.classList.add(`phase-${type}`);
}

function clearPhase() {
  document.getElementById("phaseLabel").textContent = "";
  document.getElementById("phaseLabel").className = "";
}

function setProgress(text) {
  document.getElementById("progressLabel").textContent = text;
}

function clearProgress() {
  document.getElementById("progressLabel").textContent = "";
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

/* ================= WORKOUT DATA ================= */

const workouts = {
  HIIT: {
    sections: [
      {
        title: "HIIT Option 1 – 30 / 30",
        items: [{ name: "30s Work / 30s Rest × 10", type: "3030" }]
      },
      {
        title: "HIIT Option 2 – Tabata",
        items: [{ name: "20s / 10s × 8", type: "tabata" }]
      },
      {
        title: "HIIT Option 3 – EMOM",
        items: [{ name: "EMOM 12 min", type: "emom" }]
      }
    ]
  }
};

/* ================= LOAD WORKOUT ================= */

function loadWorkout(key) {
  const ul = document.getElementById("workout");
  ul.innerHTML = "";

  workouts[key].sections.forEach(section => {
    const header = document.createElement("li");
    header.innerHTML = `<strong>${section.title}</strong>`;
    ul.appendChild(header);

    section.items.forEach(ex => {
      const li = document.createElement("li");
      li.textContent = ex.name;

      li.onclick = () => {
        if (ex.type === "3030") startHIIT3030(li);
        if (ex.type === "tabata") startTabata(li);
        if (ex.type === "emom") startEMOM(li, 12);
      };

      ul.appendChild(li);
    });
  });
}

/* ================= HIIT 30 / 30 ================= */

function startHIIT3030(element, rounds = 10) {
  unlockAudio();
  stopTimer();
  highlight(element);

  let phase = "work";
  let timeLeft = 30;
  let currentRound = 1;

  setPhase("WORK", "work");
  setProgress(`Round ${currentRound} of ${rounds}`);
  updateDisplay(timeLeft);
  beep();

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay(timeLeft);

    if (timeLeft <= 0) {
      beep();
      if (phase === "work") {
        phase = "rest";
        setPhase("REST", "rest");
        timeLeft = 30;
      } else {
        currentRound++;
        if (currentRound > rounds) {
          beep(400, 0.5);
          clearPhase();
          clearProgress();
          stopTimer();
          return;
        }
        setProgress(`Round ${currentRound} of ${rounds}`);
        phase = "work";
        setPhase("WORK", "work");
        timeLeft = 30;
      }
    }
  }, 1000);
}

/* ================= TABATA ================= */

function startTabata(element) {
  unlockAudio();
  stopTimer();
  highlight(element);

  let totalRounds = 8;
  let currentRound = 1;
  let phase = "work";
  let timeLeft = 20;

  setPhase("WORK", "work");
  setProgress(`Round ${currentRound} of ${totalRounds}`);
  updateDisplay(timeLeft);
  beep();

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay(timeLeft);

    if (timeLeft <= 0) {
      beep();
      if (phase === "work") {
        phase = "rest";
        setPhase("REST", "rest");
        timeLeft = 10;
      } else {
        currentRound++;
        if (currentRound > totalRounds) {
          beep(400, 0.5);
          clearPhase();
          clearProgress();
          stopTimer();
          return;
        }
        setProgress(`Round ${currentRound} of ${totalRounds}`);
        phase = "work";
        setPhase("WORK", "work");
        timeLeft = 20;
      }
    }
  }, 1000);
}

/* ================= EMOM ================= */

function startEMOM(element, minutes = 12) {
  unlockAudio();
  stopTimer();
  highlight(element);

  let currentMinute = 1;
  let timeLeft = 60;

  setPhase("EMOM", "emom");
  setProgress(`Minute ${currentMinute} of ${minutes}`);
  updateDisplay(timeLeft);
  beep();

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay(timeLeft);

    if (timeLeft <= 0) {
      beep();
      currentMinute++;
      if (currentMinute > minutes) {
        beep(400, 0.5);
        clearPhase();
        clearProgress();
        stopTimer();
        return;
      }
      setProgress(`Minute ${currentMinute} of ${minutes}`);
      timeLeft = 60;
    }
  }, 1000);
}
