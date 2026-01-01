let soundEnabled=false,audioCtx=null,timer=null,currentWorkout=null;
const timerEl=document.getElementById('timer');
const phaseLabel=document.getElementById('phaseLabel');
const progressFill=document.getElementById('progressFill');
const workout=document.getElementById('workout');
const logStatus=document.getElementById('logStatus');
const libraryModal=document.getElementById('libraryModal');
const libraryList=document.getElementById('libraryList');

function toggleSound(){soundEnabled=!soundEnabled;if(soundEnabled&&!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();alert(soundEnabled?'Sound enabled':'Sound muted');}
function beep(){if(!soundEnabled||!audioCtx)return;let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.15);o.stop(audioCtx.currentTime+.15);}

function updateTimer(s){timerEl.textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function stopTimer(){clearInterval(timer);timer=null;phaseLabel.textContent='READY';progressFill.style.width='0%'}

const workouts={
A:[{section:'Workout A'},{name:'Barbell Back Squat',reps:'4x5'}],
B:[{section:'Workout B'}],
C:[{section:'Workout C'}],
HIIT:[{section:'HIIT'},{name:'Start 20/10 Tabata',action:startHIIT}],
MOBILITY:[{section:'Mobility'}]
};

function loadWorkout(k){currentWorkout=k;workout.innerHTML='';workouts[k].forEach(i=>{let li=document.createElement('li');if(i.section){li.className='section';li.textContent=i.section}else if(i.action){li.className='exercise';let b=document.createElement('button');b.textContent=i.name;b.onclick=i.action;li.appendChild(b)}else{li.className='exercise';li.textContent=i.name+' '+(i.reps||'')}workout.appendChild(li);});}

function startHIIT(){stopTimer();let s=20,r=8,w=true;phaseLabel.textContent='WORK';updateTimer(s);beep();timer=setInterval(()=>{s--;updateTimer(s);progressFill.style.width=((20-s)/20*100)+'%';if(s<=0){beep();if(w){w=false;s=10;phaseLabel.textContent='REST'}else{w=true;r--;s=20;phaseLabel.textContent='WORK'}if(r<=0)stopTimer()}},1000)}

function logWorkout(){if(!currentWorkout)return;let l=JSON.parse(localStorage.getItem('log')||'[]');l.push({w:currentWorkout,d:new Date().toISOString()});localStorage.setItem('log',JSON.stringify(l));logStatus.textContent='Logged '+currentWorkout}

const videos={Squat:'https://youtu.be/SW_C1A-rejs'};
function openLibrary(){libraryList.innerHTML='';Object.entries(videos).forEach(([n,u])=>{let li=document.createElement('li');li.innerHTML=`<a href="${u}" target="_blank">${n}</a>`;libraryList.appendChild(li)});libraryModal.style.display='block'}
function closeLibrary(){libraryModal.style.display='none'}
