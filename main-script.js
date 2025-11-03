// Wait for the page to load
document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Welcome Animation Logic (Unchanged) ---
    const overlay = document.getElementById('welcome-overlay');
    const mainContent = document.getElementById('main-content');
    
    if (overlay) { 
        mainContent.style.opacity = '0';

        setTimeout(() => {
            overlay.classList.add('visible');
        }, 100);

        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 2500);

        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.classList.add('visible');
            
            AOS.init({
                duration: 600,
                once: true,
                easing: 'ease-in-out-sine',
            });
        }, 3000);
        
    } else {
    // If there's no overlay, just show the content immediately
    mainContent.style.opacity = '1';
    mainContent.classList.add('visible');

    // And then initialize AOS
    AOS.init({
        duration: 600,
        once: true,
        easing: 'ease-in-out-sine',
    });
}
    // --- 2. Wish Card Gallery Logic (Unchanged) ---
    const cardImageEl = document.getElementById('card-image');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (cardImageEl) { 
        const cardImages = [
            '1.png', 
            '2.png',
            '3.png',
            '4.png',
            '5.jpg'
        ];
        let currentCardIndex = 0;

        nextBtn.addEventListener('click', function() {
            currentCardIndex++;
            if (currentCardIndex >= cardImages.length) {
                currentCardIndex = 0;
            }
            cardImageEl.src = cardImages[currentCardIndex];
        });

        prevBtn.addEventListener('click', function() {
            currentCardIndex--;
            if (currentCardIndex < 0) {
                currentCardIndex = cardImages.length - 1;
            }
            cardImageEl.src = cardImages[currentCardIndex];
        });
    }

    // --- 3. Custom Audio Player Logic (Unchanged) ---
    const audioPlayer = document.getElementById('birthday-audio');
    const playerWrapper = document.getElementById('audio-player-wrapper');
    const playIcon = document.getElementById('play-pause-icon');

    if (playerWrapper) {
        playerWrapper.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playerWrapper.classList.add('playing');
                playIcon.classList.remove('fa-play-circle');
                playIcon.classList.add('fa-pause-circle');
            } else {
                audioPlayer.pause();
                playerWrapper.classList.remove('playing');
                playIcon.classList.add('fa-play-circle');
                playIcon.classList.remove('fa-pause-circle');
            }
        });

        audioPlayer.addEventListener('ended', function() {
            playerWrapper.classList.remove('playing');
            playIcon.classList.add('fa-play-circle');
            playIcon.classList.remove('fa-pause-circle');
        });
    }
    
    // --- 4. Modal Pop-up Logic (Unchanged) ---
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (modalBackdrop) { 
        modalCloseBtn.addEventListener('click', function() {
            modalBackdrop.classList.add('hidden');
        });

        modalBackdrop.addEventListener('click', function(event) {
            if (event.target === modalBackdrop) {
                modalBackdrop.classList.add('hidden');
            }
        });
    }
});

// --- GLOBAL MODAL FUNCTION (THIS IS UPDATED) ---
const giftMessages = {
    'iphone': {
        title: "Here is your orange new iphone pro max!",
        text: "Ab derr se reply kiya to samajh lena 😊💕!",
        image: "iphone.png" // <-- ADD YOUR IMAGE FILENAME
    },
    'bike': {
        title: "Here is your orange KTM duke!",
        text: "Sach sach batao, ye bike tumhe ladkiya ghumane ke liye chahiye thi na? 😒",
        image: "duke.png" // <-- ADD YOUR IMAGE FILENAME
    },
    'cologne': {
        title: "Dior sauvage here you go!",
        text: "Looks good! sath me baith ke peete hai? 😋",
        image: "dior.png" // <-- ADD YOUR IMAGE FILENAME
    },
    'watch': {
        title: "ye lo Rolex!",
        text: "You told me you like watches. I like them too! ",
        image: "rolex.jpg" // <-- ADD YOUR IMAGE FILENAME
    },
    'certificate': {
        title: "Certificate of Being Best Boyfriend",
        text: "It's time I give it to you! uwu",
        image: "cert.png" // <-- ADD YOUR IMAGE FILENAME
    }
};

const moodMessages = {
    'happy': {
        title: "YAY! I'm so happy you're happy!",
        text: "Your happiness is my favorite thing in the world. Let's celebrate! Tell me all about it, I want to hear every detail."
        // No image needed for moods
    },
    'sad': {
        title: "Aw, baby... I'm sending you a hug.",
        text: "I'm wrapping my arms around you right now. Remember that I'm always here for you, no matter what. It's okay to feel sad. Just know you're not alone. I love you so, so much."
    },
    'stuck': {
        title: "I get that feeling. It's the worst.",
        text: "Don't be hard on yourself. Just take a deep breath. You're the smartest and most capable person I know. You've figured out tough things before, and you'll figure this out too. Want to talk it out? I'm all ears."
    }
};

function showMessage(type, key) {
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    // --- NEW: Get the image element ---
    const modalImage = document.getElementById('modal-image');
    
    let message = {};

    if (type === 'gift') {
        message = giftMessages[key];
        // --- NEW: Set the image source and make it visible ---
        modalImage.src = message.image;
        modalImage.style.display = 'block';
    } else if (type === 'mood') {
        message = moodMessages[key];
        // --- NEW: Hide the image if it's a mood message ---
        modalImage.style.display = 'none';
    }

    modalTitle.textContent = message.title;
    modalText.textContent = message.text;
    modalBackdrop.classList.remove('hidden');
}