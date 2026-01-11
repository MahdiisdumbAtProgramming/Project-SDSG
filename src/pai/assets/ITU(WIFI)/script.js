function activateCode(){const userInput=document.getElementById("inputField").value.toUpperCase();if(urlMappings[userInput]){window.open(urlMappings[userInput]);return}
if(alertMappings[userInput]){alert(alertMappings[userInput]);return}
if(['NULL','NONE','NOTHING',' '].includes(userInput)){window.open('about:blank');return}
alert("Invalid code! Try again or check if the code has spaces.")}
document.getElementById("goButton").addEventListener("click",activateCode);document.getElementById("inputField").addEventListener("keypress",function(event){if(event.key==="Enter"){activateCode()}})