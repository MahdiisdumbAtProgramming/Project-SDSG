// ====== Photon App metadata ======
const REALTIME_APP_ID = "2fa01420-fbde-462b-8b58-08b14a12046b";
const REALTIME_APP_VERSION = "1.0";
const DEFAULT_REGION = "us";
const DEFAULT_ROOM_NAME = "Marcord-Realtime";
const TEXT_EVENT_CODE = 101;
const HEARTBEAT_EVENT_CODE = 254;
const HEARTBEAT_INTERVAL = 2000;
let heartbeatIntervalId;

// ====== Initializer ======
function initRealtimeClient(userId) {
    const c = new Photon.LoadBalancing.LoadBalancingClient(
        Photon.ConnectionProtocol.Wss,
        REALTIME_APP_ID,
        REALTIME_APP_VERSION
    );
    c.setUserId(userId);
    return c;
}
function startHeartbeat() {
    // Clear any existing interval
    if (heartbeatIntervalId) clearInterval(heartbeatIntervalId);

    heartbeatIntervalId = setInterval(() => {
        if (realtimeClient?.isJoinedToRoom()) {
            try {
                // Send invisible heartbeat event (silent)
                realtimeClient.raiseEvent(
                    HEARTBEAT_EVENT_CODE,
                    { ts: Date.now() },
                    { receivers: Photon.LoadBalancing.Constants.ReceiverGroup.MasterClient }
                );

                // Log visible debug message
                const debugMsg = "server_sdsg_marcord_heartbeat = serverkeptalive";
                logDebug(debugMsg);

            } catch (err) {
                // Ignore errors silently
            }
        }
    }, HEARTBEAT_INTERVAL);
}
function sendImage() {
    const input = document.getElementById("imgInput");
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (file.size > 5 * 1024 * 1024) { // 5MB max
        alert("Image too large (max 5MB)");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);

    // Replace /upload_image with your server/CDN endpoint
    fetch("/upload_image", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.url) {
                const payload = { sender: userId, imageUrl: data.url };
                realtimeClient.raiseEvent(TEXT_EVENT_CODE, payload, {
                    receivers: Photon.LoadBalancing.Constants.ReceiverGroup.All
                });
                logDebug(`Sent image: ${data.url}`);
            }
        })
        .catch(err => {
            logDebug("Image upload failed: " + err.message);
        });

    input.value = "";
}

function dumpTelemetry() {
    const blob = new Blob([JSON.stringify(telemetry, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `telemetry_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function send() {
    const input = document.getElementById("msg");
    const msg = input.value;

    if (msg.trim() === "") {
        logMessage(userId, "[empty message]");
        logTelemetry("messages", {
            direction: "outbound",
            eventCode: TEXT_EVENT_CODE,
            sender: userId,
            message: "[empty]"
        });
        input.value = "";
        return;
    }

    if (msg.length > 512) {
        logMessage(userId, "[message too long — not sent]");
        logTelemetry("errors", {
            type: "send",
            code: "MessageTooLong",
            message: msg
        });
        alert("Message too long. Try shortening it.");
        return;
    }

    if (realtimeClient?.isJoinedToRoom()) {
        const payload = { sender: userId, message: msg };
        realtimeClient.raiseEvent(TEXT_EVENT_CODE, payload, {
            receivers: Photon.LoadBalancing.Constants.ReceiverGroup.All
        });
        logTelemetry("messages", {
            direction: "outbound",
            eventCode: TEXT_EVENT_CODE,
            sender: userId,
            message: msg
        });
        input.value = "";
    } else {
        logMessage(userId, "[send failed — not in a room]");
        logTelemetry("errors", {
            type: "send",
            code: "NotInRoom",
            message: msg
        });
    }
}
