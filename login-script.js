document.addEventListener("DOMContentLoaded", function() {

    // --- !!! IMPORTANT !!! ---
    // --- SET YOUR PASSWORD HERE ---
    const correctPassword = "0911"; // Change this to your actual 4-digit password!
    // --------------------------

    const passwordGate = document.getElementById('password-gate');
    const loginContainer = document.querySelector('.login-container'); // Get the box
    const keypadButtons = document.querySelectorAll('.keypad-btn');
    const starIndicators = document.querySelectorAll('.star');
    const errorMessage = document.getElementById('error-message');

    let enteredPasscode = ""; // Stores the current input from the keypad

    // --- 1. Confetti Setup ---
    const confettiSettings = {
        target: 'confetti-canvas',
        max: 150,
        size: 1.5,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[255,164,164],[255,189,189],[225,149,171],[186,223,219]],
        clock: 25,
        rotate: true,
        start_from_edge: false,
        respawn: true
    };
    const confetti = new ConfettiGenerator(confettiSettings);

    // --- 2. Keypad Logic ---
    keypadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.textContent.trim(); 

            if (this.classList.contains('clear-btn')) {
                enteredPasscode = enteredPasscode.slice(0, -1);
            } else if (this.classList.contains('submit-btn')) {
                checkPasscode();
                return; 
            } else {
                if (enteredPasscode.length < correctPassword.length) {
                    enteredPasscode += value;
                }
            }
            updateStars(); 
            errorMessage.textContent = ''; 
        });
    });

    function updateStars() {
        starIndicators.forEach((star, index) => {
            if (index < enteredPasscode.length) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    function checkPasscode() {
        if (enteredPasscode.length === correctPassword.length) { 
            if (enteredPasscode === correctPassword) {
                // Correct!
                confetti.render(); 
                document.getElementById('password-gate').style.display = 'none'; 
                setTimeout(function() {
                    window.location.href = "home.html"; 
                }, 2000); 
            } else {
                // Wrong!
                errorMessage.textContent = 'Oops! ?';
                enteredPasscode = ""; 
                updateStars();

                // --- CUTE IDEA 8: Trigger the "shake" animation ---
                loginContainer.classList.add('shake-error');
                // Remove the class after the animation finishes
                setTimeout(() => {
                    loginContainer.classList.remove('shake-error');
                }, 400); // 400ms matches the animation duration
            }
        } else {
            if (enteredPasscode.length > 0) {
                errorMessage.textContent = `Please enter ${correctPassword.length} digits.`;
            }
        }
    }

    // Initialize stars on load
    updateStars();
});