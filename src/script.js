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

        function typeBoot() {
        print(bootText);
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
    const games = [
    "AoOni",
    "Appel",
    "Arena",
    "BELTAGOON",
    "Bomb-Tag",
    "calc",
    "Cave-Communications",
    "CeaserCipher",
    "ChinesePVZ",
    "ClickCounter",
    "CookieClicker",
    "CPS",
    "CrazyCattle3D",
    "DANK-FLOWEY",
    "Diddy",
    "echovr2d",
    "Fish",
    "FlappyBird",
    "FlipAMeanGuy",
    "freemoney",
    "Geometry-Dash-(ASS)",
    "Goofy-Goober",
    "Half-Price",
    "ITU(WIFI)",
    "Kabby-Lame-Ahh",
    "legacy(WIFI)",
    "Level-Gen",
    "Lore",
    "Marcord(Wifi)",
    "Mario",
    "MinecraftOffline",
    "music",
    "Omega-Flowey",
    "Pac-Man",
    "Parry-Sim",
    "Perlin-Noise",
    "Platformer",
    "Ransomware",
    "Raycaster-Engine",
    "Redirect-Test",
    "Relegioustext",
    "RenderEngine",
    "RisingShepTone",
    "Scampton",
    "SDKTEST",
    "Sitetest",
    "Slope",
    "Snake",
    "SnowRider3D",
    "Soundbuttons",
    "SpaceInvaders",
    "Tag",
    "VoxelTest",
    "WEARE1",
    "WebsiteTest",
    "ZombieRaid",
    "ZombyecareVsMahdiStudios"
];
const premiumGames = [
    "BaldisBaisics",
    "BaldisPlus",
    "bergentruck",
    "Deltatraveler",
    "karlson",
    "Minesweeperplus",
    "OGFNF",
    "PeoplePlayground",
    "PizzaTower",
    "raft",
    "slender",
    "Sonic.EXE",
    "UCN",
    "UltraKill",
    "UNDERTALE-and-DELTARUNE"
];
const steps = [
    "Launching SDSG...",
    "Loading assets...",
    "Scanning directories...",
    "Detecting games...",
    `Found BASIC GAMES: ${games.join(", ")}`,
    premiumActive
        ? `PREMIUM license: YES\nDetecting PREMIUM games...\nFound PREMIUM GAMES: ${premiumGames.join(", ")}`
        : "PREMIUM license: NO",
    "Compiling WebAssembly...",
    "Loading user data...",
    "High score data loaded.",
  "Changelogs verified to your version.",
  "Mahdiisdumb says if any problem occurs contact us.",
  "All set!",
    "Finalizing launch...",
    "SDSG Launched! Enjoy.",
    "Redirecting...",
    "while Redirecting, remember to check out Mahdiisdumbs github github.com/Mahdiisdumb",
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