const o=document.getElementById("output"),i=document.getElementById("command"),l=document.getElementById("input-line"),src="github.com/Mahdiisdumb/Project-SDSG",p=t=>{o.innerHTML+=t+"\n";scrollTo(0,document.body.scrollHeight)},boot=`Welcome to the SDSG command line
Use 'help' for commands.
Use 'start' for Compiling and loading`
function b(){p(boot)}
i.addEventListener("keydown",e=>{if(e.key==="Enter"){const c=i.value.trim();p("SDSG> "+c);h(c);i.value=""}})
function h(c){
switch(c.toLowerCase()){
case"help":p("Available commands:");p("help   start   src   tree   chk   clear");p("");p("Hidden / unsafe commands:");p("sudo   rm -rf /   glitch   debug   secrets");p("");p("Use at your own risk.");break
case"clear":o.textContent="";break
case"src":p(src);break
case"tree":p(".");p("└── src");p("    ├── intro");p("    └── pai");p("        ├── assets");p("        │   └── games");p("        ├── PREMIUM");p("        │   └── premium-games");p("        ├── about");p("        ├── modding");p("        ├── changelogs");p("        ├── status");p("        ├── contact");p("        ├── ifweb");p("        └── sdk");break
case"start":
if(localStorage.getItem("compiled")==="true"){p("SDSG already compiled. Redirecting...");setTimeout(()=>location.href="./pai/load.html",500);break}
const a=localStorage.getItem("SDSG")==="active",s=[
"Launching SDSG...",
"Loading assets...",
"Scanning directories...",
"Detecting games...",
`Found BASIC GAMES: ${games.join(", ")}`,
a?`PREMIUM license: YES\nDetecting PREMIUM games...\nFound PREMIUM GAMES: ${premiumGames.join(", ")}`:"PREMIUM license: NO",
"Compiling WebAssembly...",
"Loading user data...",
"High score data loaded.",
"Changelogs verified to your version.",
"Mahdiisdumb says if any problem occurs contact us.",
"All set!",
"Finalizing launch...",
"SDSG Launched! Enjoy.",
"Redirecting...",
"while Redirecting, remember to check out Mahdiisdumbs github github.com/Mahdiisdumb"
]
s.forEach((m,n)=>setTimeout(()=>p(m),n*800))
setTimeout(()=>{localStorage.setItem("compiled","true");location.href="./pai/load.html"},s.length*800+500)
break
case"chk":
p("Premium License: "+(localStorage.getItem("SDSG")==="active"?"YES":"NO"))
p("Basic Games: "+gameschk.join(", "))
p("Premium Games: "+premiumGameschk.join(", "))
break
case"sudo":p("permission denied");break
case"sudo start":p("nice try");break
case"rm -rf /":p("kernel panic (just kidding)");break
case"secrets":p("you were not supposed to find this");break
case"debug":p("debug mode enabled");p("nothing actually changed");break
case"glitch":for(let x=0;x<6;x++)setTimeout(()=>p(Math.random().toString(36).slice(2)),x*150);break
case"":break
default:p("Unknown command: "+c)
}}
onload=b