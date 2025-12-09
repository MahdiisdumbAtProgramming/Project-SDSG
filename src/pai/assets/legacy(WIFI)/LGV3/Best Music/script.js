jQuery("document").ready(function($) {

  $('.btn-run').click(function() {

    /*Sets up buttons*/
    $('.button').addClass('btn-nope'); //Makes sure 'run' can't be clicked again
    $('.btn-mute').addClass('btn-mute-visible'); //Show the mute button
    $('.btn-mute').click(function() {
      $(this).toggleClass('disable');
    });

    //Sets up the initial audio context
    context = new AudioContext();

    var oscAmt = 10; //Amount of oscillators (10 by default)
    var freqX = [4000 * 2]; //Starting oscillator frequency in hz * 2
    var lowestFreq = 50; //Lowest outputted frequency (seperate from what is generated)
    var highestFreq = 16000; //Highest outputted frequency (seperate from what is generated)
    var gainVal = 0.02; //Sets gain value. Keep low!

    var comp1 = context.createDynamicsCompressor(); //sets compressor node in a variable
    var analyser = context.createAnalyser(); //Sets analyser node in a variable

    var osc = []; //Array where amount of oscilators are stored.
    var gain = []; //Array where amount of gain nodes are stored.
    for (i = 1; i <= oscAmt; i++) {
      osc[i] = context.createOscillator(); //Creating the oscillators
      osc[i].type = 'sine'; //Set oscillator wave types
      freqX[i] = freqX[i - 1] / 2; //Differentiates new oscillator hz based on previous oscillator hz / 2.
      osc[i].frequency.value = freqX[i]; //Applies frequency values to oscillators

      gain[i] = context.createGain(); //sets up all required gain notes (one for each osc)
      gain[i].gain.value = 0; //Mutes gain node initially
    }

    /*Update hz every 75ms*/
    setInterval(function() {

      for (i = 1; i <= oscAmt; i++) {

        /*Generate frequencies*/
        if (freqX[i] > 20000) {
          freqX[i] = 20;
        } else {
          freqX[i] = freqX[i] + (freqX[i] / 192); //Each loop, increase frequency by 1/192 of current value.
        }

        osc[i].frequency.value = freqX[i]; //Apply new frequency to oscillator.

        /*Set outputted frequencies*/
        if (freqX[i] > lowestFreq) {
          gain[i].gain.value = gainVal; //Only enable gain if higher than lowestFreq
        }
        if (freqX[i] > highestFreq) {
          gain[i].gain.value = 0; //Disable if higher than highestFreq
        }
        if ($('.btn-mute').hasClass('disable')) {
          gain[i].gain.value = 0; //Mute of 'disable' is added to .btn-mute.
        }

        osc[i].connect(gain[i]); //Connect each oscillator to gain node.

        gain[i].connect(comp1); //Connect gain node to compressor node
        comp1.connect(analyser);
        analyser.connect(context.destination); //Connect compressor node to destination (usually speakers)
      }

      console.log('F ' + freqX[1] + ' |M ' + freqX[2] + ' |L ' + freqX[20]); //Show useful info in console.

    }, 75);

    for (i = 1; i <= oscAmt; i++) {
      osc[i].start(0); //Initiate all of the oscillators.
    }

    /*Analyser*/

    //Setting up canvas
    var canvas = document.querySelector('.canvas');
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var canvasCtx = canvas.getContext('2d');
    console.log(context);

    //Setting up analyser
    analyser.fftSize = 4096;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
      drawVisual = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(234,234,246)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      var barWidth = (WIDTH / bufferLength) * 1.4;
      var barHeight;
      var x = 0;

      for (i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.5;
        canvasCtx.fillStyle = 'rgb(70,70,78)';
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2.5, barWidth, barHeight);

        x += barWidth;
      }

    };
    draw();

  }); //End click button

}); //End jQuery