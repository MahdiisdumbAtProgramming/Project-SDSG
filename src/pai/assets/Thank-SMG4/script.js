const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzO-lx0z9ThchMdvZfzYIxQ8qZpMCuDfqx19_TpmeWwwjhoKa3nc-5SCk89Mb3-78oR/exec";

function containsBadStuff(text) {
  const lower = text.toLowerCase();
  return bannedWords.some(w => lower.includes(w));
}

async function sendThanks() {
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  const btn = document.getElementById("sendBtn");

  if (!name || !message) {
    alert("Both fields. This is a memorial.");
    return;
  }

  if (name.length > 40 || message.length > 300) {
    alert("Keep it short. Say it clean.");
    return;
  }

  if (containsBadStuff(name) || containsBadStuff(message)) {
    alert("Keep it respectful.");
    return;
  }

  btn.disabled = true;

  await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ name, message })
  });

  document.getElementById("message").value = "";
  btn.disabled = false;
  loadThanks();
}

async function loadThanks() {
  const res = await fetch(SCRIPT_URL);
  const data = await res.json();

  const wall = document.getElementById("thanks");
  wall.innerHTML = "";

  data.reverse().forEach(t => {
    if (!t.name || !t.message) return;

    const entry = document.createElement("div");
    entry.className = "entry";

    const nameEl = document.createElement("strong");
    nameEl.textContent = t.name;

    const msgEl = document.createElement("span");
    msgEl.textContent = `: ${t.message}`;

    entry.appendChild(nameEl);
    entry.appendChild(msgEl);
    wall.appendChild(entry);
  });
}

loadThanks();