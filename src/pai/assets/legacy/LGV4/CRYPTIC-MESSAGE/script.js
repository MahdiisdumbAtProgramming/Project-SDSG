document.getElementById("goButton").addEventListener("click", function() {
    const userInput = document.getElementById("inputField").value.toUpperCase();

    if (userInput === "IF YOU HAVE SEEN THIS MESSAGE YOU HAVE WON") {
        alert("YOU HAVE WON");
    } else { 
        alert("YOUR GOOFY AHH GOT IT WRONG");
    }
});
