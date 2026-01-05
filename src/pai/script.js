document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("game").onclick = function () {
        location.href = "assets/ui.html";
    };
    document.getElementById("readme").onclick = function () {
        location.href = "readme/run.html";
    };
    document.getElementById("about").onclick = function () {
        location.href = "about/run.html";
    };
    document.getElementById("contact").onclick = function () {
        location.href = "contact/run.html";
    };
    document.getElementById("changelogs").onclick = function () {
        location.href = "changelogs/run.html";
    };
    document.getElementById("gameOG").onclick = function () {
        location.href = "legacy/run.html";
    };
    document.getElementById("status").onclick = function () {
        location.href = "./status/status.html";
    };
    document.getElementById("notice").onclick = function () {
        alert("These Games are made by a single guy Mahdi(Mahdiisdumb) even though mahdi studios exists I mahdi am making all of them please be kind when sumbitting ideas or bugs THANK YOU :P");
    };
    document.getElementById("gamesend").onclick = function () {
        location.href = "https://forms.gle/nuUxiUZ5Q6aothxw6";
    };
    document.getElementById("SDK").onclick = function () {
        location.href = "./sdk/SDK.html";
    };
    document.getElementById("mod").onclick = function () {
        location.href = "./Modding/modding.pdf";
    };
        document.getElementById("web").onclick = function () {
        location.href = "./ifweb/run.html";
    };
    document.getElementById("P").onclick = function () {
    location.href = "./PREMIUM/run.html";
    }
    const today = new Date();
    const month = today.getMonth(); // 0-indexed: October = 9, November = 10
    const day = today.getDate();

    // Show Mahdiisdumb button only on November 21
    const mahdiBtn = document.getElementById("Mahdiisdumb");
    if (month === 10 && day === 21) {
        mahdiBtn.style.display = "block";
        mahdiBtn.onclick = function () {
            alert("Today is Mahdiisdumbs Birthday November 21 first");
        };
    } else {
        mahdiBtn.style.display = "none";
    }

    // Show Project SDSG button only on October 15
    const sdsgBtn = document.getElementById("Project SDSG");
    if (month === 9 && day === 15) {
        sdsgBtn.style.display = "block";
        sdsgBtn.onclick = function () {
            alert("2024 October 15th is when I started this as a usb read the about section for more details");
        };
    } else {
        sdsgBtn.style.display = "none";
    }
});
    document.getElementById("april fools").onclick = function () {
    alert("April Fools! There's no such feature. Are you a gooner stop watching porn enjoy the real SDSG!");
    }
