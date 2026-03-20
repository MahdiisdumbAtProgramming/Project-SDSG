const SCRIPT_URL="https://script.google.com/macros/s/AKfycby_i94vBag_GB7JkHV7ciae9GT6T9Nn-Q4eci9HQDthDtrxNnNHfnLc8vIdW7DVcJ2l/exec";let currentSheet=null;async function loadFiles(){const res=await fetch(SCRIPT_URL);const names=await res.json();document.getElementById("fileList").innerHTML="";names.forEach(name=>addFile(name))}
async function createStudent(){const name=document.getElementById("newName").value.trim();if(!name)return alert("enter name");const res=await fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({action:"create",name})});const text=await res.text();if(text==="created"){addFile(name)}else if(text==="exists"){alert("already exists")}else{alert("something went wrong")}}
function addFile(name){const div=document.createElement("div");div.innerText="📁 "+name.replaceAll("_"," ");div.onclick=()=>openFile(name);document.getElementById("fileList").appendChild(div)}
function openFile(sheet){currentSheet=sheet;document.getElementById("current").innerText="Viewing: "+sheet;loadData()}
async function loadData(){if(!currentSheet)return;const res=await fetch(`${SCRIPT_URL}?sheet=${currentSheet}`);const data=await res.json();const list=document.getElementById("list");list.innerHTML="";data.reverse().forEach(row=>{const div=document.createElement("div");div.className="entry";div.innerHTML=`
      <b>Crime:</b> ${row.crime}<br>
      <b>Reason:</b> ${row.reason}<br>
      <b>User:</b> ${row.user}<br>
      <small>${new Date(row.date).toLocaleString()}</small>
    `;list.appendChild(div)})}
window.addEventListener("load",loadFiles);async function submitData(){if(!currentSheet)return alert("pick a file");const crime=document.getElementById("crime").value.trim();const reason=document.getElementById("reason").value.trim();const user=document.getElementById("user").value.trim();if(!crime||!reason||!user)return alert("fill everything");await fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({action:"add",sheet:currentSheet,crime,reason,user})});loadData()}