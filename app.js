const workouts={A:["A"],B:["B"],C:["C"],M:["M"]};
let currentTime=0,timer=null;

function loadWorkout(d){
 document.getElementById("workout").innerHTML="<li>Loaded Workout Day "+d+"</li>";
}

function startTimer(){
 if(timer) return;
 timer=setInterval(()=>{
  if(currentTime>0){currentTime--;update();}
  else pauseTimer();
 },1000);
}
function pauseTimer(){clearInterval(timer);timer=null;}
function resetTimer(){update();}
function update(){
 let m=Math.floor(currentTime/60);
 let s=currentTime%60;
 document.getElementById("time").textContent=
  String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
}

// Auto Suggest
function suggestNext(){
 let log=JSON.parse(localStorage.getItem("workouts")||"[]");
 let order=["A","B","C"];
 let last=log.length?log[log.length-1].day:null;
 let next=order[(order.indexOf(last)+1)%3]||"A";
 document.getElementById("suggest").textContent="Suggested Workout: Day "+next;
}
suggestNext();

// Calendar
function markWorkout(){
 const today=new Date().toISOString().slice(0,10);
 let log=JSON.parse(localStorage.getItem("workouts")||"[]");
 if(!log.find(x=>x.date===today)){
  log.push({date:today,day:getSuggestedDay()});
 }
 localStorage.setItem("workouts",JSON.stringify(log));
 renderCalendar();
 suggestNext();
}

function getSuggestedDay(){
 let log=JSON.parse(localStorage.getItem("workouts")||"[]");
 if(!log.length) return "A";
 let last=log[log.length-1].day;
 let order=["A","B","C"];
 return order[(order.indexOf(last)+1)%3];
}

function renderCalendar(){
 const el=document.getElementById("month");
 el.innerHTML="";
 let now=new Date();
 let days=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
 let log=JSON.parse(localStorage.getItem("workouts")||"[]");
 for(let i=1;i<=days;i++){
  let d=document.createElement("div");
  d.className="day";
  let dateStr=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(i).padStart(2,"0");
  if(log.find(x=>x.date===dateStr)) d.classList.add("done");
  d.textContent=i;
  el.appendChild(d);
 }
}
renderCalendar();
