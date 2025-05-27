document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("game").onclick = function () {
        location.href = "assets/ui.html"; // Redirects to the legacy path
    };
    document.getElementById("readme").onclick = function () {
        location.href = "readme/run.html"; // Redirects to the readme page
    };
    document.getElementById("about").onclick = function () {
        location.href = "about/run.html"; // Redirects to the about page
    };
    document.getElementById("contact").onclick = function () {
        location.href = "contact/run.html"; // Redirects to the contact page
    };
    document.getElementById("changelogs").onclick = function () {
        location.href = "changelogs/run.html"; // Redirects to the changelogs page
    };
    document.getElementById("gameOG").onclick = function () {
        location.href = "assets/legacy(WIFI)/run.html"; // Redirects to the legacy path
    };
    document.getElementById("status").onclick = function () {
        location.href = "./status/status"; // Redirects to the legacy path
    };
});