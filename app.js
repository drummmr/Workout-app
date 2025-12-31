let timer = null;
let currentWorkout = null;
let audioCtx = null;
let audioUnlocked = false;

/* ===== AUDIO ===== */

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

/* ===== TIMER HELPERS ===== */

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

/* ===== HIIT TIMERS ===== */

function startTabata() {
  unlockAudio();
  stopTimer();
  let round = 1;
  let phase = "work";
  let time = 20;

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
        if (round > 8) {
          beep(400,.5);
          stopTimer();
          return;
        }
        phase = "work";
        time = 20;
        setPhase("WORK","work");
        setProgress(`Round ${round}/8`);
      }
    }
  },1000);
}

function startHIIT3030() {
  unlockAudio();
  stopTimer();
  let round = 1, phase="work", time=30;
  setPhase("WORK","work");
  setProgress(`Round ${round}/10`);
  updateDisplay(time);
  beep();

  timer = setInterval(()=>{
    time--;
    updateDisplay(time);
    if(time<=0){
      beep();
      if(phase==="work"){
        phase="rest"; time=30; setPhase("REST","rest");
      } else {
        round++;
        if(round>10){ stopTimer(); return; }
        phase="work"; time=30;
        setPhase("WORK","work");
        setProgress(`Round ${round}/10`);
      }
    }
  },1000);
}

function startEMOM() {
  unlockAudio();
  stopTimer();
  let minute = 1, time = 60;
  setPhase("EMOM","work");
  setProgress(`Minute ${minute}/10`);
  updateDisplay(time);
  beep();

  timer = setInterval(()=>{
    time--;
    updateDisplay(time);
    if(time<=0){
      beep();
      minute++;
      if(minute>10){ stopTimer(); return; }
      time=60;
      setProgress(`Minute ${minute}/10`);
    }
  },1000);
}

/* ===== WORKOUT DATA ===== */

const workouts = {
  A: ["Warm-up","Squat","Bench Press","Row","KB Finisher","Cooldown"],
  B: ["Warm-up","Deadlift","Overhead Press","Pull-up","Carry Finisher","Cooldown"],
  C: ["Warm-up","Front Squat","RDL","Push-ups","KB Volume","Cooldown"],
  HIIT: ["Tabata","HIIT 30/30","EMOM"],
  MOBILITY: ["Hip Mobility","Thoracic","Breathing"]
};

function loadWorkout(type){
  currentWorkout = type;
  const ul = document.getElementById("workout");
  ul.innerHTML = "";
  workouts[type].forEach(item=>{
    const li = document.createElement("li");
    li.textContent = item;
    if(item==="Tabata") li.onclick=startTabata;
    if(item==="HIIT 30/30") li.onclick=startHIIT3030;
    if(item==="EMOM") li.onclick=startEMOM;
    ul.appendChild(li);
  });
}

/* ===== LOGGING ===== */

function logWorkout(){
  if(!currentWorkout) return alert("Start a workout first");
  const log = JSON.parse(localStorage.getItem("log"))||[];
  log.push({w:currentWorkout,d:new Date().toLocaleString()});
  localStorage.setItem("log",JSON.stringify(log));
  updateLastWorkout();
}

function updateLastWorkout(){
  const log = JSON.parse(localStorage.getItem("log"))||[];
  if(!log.length) return;
  const last = log[log.length-1];
  document.getElementById("lastWorkout").textContent =
    `Last: ${last.w} (${last.d})`;
}

updateLastWorkout();

/* ===== LIBRARY ===== */

const library = {
  "Strength": [["Squat","https://www.youtube.com/watch?v=SW_C1A-rejs"]],
  "Kettlebell": [["KB Swing","https://www.youtube.com/watch?v=YSxHifyI6s8"]],
  "Mobility": [["World’s Greatest Stretch","https://www.youtube.com/watch?v=Fsa_CjlT6IY"]]
};

function openLibrary(){
  const list=document.getElementById("libraryList");
  list.innerHTML="";
  Object.keys(library).forEach(sec=>{
    list.innerHTML+=`<li><strong>${sec}</strong></li>`;
    library[sec].forEach(([n,u])=>{
      list.innerHTML+=`<li><a href="${u}" target="_blank">${n}</a></li>`;
    });
  });
  document.getElementById("libraryModal").style.display="block";
}

function closeLibrary(){
  document.getElementById("libraryModal").style.display="none";
}
