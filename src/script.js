   const output = document.getElementById("output");
        const input = document.getElementById("command");
        const inputLine = document.getElementById("input-line");

        const src = "github.com/Mahdiisdumb/Project-SDSG";

        /* ---------- UTIL ---------- */
        function print(text = "") {
        output.innerHTML += text + "\n";
        window.scrollTo(0, document.body.scrollHeight);
        }

        /* ---------- BOOT TYPEWRITER ---------- */
const bootText =
`Welcome to the SDSG command line
Use 'help' for commands.
Initializing CRT interface...
Loading forbidden software...
`;


        let bootIndex = 0;

        function typeBoot() {
        if (bootIndex < bootText.length) {
        output.textContent += bootText[bootIndex++];
        setTimeout(typeBoot, 30);
        } else {
        inputLine.hidden = false;
        input.focus();
        }
        }

        /* ---------- COMMAND HANDLING ---------- */
        input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
        const cmd = input.value.trim();
        print("SDSG> " + cmd);
        handleCommand(cmd);
        input.value = "";
        }
        });

        function handleCommand(cmd) {
        switch (cmd.toLowerCase()) {

        /* BASIC */
case "help":
    print("Available commands:");
    print("help   start   src   tree    clear");
    print("");
    print("Hidden / unsafe commands:");
    print("sudo   rm -rf /   glitch   debug   secrets");
    print("");
    print("Use at your own risk.");
    break;


        case "clear":
        output.textContent = "";
        break;

        case "src":
        print(src);
        break;


case "tree":
    print(".");
    print("└── src");
    print("    ├── intro");
    print("    └── pai");
    print("        ├── assets");
    print("        │   └── games");
    print("        ├── PREMIUM");
    print("        │   └── premium-games");
    print("        ├── about");
    print("        ├── modding");
    print("        ├── changelogs");
    print("        ├── status");
    print("        ├── contact");
    print("        ├── ifweb");
    print("        └── sdk");
    break;




        /* START SEQUENCE */
    case "start":
    const premiumActive = localStorage.getItem("SDSG") === "active";

    const steps = [
        "Launching SDSG...",
        "Loading assets...",
        "Scanning directories...",
        "Checking PREMIUM licenses...",
        premiumActive
            ? "PREMIUM license: YES"
            : "PREMIUM license: NO",
        "Compiling WebAssembly...",
        "Linking HTML5 modules...",
        "Verifying integrity...",
        "Verification passed (somehow)",
        "Initializing games...",
        "Finalizing launch...",
        "SDSG Launched! Enjoy."
    ];

    steps.forEach((msg, i) => {
        setTimeout(() => print(msg), i * 800);
    });

    setTimeout(() => {
        window.location.href = "./pai/load.html";
    }, steps.length * 800 + 500);
    break;

        /* SECRET COMMANDS */
        case "sudo":
        print("permission denied");
        break;

        case "sudo start":
        print("nice try");
        break;

        case "rm -rf /":
        print("kernel panic (just kidding)");
        break;

        case "secrets":
        print("you were not supposed to find this");
        break;

        case "debug":
        print("debug mode enabled");
        print("nothing actually changed");
        break;

        case "glitch":
        for (let i = 0; i < 6; i++) {
        setTimeout(() => {
        print(Math.random().toString(36).slice(2));
        }, i * 150);
        }
        break;

        case "":
        break;

        default:
        print("Unknown command: " + cmd);
        }
        }

        /* ---------- START ---------- */
        window.onload = typeBoot;