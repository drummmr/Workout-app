let timer = null;
let currentWorkout = null;
let audioCtx = null;
let audioUnlocked = false;

/* AUDIO */
function unlockAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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

/* TIMER HELPERS */
function updateDisplay(sec) {
  document.getElementById("time").textContent =
    `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;
}
function setPhase(t,c){const p=document.getElementById("phaseLabel");p.textContent=t;p.className=c;}
function clearPhase(){document.getElementById("phaseLabel").textContent="";}
function setProgress(t){document.getElementById("progressLabel").textContent=t;}
function clearProgress(){document.getElementById("progressLabel").textContent="";}
function stopTimer(){clearInterval(timer);clearPhase();clearProgress();updateDisplay(0);}

/* HIIT TIMERS */
function startTabata(){
  unlockAudio(); stopTimer();
  let r=1,p="work",t=20;
  setPhase("WORK","work"); setProgress(`Round ${r}/8`); updateDisplay(t); beep();
  timer=setInterval(()=>{
    t--; updateDisplay(t);
    if(t<=0){beep();
      if(p==="work"){p="rest";t=10;setPhase("REST","rest");}
      else{r++; if(r>8){stopTimer();return;}
        p="work";t=20;setPhase("WORK","work");setProgress(`Round ${r}/8`);}
    }
  },1000);
}
function startHIIT3030(){
  unlockAudio(); stopTimer();
  let r=1,p="work",t=30;
  setPhase("WORK","work"); setProgress(`Round ${r}/10`); updateDisplay(t); beep();
  timer=setInterval(()=>{
    t--; updateDisplay(t);
    if(t<=0){beep();
      if(p==="work"){p="rest";t=30;setPhase("REST","rest");}
      else{r++; if(r>10){stopTimer();return;}
        p="work";t=30;setPhase("WORK","work");setProgress(`Round ${r}/10`);}
    }
  },1000);
}
function startEMOM(){
  unlockAudio(); stopTimer();
  let m=1,t=60;
  setPhase("EMOM","work"); setProgress(`Minute ${m}/10`); updateDisplay(t); beep();
  timer=setInterval(()=>{
    t--; updateDisplay(t);
    if(t<=0){beep(); m++; if(m>10){stopTimer();return;}
      t=60; setProgress(`Minute ${m}/10`);
    }
  },1000);
}

/* FULL PROGRAM */
const workouts = {
  A: [
    { section:"Warm-Up" },
    { name:"Jump Rope",sets:"2",reps:"1 min" },
    { name:"Glute Bridge",sets:"2",reps:"15" },
    { name:"World’s Greatest Stretch",sets:"2",reps:"5/side" },

    { section:"Main Lifts" },
    { name:"Back Squat",sets:"4",reps:"5",rest:"2–3 min" },
    { name:"Bench Press",sets:"4",reps:"6",rest:"2 min" },
    { name:"Bent Over Row",sets:"3",reps:"8" },

    { section:"Finisher" },
    { name:"Kettlebell Swings",sets:"3",reps:"20" },

    { section:"Cooldown" },
    { name:"Hamstring Stretch",sets:"2",reps:"30 sec" },
    { name:"Child’s Pose",sets:"2",reps:"45 sec" },
    { name:"Breathing Reset",sets:"2",reps:"60 sec" }
  ],

  B: [
    { section:"Warm-Up" },
    { name:"Bodyweight Squat",sets:"2",reps:"15" },
    { name:"Hip Flexor Stretch",sets:"2",reps:"30 sec" },

    { section:"Main Lifts" },
    { name:"Deadlift",sets:"4",reps:"3–5",rest:"3 min" },
    { name:"Overhead Press",sets:"4",reps:"6" },
    { name:"Pull-Ups",sets:"3",reps:"AMRAP" },

    { section:"Finisher" },
    { name:"Farmer Carry",sets:"4",reps:"30 m" },

    { section:"Cooldown" },
    { name:"Couch Stretch",sets:"2",reps:"45 sec/side" },
    { name:"Thoracic Rotation",sets:"2",reps:"8/side" }
  ],

  C: [
    { section:"Warm-Up" },
    { name:"Jump Rope",sets:"2",reps:"1 min" },
    { name:"90/90 Hip Mobility",sets:"2",reps:"60 sec" },

    { section:"Main Lifts" },
    { name:"Front Squat",sets:"4",reps:"6" },
    { name:"Romanian Deadlift",sets:"3",reps:"8" },
    { name:"Push-Ups",sets:"3",reps:"AMRAP" },

    { section:"KB Volume" },
    { name:"Kettlebell Clean + Press",sets:"5",reps:"5/side" },

    { section:"Cooldown" },
    { name:"Hamstring Stretch",sets:"2",reps:"30 sec" },
    { name:"Breathing Reset",sets:"2",reps:"60 sec" }
  ],

  HIIT: [
    { section:"HIIT Options" },
    { name:"Tabata 20/10 x8",action:startTabata },
    { name:"HIIT 30/30 x10",action:startHIIT3030 },
    { name:"EMOM x10",action:startEMOM },

    { section:"Cooldown" },
    { name:"Walking",sets:"5",reps:"min" },
    { name:"Calf Stretch",sets:"2",reps:"30 sec" }
  ],

  MOBILITY: [
    { section:"Full Mobility Session" },
    { name:"World’s Greatest Stretch",sets:"2",reps:"5/side" },
    { name:"90/90 Hip Mobility",sets:"2",reps:"60 sec" },
    { name:"Thoracic Rotation",sets:"2",reps:"8/side" },
    { name:"Couch Stretch",sets:"2",reps:"60 sec/side" },
    { name:"Child’s Pose",sets:"2",reps:"60 sec" },
    { name:"Breathing Reset",sets:"3",reps:"60 sec" }
  ]
};

/* VIDEO MAP */
const videoMap = {
  "Jump Rope":"https://www.youtube.com/watch?v=1BZM8k1mH8Y",
  "Glute Bridge":"https://www.youtube.com/watch?v=m2Zx-57cSok",
  "World’s Greatest Stretch":"https://www.youtube.com/watch?v=Fsa_CjlT6IY",
  "Back Squat":"https://www.youtube.com/watch?v=SW_C1A-rejs",
  "Bench Press":"https://www.youtube.com/watch?v=rT7DgCr-3pg",
  "Bent Over Row":"https://www.youtube.com/watch?v=FWJR5Ve8bnQ",
  "Kettlebell Swings":"https://www.youtube.com/watch?v=YSxHifyI6s8",
  "Hamstring Stretch":"https://www.youtube.com/watch?v=Z7ZKzj9gJpU",
  "Child’s Pose":"https://www.youtube.com/watch?v=eqVMAPM00DM",
  "Deadlift":"https://www.youtube.com/watch?v=op9kVnSso6Q",
  "Overhead Press":"https://www.youtube.com/watch?v=2yjwXTZQDDI",
  "Pull-Ups":"https://www.youtube.com/watch?v=eGo4IYlbE5g",
  "Farmer Carry":"https://www.youtube.com/watch?v=Fkzk_RqlYig",
  "Front Squat":"https://www.youtube.com/watch?v=v-mQm_droHg",
  "Romanian Deadlift":"https://www.youtube.com/watch?v=2SHsk9AzdjA",
  "Push-Ups":"https://www.youtube.com/watch?v=IODxDxX7oi4",
  "90/90 Hip Mobility":"https://www.youtube.com/watch?v=2uYJZfB3k_U",
  "Thoracic Rotation":"https://www.youtube.com/watch?v=7vE7n6Lw3tU",
  "Couch Stretch":"https://www.youtube.com/watch?v=GvZp3D7xvGk",
  "Breathing Reset":"https://www.youtube.com/watch?v=8TuRYV71Rgo"
};

/* RENDER */
function loadWorkout(type){
  currentWorkout=type;
  const ul=document.getElementById("workout");
  ul.innerHTML="";
  workouts[type].forEach(item=>{
    if(item.section){
      const h=document.createElement("li");
      h.textContent=item.section;
      h.className="section";
      ul.appendChild(h); return;
    }
    const li=document.createElement("li");
    li.innerHTML=`<strong>${item.name}</strong>
      ${item.sets?`<div>${item.sets} × ${item.reps}</div>`:""}
      ${item.rest?`<div style="opacity:.6">Rest: ${item.rest}</div>`:""}`;
    if(item.action) li.onclick=item.action;
    ul.appendChild(li);
  });
}

/* LOGGING */
function logWorkout(){
  if(!currentWorkout) return alert("Start workout first");
  const log=JSON.parse(localStorage.getItem("log"))||[];
  log.push({w:currentWorkout,d:new Date().toLocaleString()});
  localStorage.setItem("log",JSON.stringify(log));
  updateLastWorkout();
}
function updateLastWorkout(){
  const log=JSON.parse(localStorage.getItem("log"))||[];
  if(!log.length) return;
  const l=log[log.length-1];
  document.getElementById("lastWorkout").textContent=`Last workout: ${l.w} (${l.d})`;
}
updateLastWorkout();

/* LIBRARY */
function openLibrary(){
  const list=document.getElementById("libraryList");
  list.innerHTML="";
  const set=new Set();
  Object.values(workouts).forEach(d=>d.forEach(i=>i.name&&set.add(i.name)));
  [...set].sort().forEach(n=>{
    const li=document.createElement("li");
    li.innerHTML=videoMap[n]?`<a href="${videoMap[n]}" target="_blank">${n}</a>`:`${n} (video coming)`;
    list.appendChild(li);
  });
  document.getElementById("libraryModal").style.display="block";
}
function closeLibrary(){document.getElementById("libraryModal").style.display="none";}
