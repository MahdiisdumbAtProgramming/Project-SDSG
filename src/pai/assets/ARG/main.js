const root=document.getElementById('os-root');let topZ=100;let fs=JSON.parse(localStorage.getItem('os_fs'))||initialFilesystem;const desk=document.createElement('div');desk.className='desktop';root.appendChild(desk);const findById=(arr,id)=>{for(let x of arr){if(x.id===id)return x;if(x.children){const f=findById(x.children,id);if(f)return f}}}
function makeDraggable(win){const header=win.querySelector('.win-header');let offsetX,offsetY,isDragging=!1;header.addEventListener('mousedown',e=>{isDragging=!0;const rect=win.getBoundingClientRect();offsetX=e.clientX-rect.left;offsetY=e.clientY-rect.top;win.style.zIndex=++topZ});document.addEventListener('mousemove',e=>{if(!isDragging)return;win.style.left=(e.clientX-offsetX)+'px';win.style.top=(e.clientY-offsetY)+'px'});document.addEventListener('mouseup',e=>{isDragging=!1})}
function createWin(title,content){const w=document.createElement('div');w.className='win';w.style.top=(50+(topZ-100)*15)+'px';w.style.left=(250+(topZ-100)*15)+'px';w.style.zIndex=++topZ;w.innerHTML=`
        <div class="win-header">
            <span>${title.toUpperCase()}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="win-content">${content}</div>
    `;desk.appendChild(w);makeDraggable(w);return w}
window.osOpen=(id)=>{const m=findById(fs,id);if(!m)return;if(m.type==='file'){const h=m.content.replace(/\n/g,'<br>');createWin(m.name,h)}else if(m.type==='folder'){let h='<div style="display:flex;gap:15px;flex-wrap:wrap;">';m.children.forEach(c=>{h+=`<div class="icon" onclick="osOpen('${c.id}')"><span>${c.icon}</span><br><label>${c.name}</label></div>`});createWin(m.name,h+'</div>')}else if(m.type==='app'){openTerm()}}
function openTerm(){const win=createWin('Terminal',`
        <div>FBI ARCH-OS TERMINAL<br>Use: [name] [crime] [penalty]</div>
        <input class="terminal-in" id="t-in" autofocus>
    `);const input=win.querySelector('#t-in');input.onkeydown=(e)=>{if(e.key==='Enter'){const val=input.value.trim();const parts=val.split(' ');if(parts[0].toLowerCase()==='reset'){localStorage.clear();location.reload()}else if(parts.length>=3){const name=parts[0];const crime=parts.slice(1,parts.length-1).join(' ');const penalty=parts[parts.length-1];playCutscene(name,crime,penalty)}
input.value=''}}}
function playCutscene(name,crime,penalty){document.body.innerHTML=`
        <div class='cutscene-screen' style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#111; color:#eee; text-align:center;">
            <h1>JAIL CELL</h1>
            <h2>Name: ${name}</h2>
            <h2>Crime: ${crime}</h2>
            <h2>Penalty: ${penalty}</h2>
            <div style="margin-top:20px; font-size:120px;">🚓</div>
            <button class="btn" onclick="location.reload()">RETURN</button>
        </div>
    `}
fs.forEach(i=>{if(i.type==='folder'||i.type==='app'||i.type==='file'){const ic=document.createElement('div');ic.className='icon';ic.innerHTML=`<span>${i.icon}</span><br><label>${i.name}</label>`;ic.onclick=()=>osOpen(i.id);desk.appendChild(ic)}})