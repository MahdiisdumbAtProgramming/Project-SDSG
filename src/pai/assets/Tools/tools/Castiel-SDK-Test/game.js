let logoImage = null;
Castiel.game({
    init() {
        Castiel.log('Game initialized');
	Castiel.speak("I scratch and sniff my balls");
 Castiel.loadImage("./Assets/SDSG-Logo.jpeg", (img) => {
            logoImage = img;
            Castiel.log("Logo loaded");
        });
    },

    update(dt) {
 if (!logoImage) return; // not loaded yet, calm down

      Castiel.drawImage(logoImage, 0, 0, 512, 512);

        // dt = delta time in seconds
    }
});