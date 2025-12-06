// ====== Audio Glyph ======
const msgSound = new Audio("msg.mp3");
msgSound.preload = "auto";
let lastServiceCall = 0;
// ====== Telemetry ======
const telemetry = {
    startTime: new Date().toISOString(),
    userId: null,
    region: null,
    calls: [],
    states: [],
    messages: [],
    errors: [],
    debug: []
};

function logTelemetry(section, data) {
    telemetry[section].push({ ts: Date.now(), ...data });
}

function wrapFunction(obj, fnName, section = "calls") {
    const original = obj[fnName];
    if (typeof original !== "function") return;
    obj[fnName] = function (...args) {
        logTelemetry(section, { fn: fnName, args });
        const result = original.apply(this, args);
        logTelemetry(section, { fn: fnName, return: result });
        return result;
    };
}

// ====== Globals ======
let realtimeClient;
let userId;
let regionCode;

// ====== UI Helpers ======
function logDebug(msg) {
    const logDiv = document.getElementById("debugLog");
    if (logDiv) {
        const line = document.createElement("div");
        line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        logDiv.appendChild(line);
        logDiv.scrollTop = logDiv.scrollHeight;
    }
    logTelemetry("debug", { message: msg });
}

function logMessage(sender, message) {
    const div = document.createElement("div");
    const timestamp = new Date().toLocaleTimeString();
    div.textContent = `[${timestamp}] ${sender}: ${message}`;
    const chatDiv = document.getElementById("chat");
    if (chatDiv) {
        chatDiv.appendChild(div);
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }
}
function updateUserList() {
    const ul = document.getElementById("usersUl");
    ul.innerHTML = "";
    const actors = realtimeClient.actors;
    for (const actorNr in actors) {
        const actor = actors[actorNr];
        const li = document.createElement("li");
        li.textContent = actor.userId || `P${actorNr}`;
        ul.appendChild(li);
    }
}

// ====== Init Realtime Client ======
function initRealtimeClient(userId) {
    const c = new Photon.LoadBalancing.LoadBalancingClient(
        Photon.ConnectionProtocol.Wss,
        REALTIME_APP_ID,
        REALTIME_APP_VERSION
    );
    c.setUserId(userId);
    return c;
}

// ====== Start Ritual ======
function start() {
    const name = document.getElementById("username").value;
    regionCode = document.getElementById("regionSelect").value || DEFAULT_REGION;
    if (!name) { alert("Please enter your name"); return; }
    userId = name;
    telemetry.userId = userId;
    telemetry.region = regionCode;

    logDebug(`Starting Realtime connection for ${userId} to region ${regionCode}`);

    realtimeClient = initRealtimeClient(userId);
    ["connectToRegionMaster", "service", "sendOperation", "raiseEvent", "joinRoom", "createRoom"].forEach(fn =>
        wrapFunction(realtimeClient, fn, "calls")
    );

    bindRealtimeEvents();
    realtimeClient.connectToRegionMaster(regionCode);

    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("chatContainer").style.display = "block";
    document.getElementById("sendBtn").onclick = send;
    document.getElementById("msg").onkeydown = (e) => { if (e.key === "Enter") send(); };
}

// ====== Start Server Ritual ======
function startServer() {
    const name = document.getElementById("username").value;
    regionCode = document.getElementById("regionSelect").value || DEFAULT_REGION;
    if (!name) { alert("Please enter your name"); return; }
    userId = name;
    telemetry.userId = userId;
    telemetry.region = regionCode;

    logDebug(`Starting Server as ${userId} in region ${regionCode}`);

    realtimeClient = initRealtimeClient(userId);
    ["connectToRegionMaster", "service", "sendOperation", "raiseEvent", "joinRoom", "createRoom"].forEach(fn =>
        wrapFunction(realtimeClient, fn, "calls")
    );

    bindRealtimeEvents(true);
    realtimeClient.connectToRegionMaster(regionCode);

    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("chatContainer").style.display = "block";
    document.getElementById("sendBtn").onclick = send;
    document.getElementById("msg").onkeydown = (e) => { if (e.key === "Enter") send(); };
}

// ====== Bind Events ======
function bindRealtimeEvents(forceCreate = false) {
    realtimeClient.onStateChange = (state) => {
        logDebug(`Realtime state: ${state}`);
        logTelemetry("states", { type: "realtime", state });

        if (state === Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby) {
            if (forceCreate) {
                logDebug(`Creating room: ${DEFAULT_ROOM_NAME}`);
                realtimeClient.createRoom(DEFAULT_ROOM_NAME, {
                    maxPlayers: 10,
                    isVisible: true,
                    isOpen: true
                });
            } else {
                logDebug(`Joining room: ${DEFAULT_ROOM_NAME}`);
                realtimeClient.joinRoom(DEFAULT_ROOM_NAME);
            }
        }

        if (state === Photon.LoadBalancing.LoadBalancingClient.State.Joined) {
            logDebug(`Joined room: ${DEFAULT_ROOM_NAME}`);
            startHeartbeat();
            updateUserList();
        }
    };

    realtimeClient.onJoinRoomFailed = (code, msg) => {
        logDebug(`Join failed — creating room: ${DEFAULT_ROOM_NAME}`);
        logTelemetry("errors", { type: "realtime", code, message: msg });
        realtimeClient.createRoom(DEFAULT_ROOM_NAME, {
            maxPlayers: 10,
            isVisible: true,
            isOpen: true
        });
    };

    realtimeClient.onPlayerJoin = (actor) => {
        logDebug(`Player joined: ${actor.userId || `P${actor.actorNr}`}`);
        updateUserList();
    };

    realtimeClient.onPlayerLeave = (actor) => {
        logDebug(`Player left: ${actor.userId || `P${actor.actorNr}`}`);
        updateUserList();
    };

    realtimeClient.onEvent = (code, content, actorNr) => {
        logDebug(`Event: code=${code}, content=${JSON.stringify(content)}, actor=${actorNr}`);
        logTelemetry("messages", {
            direction: "inbound",
            eventCode: code,
            sender: `P${actorNr}`,
            content
        });

        if (code === TEXT_EVENT_CODE && content?.message) {
            logMessage(content.sender || `P${actorNr}`, content.message);
            document.getElementById("sendImgBtn").onclick = sendImage;
            // ====== Audio Cue ======
            msgSound.currentTime = 0;
            msgSound.play().catch(err => {
                logDebug("Audio playback failed: " + err.message);
                logTelemetry("errors", { type: "audio", message: err.message });
            });
        }
    };

    realtimeClient.onError = (errorCode, errorMsg) => {
        logDebug(`Error ${errorCode}: ${errorMsg}`);
        logTelemetry("errors", { type: "realtime", code: errorCode, message: errorMsg });
    };
}

// ====== Send Message ======

// ====== Service Loop ======
function update() {
    const now = Date.now();
    if (realtimeClient?.service && now - lastServiceCall > 100) { // limit to 10 calls per second
        try {
            realtimeClient.service();
            lastServiceCall = now;
        } catch (err) {
            logDebug("Service loop error: " + err.message);
            logTelemetry("errors", { type: "service", message: err.message });
        }
    }
    requestAnimationFrame(update);
}
update();

// ====== Continuous User List Update ======
setInterval(() => {
    if (realtimeClient?.isJoinedToRoom()) updateUserList();
}, 3000);


// ====== Expose Rituals ======
window.start = start;
window.startServer = startServer;
window.dumpTelemetry = dumpTelemetry;