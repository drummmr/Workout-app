const workouts = {
  A: [
    { name: "Back Squat – 4×5", time: 90, video: "https://youtu.be/ultWZbUMPL8" },
    { name: "Bench Press – 4×8", time: 90, video: "https://youtu.be/rT7DgCr-3pg" },
    { name: "Goblet Squat – 3×12", time: 60, video: "https://youtu.be/6xwGFn-J_QA" },
    { name: "KB Overhead Press – 3×8/side", time: 60, video: "https://youtu.be/2yjwXTZQDDI" }
  ],
  B: [
    { name: "Deadlift – 4×5", time: 120, video: "https://youtu.be/op9kVnSso6Q" },
    { name: "Pull-Ups – 4×8", time: 90, video: "https://youtu.be/eGo4IYlbE5g" },
    { name: "KB Romanian Deadlift – 3×12", time: 60, video: "https://youtu.be/0Yq9GvH3lY8" }
  ],
  C: [
    { name: "Clean & Press – 5×3", time: 90, video: "https://youtu.be/8gU7xgT2a1k" },
    { name: "Front Squat – 4×6", time: 90, video: "https://youtu.be/t4DkL9a0GkI" }
  ],
  M: [
    { name: "KB Halos", time: 30, video: "https://youtu.be/1k8j6dR6sR8" },
    { name: "World’s Greatest Stretch", time: 45, video: "https://youtu.be/F7W4s5TbUpQ" },
    { name: "Deep Squat Hold", time: 60, video: "https://youtu.be/5-6Qk0KcZ3M" },
    { name: "Thoracic Rotations", time: 45, video: "https://youtu.be/6-0ZKpC1h0o" }
  ]
};

let currentTime = 0;
let timer = null;

function loadWorkout(day) {
  const ul = document.getElementById("workout");
  ul.innerHTML = "";

  workouts[day].forEach(ex => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${ex.name}</strong><br>
      ⏱ Rest: ${ex.time}s<br>
      <a href="${ex.video}" target="_blank">▶ Watch Demo</a>
    `;
    li.onclick = () => setTimer(ex.time);
    ul.appendChild(li);
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
    } else {
      pauseTimer();
    }
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
