function activateCode() {
    const userInput = document.getElementById("inputField").value.toUpperCase();
    const FRIENDS = "Luke, Adien, Henrik, Mathhew, Alex, Chadwick, Oscar, Andrew, Christopher, Amaan & ETC";
    const NAME = "Mahdi (its a code same with Mahdiisdumb)";
    const TEST = "TEST";
    const urlMappings = {
        'OBJ': 'https://en.wikipedia.org/wiki/Cube',
        'R': 'https://www.youtube.com/watch?v=BzNzgsAE4F0',
        'F': 'https://www.youtube.com/watch?v=fzvp0gLeUg0',
        'MAHDI': 'https://yt3.ggpht.com/x-nX6k9kv3ylOT-0lQLlALiziegQ68vIALS2TvocHUGiAg5TPAg5bg3oWiGNw89wPuEaNxfZ=s600-c-k-c0x00ffffff-no-rj-rp-mo',
        'MAHDIISDUMB' : 'https://yt3.ggpht.com/x-nX6k9kv3ylOT-0lQLlALiziegQ68vIALS2TvocHUGiAg5TPAg5bg3oWiGNw89wPuEaNxfZ=s600-c-k-c0x00ffffff-no-rj-rp-mo',
        'FIS': 'https://th.bing.com/th/id/OIP.O_neWxr7QXSx4KQ1ETbGdQHaGQ?rs=1&pid=ImgDetMain',
        'AI': 'https://deep.ai',
        '?': 'https://th.bing.com/th/id/R.dc9a456a6e1853a2a2d589fb418b1aec?rik=uj5lX47WbFNu8Q&riu=http%3a%2f%2fpngimg.com%2fuploads%2fquestion_mark%2fquestion_mark_PNG56.png&ehk=GKfPp0ASc7HDc2Z4i0kM7rFfsIu%2b0xzYSIpmAA%2btuSI%3d&risl=&pid=ImgRaw&r=0',
        '11212012': 'https://th.bing.com/th/id/OIP.FOSYYnz5olEfrm8_KNN4_QHaEa?rs=1&pid=ImgDetMain',
        'THICKOFIT': 'https://www.youtube.com/watch?v=At8v_Yc044Y'
        ,'11212012M': 'https://static.vecteezy.com/system/resources/previews/014/585/773/large_2x/gold-unlocked-padlock-png.png',
        '2009': 'https://www.youtube.com/watch?v=r-8Tts7Ui8E',
        '50S': 'https://www.youtube.com/watch?v=khKdXTmbhDw',
        '60S': 'https://www.youtube.com/watch?v=lYybQXo9P1k',
        'BOOKS': 'https://www.youtube.com/watch?v=hLljd8pfiFg',
        'CHINA': 'https://www.youtube.com/watch?v=OjNpRbNdR7E',
        'MC-CHINA': 'https://www.youtube.com/watch?v=L6ZkEWHoAPA', 
        'MC-THICKOFIT': 'https://www.youtube.com/watch?v=_PZ6puTqcaU',
        'MC-THICKOFIT-NB': 'https://www.youtube.com/watch?v=oQWk_OxlVzY',
        'WS-F': 'https://www.youtube.com/watch?v=zcmt3xhsGmk',
        'WS-S': 'https://www.youtube.com/watch?v=3NlkqN3O1MU',
        'PTPD': 'https://www.youtube.com/watch?v=rK_ErKHeWn0',
        'STILLWATER': 'https://www.youtube.com/watch?v=Ij_Y6v-gO2Y',
        'LOST-MY-DAWG': 'https://www.youtube.com/watch?v=qjMInvuHQX8',
        'FLW': 'https://www.youtube.com/watch?v=f5D764o-AuY',
        'IAMSTEVE': 'https://www.youtube.com/watch?v=VTFnV14MOsk',
        'C418': 'https://www.youtube.com/watch?v=MSepOYJxB64',
        'DRBLUD': 'https://www.youtube.com/@BloodyBludDoctor',
        'HTML': 'https://th.bing.com/th/id/OIP.744mxzC5wmuJwSAv6Ej3XwHaHa?rs=1&pid=ImgDetMain',
        'GLAZER': 'https://th.bing.com/th/id/OIP.PqfT9sznTmVadF26rcNnOAHaEK?rs=1&pid=ImgDetMain',
        'C#': 'https://th.bing.com/th/id/OIP.MglfprZy1rJEVY0_adMe1QHaHa?rs=1&pid=ImgDetMain',
        'MILK': 'https://youtu.be/rWq2iT0v_nU',
        'GO': 'https://th.bing.com/th/id/OIP.g_p1Vs9c6Hxekv4Asy5h5wHaHa?rs=1&pid=ImgDetMain',
        'GO!': 'https://th.bing.com/th/id/OIP.g_p1Vs9c6Hxekv4Asy5h5wHaHa?rs=1&pid=ImgDetMain',
        'CHILLGUY': 'https://th.bing.com/th/id/OIP.EF60kdRbWB406ChvHEv52gHaG5?rs=1&pid=ImgDetMain',
       };
    const alertMappings = {
        'AUTHOR': 'You Will NEVER FIND HIM!',
        'SKIBIDITOILET': 'U BRAIN ROTTED PERSON SKIBIDI TOILET IS TRASH SAME WITH LUNCHLY AND PRIME AND THICK OF IT I MAKE THICKOFIT A CODE AS A JOKE!',
        'FREINDS': FRIENDS,
        'NAME': NAME,
        'T': TEST,
        'MY-CHEESE-DRIPPY': 'LUCHABLES BETTER',
        'LUNCHLY': 'LUCHABLES BETTER',
        'WHO-WHERE-WHEN': '?', 
        'KAKA': '💩',
        'NIEN': 'Ooh u little german guy'
    };
    if (urlMappings[userInput]) {
        window.open(urlMappings[userInput]);
        return;
    }
    if (alertMappings[userInput]) {
        alert(alertMappings[userInput]);
        return;
    }
    if (['NULL', 'NONE', 'NOTHING', ' '].includes(userInput)) {
        window.open('about:blank');
        return;
    }
    alert("Invalid code! Try again or check if the code has spaces.");
}
document.getElementById("goButton").addEventListener("click", activateCode);
document.getElementById("inputField").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        activateCode();
    }
});
