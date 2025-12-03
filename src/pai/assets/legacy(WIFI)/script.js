document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("game1").onclick = function () {
        location.href = "LGV1/ui.html"; // Redirects to the ./assets path
    };
    document.getElementById("game2").onclick = function () {
        location.href = "LGV2/ui.html"; // Redirects to the ./assets path
    };
    document.getElementById("game3").onclick = function () {
        location.href = "LGV3/ui.html"; // Redirects to the ./assets path
    };
    document.getElementById("game4").onclick = function () {
        location.href = "LGV4/ui.html"; // Redirects to the ./assets path
    }
    document.getElementById("back").onclick = function () {
        location.href = "../../load.html"; // Redirects to the main page 3 directories back
    };
    document.getElementById("back1").onclick = function () {
        location.href = "../ui.html"; // Redirects to the main page 3 directories back
    };
});