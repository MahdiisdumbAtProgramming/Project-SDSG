document.getElementById('rollButton').addEventListener('click', function() {
    const message = document.getElementById('message');
    const originalText = message.textContent;

    // Set "woah" text during the roll
    message.textContent = 'woah';

    // Perform the barrel roll
    document.body.classList.add('barrel-roll');

    setTimeout(() => {
        document.body.classList.remove('barrel-roll');

        // Alternate messages after the roll
        if (originalText === 'You will never make it in life.') {
            message.textContent = 'You are just an idiot';
        } else {
            message.textContent = 'You will never make it in life.';
        }
    }, 1000); // Duration matches the CSS animation duration
});
