const root=document.getElementById("os-root");let topZ=100;const fs=JSON.parse(localStorage.getItem("os_fs"))||initialFilesystem;const desk=document.createElement("div");desk.className="desktop";root.appendChild(desk);const audio={main:new Audio("main.mp3"),bgCheck:new Audio("bgchk.mp3"),testimony:new Audio("tesify.mp3"),verdict:new Audio("fin.mp3")};audio.main.loop=!0;audio.bgCheck.loop=!0;audio.testimony.loop=!0;audio.verdict.loop=!1;let currentTrack="main";function playTrack(trackName){if(currentTrack===trackName)return;for(let key in audio)audio[key].pause();audio[trackName].currentTime=0;audio[trackName].play();currentTrack=trackName}
const findById=(arr,id)=>{for(const i of arr){if(i.id===id)return i;if(i.children){const f=findById(i.children,id);if(f)return f}}
return null};function makeDraggable(w){const h=w.querySelector(".win-header");let dx=0,dy=0,d=!1;h.addEventListener("mousedown",e=>{d=!0;const r=w.getBoundingClientRect();dx=e.clientX-r.left;dy=e.clientY-r.top;w.style.zIndex=++topZ});document.addEventListener("mousemove",e=>{if(!d)return;w.style.left=e.clientX-dx+"px";w.style.top=e.clientY-dy+"px"});document.addEventListener("mouseup",()=>d=!1)}
function renderContent(t){return t.replace(/\/WD([\s\S]*?)WD\\/g,'<span style="font-family:Wingdings">████</span>').replace(/\/RADACT([\s\S]*?)RADACT\\/g,'<span style="background:#fff;color:#fff">████████</span>').replace(/\/n/g,"<br>").replace(/\n/g,"<br>")}
function createWin(title,content,track="main"){playTrack(track);const w=document.createElement("div");w.className="win";w.style.zIndex=++topZ;w.style.top=60+(topZ-100)*10+"px";w.style.left=220+(topZ-100)*10+"px";w.innerHTML=`
        <div class="win-header">
            <span>${title.toUpperCase()}</span>
            <button onclick="this.closest('.win').remove(); playTrack('main')">×</button>
        </div>
        <div class="win-content">${content}</div>
    `;desk.appendChild(w);makeDraggable(w);return w}
function openTerminal(){createWin("Terminal","<div>FBI ARCH-OS TERMINAL</div><div>VERDICT Name Crime Penalty</div>","main")}
function playCutscene(name,crime,penalty){playTrack("verdict");document.body.innerHTML=`
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background:#111;color:#eee;text-align:center;">
            <h1>JAIL CELL</h1>
            <h2>Name: ${name}</h2>
            <h2>Crime: ${crime}</h2>
            <h2>Penalty: ${penalty}</h2>
            <div style="font-size:120px;margin:20px;">🚓</div>
            <button onclick="location.reload()">RETURN</button>
        </div>
    `}
window.osOpen=id=>{const i=findById(fs,id);if(!i)return;if(i.type==="file"){if(i.name.toLowerCase().includes("files"))playTrack("bgCheck");else if(i.name.toLowerCase().includes("testimony"))playTrack("testimony");createWin(i.name,renderContent(i.content))}
if(i.type==="folder"){let h='<div style="display:flex;gap:14px;flex-wrap:wrap;">';i.children.forEach(c=>{h+=`<div class="icon" onclick="osOpen('${c.id}')">
                    <span>${c.icon}</span><br><label>${c.name}</label>
                  </div>`});h+='</div>';createWin(i.name,h)}
if(i.type==="app")openTerminal();};fs.forEach(i=>{const d=document.createElement("div");d.className="icon";d.innerHTML=`<span>${i.icon}</span><br><label>${i.name}</label>`;d.onclick=()=>osOpen(i.id);desk.appendChild(d)});playTrack("main")