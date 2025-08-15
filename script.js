// Game state management
let gameProgress = 0;
let maxProgress = 4;
let isGameCompleted = false;

// Audio management
const backgroundMusic = document.getElementById("background-music");
const playButton = document.getElementById("play-music");
const pauseButton = document.getElementById("pause-music");

// Play music from 30 seconds
playButton.addEventListener("click", () => {
    backgroundMusic.currentTime = 98; // set to 30 seconds (change as needed)
    backgroundMusic.play();
});

pauseButton.addEventListener("click", () => {
    backgroundMusic.pause();
});

// Web Audio API for custom birthday music
let audioContext;
let musicOscillator;
let musicGain;
let isPlaying = false;

// Create a fun birthday tune using Web Audio API
// function createBirthdayMusic() {
//     try {
//         if (!audioContext) {
//             audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         }

//         // Resume audio context if it's suspended
//         if (audioContext.state === 'suspended') {
//             audioContext.resume();
//         }

//         // Create oscillator for melody
//         musicOscillator = audioContext.createOscillator();
//         musicGain = audioContext.createGain();

//         // Happy birthday melody frequencies (simplified)
//         const melody = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63]; // C C D C F E
//         let noteIndex = 0;

//         musicOscillator.type = 'sine';
//         musicOscillator.frequency.setValueAtTime(melody[0], audioContext.currentTime);

//         // Create a pleasant volume envelope
//         musicGain.gain.setValueAtTime(0.1, audioContext.currentTime);

//         // Connect audio nodes
//         musicOscillator.connect(musicGain);
//         musicGain.connect(audioContext.destination);

//         // Play melody notes in sequence
//         const playNextNote = () => {
//             if (isPlaying && noteIndex < melody.length) {
//                 musicOscillator.frequency.setValueAtTime(melody[noteIndex], audioContext.currentTime);
//                 noteIndex = (noteIndex + 1) % melody.length;
//                 setTimeout(playNextNote, 800); // Play each note for 800ms
//             }
//         };

//         musicOscillator.start();
//         playNextNote();

//         return musicOscillator;
//     } catch (error) {
//         console.error('Audio creation failed:', error);
//         return null;
//     }
// }

function stopBirthdayMusic() {
    try {
        if (musicOscillator) {
            musicOscillator.stop();
            musicOscillator = null;
        }
        isPlaying = false;
    } catch (error) {
        console.log("Audio stop error:", error);
        isPlaying = false;
    }
}

// Page navigation
function navigateToPage(pageId) {
    // Hide all pages
    if (pageId == "memories") {
        const content = document.getElementById("myContent");
        content.style.display = "block";
    }

    if (pageId == "welcome") {
        const content = document.getElementById("myContent");
        content.style.display = "none";
    }

    document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
    });

    // Show target page
    document.getElementById(pageId).classList.add("active");

    // Update navigation buttons
    document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.remove("active");
    });

    document.querySelector(`[data-page="${pageId}"]`).classList.add("active");

    // Stop music when leaving memories page
    if (pageId !== "memories" && isPlaying) {
        pauseMusic();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Initialize navigation
document.addEventListener("DOMContentLoaded", function () {
    // Set up navigation buttons
    document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            const pageId = this.getAttribute("data-page");
            if (pageId === "gifts" && !isGameCompleted) {
                alert(
                    "Complete the discovery challenge first to unlock the gifts!",
                );
                return;
            }
            navigateToPage(pageId);
        });
    });

    // Initialize first page
    navigateToPage("welcome");

    // Set up music controls
    setupMusicControls();

    // Initialize game
    initializeGame();
});

// Music control functions
function setupMusicControls() {
    playButton.addEventListener("click", playMusic);
    pauseButton.addEventListener("click", pauseMusic);
}

function playMusic() {
    // Only start music when user explicitly clicks
    if (!isPlaying) {
        try {
            isPlaying = true;

            // Start background music (jhol song)
            if (backgroundMusic) {
                backgroundMusic.volume = 0.4;
                backgroundMusic
                    .play()
                    .catch((e) =>
                        console.log("Background music play failed:", e),
                    );
            }

            // Create custom birthday melody
            createBirthdayMusic();

            playButton.style.display = "none";
            pauseButton.style.display = "inline-flex";

            // Add visual feedback
            if (document.querySelector(".memories-header")) {
                document.querySelector(".memories-header").style.animation =
                    "gentle-pulse 2s infinite";
            }

            // Show music playing indicator
            showMusicNotification(
                "🎵 Birthday celebration music is now playing!",
            );
        } catch (error) {
            console.log("Audio creation failed:", error);
            // Try just background music
            if (backgroundMusic) {
                backgroundMusic.volume = 0.4;
                backgroundMusic
                    .play()
                    .catch((e) =>
                        console.log("Background music play failed:", e),
                    );
            }

            playButton.style.display = "none";
            pauseButton.style.display = "inline-flex";

            // Add visual feedback
            if (document.querySelector(".memories-header")) {
                document.querySelector(".memories-header").style.animation =
                    "gentle-pulse 2s infinite";
            }

            // Show music playing indicator
            showMusicNotification("🎵 Background music is playing!");
        }
    }
}

function pauseMusic() {
    // Stop custom birthday music
    stopBirthdayMusic();
    // Also pause HTML audio element if it was playing
    if (backgroundMusic) {
        backgroundMusic.pause();
    }

    pauseButton.style.display = "none";
    playButton.style.display = "inline-flex";

    // Remove animation
    if (document.querySelector(".memories-header")) {
        document.querySelector(".memories-header").style.animation = "none";
    }

    // Only show notification if music was actually playing
    if (isPlaying) {
        showMusicNotification("⏸️ Music paused");
    }
}

function showMusicNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 1000);
}

// Add CSS animation for music
const style = document.createElement("style");
style.textContent = `
    @keyframes gentle-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Game initialization and logic
function initializeGame() {
    setupPuzzle1();
    updateProgress();
}

// function setupPuzzle1() {
//     const puzzle1Buttons = document.querySelectorAll("#puzzle-1 .puzzle-btn");

//     puzzle1Buttons.forEach((btn) => {
//         btn.addEventListener("click", function () {
//             const answer = this.getAttribute("data-answer");
//             if (answer === "November") {
//                 puzzle1Buttons.forEach((b) => b.classList.add("correct"));
//                 setTimeout(() => {
//                     document.getElementById("puzzle-1").style.display = "none";
//                     document.getElementById("puzzle-2").style.display = "block";
//                     gameProgress++;
//                     updateProgress();
//                     setupPuzzle2();
//                 }, 1000);
//             } else {
//                 input.style.border = "2px solid #dc3545";
//                 showGameMessage(
//                     "Try again — your memory’s playing tricks on you! 💝",
//                 );
//             }
//         });
//     });
// }

function setupPuzzle1() {
    const puzzle1Buttons = document.querySelectorAll("#puzzle-1 .puzzle-btn");

    puzzle1Buttons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const answer = this.getAttribute("data-answer");

            if (answer === "November") {
                puzzle1Buttons.forEach((b) => b.classList.add("correct"));

                setTimeout(() => {
                    document.getElementById("puzzle-1").style.display = "none";
                    document.getElementById("puzzle-2").style.display = "block";
                    gameProgress++;
                    updateProgress();
                    setupPuzzle2();
                }, 1000);
            } else {
                this.classList.add("incorrect"); // Optional: visually show incorrect
                showGameMessage(
                    "Try again — your memory’s playing tricks on you! 💝",
                );
            }
        });
    });
}

function setupPuzzle2() {
    // This puzzle accepts multiple positive words
    const correctWords = [
        "endo effect",
        "the endo effect",
        "endowment effect",
        "the endowment effect",
    ];

    window.checkWordAnswer = function () {
        const input = document.getElementById("word-input");
        const userAnswer = input.value.toLowerCase().trim();

        if (correctWords.includes(userAnswer)) {
            // Accept any positive word or word longer than 3 characters
            input.style.border = "2px solid #28a745";
            showGameMessage("Perfect! You know me well! 😊");

            setTimeout(() => {
                document.getElementById("puzzle-2").style.display = "none";
                document.getElementById("puzzle-3").style.display = "block";
                gameProgress++;
                updateProgress();
                setupPuzzle3();
            }, 1500);
        } else {
            input.style.border = "2px solid #dc3545";
            showGameMessage("Try a word that describes something positive! 💝");
        }
    };

    // Allow Enter key to submit
    document
        .getElementById("word-input")
        .addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                checkWordAnswer();
            }
        });
}

function setupPuzzle3() {
    const numberButtons = document.querySelectorAll("#puzzle-3 .number-btn");

    numberButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const number = this.getAttribute("data-number");

            // Infinity is the "correct" answer, but all are accepted
            if (number === "infinity") {
                this.classList.add("correct");
                showGameMessage("Exactly! Our friendship is infinite! ∞");
            } else {
                this.classList.add("correct");
                showGameMessage(
                    "That's a great number, but think bigger... like infinity! ∞",
                );
            }

            setTimeout(() => {
                document.getElementById("puzzle-3").style.display = "none";
                document.getElementById("final-puzzle").style.display = "block";
                gameProgress++;
                updateProgress();
                setupFinalPuzzle();
            }, 2000);
        });
    });
}

function setupFinalPuzzle() {
    window.checkFinalCode = function () {
        const input = document.getElementById("final-code");
        const userCode = input.value.toLowerCase().trim();

        // Accept various birthday-related codes
        const correctCodes = [
            "0616",
            "616",
            "06162025",
            "birthday",
            "Sahil",
            "happy",
            "celebration",
            "party",
            "gift",
            "friend",
            "friendship",
        ];

        if (correctCodes.includes(userCode)) {
            input.style.border = "2px solid #28a745";
            showGameMessage("🎉 Congratulations! You've unlocked the gifts!");

            setTimeout(() => {
                document.getElementById("final-puzzle").style.display = "none";
                document.getElementById("game-success").style.display = "block";
                gameProgress++;
                updateProgress();
                completeGame();
            }, 1500);
        } else {
            input.style.border = "2px solid #dc3545";
            showGameMessage(
                "Try thinking about today's date or something birthday-related! 🎂",
            );
        }
    };

    // Allow Enter key to submit
    document
        .getElementById("final-code")
        .addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                checkFinalCode();
            }
        });
}

function completeGame() {
    isGameCompleted = true;

    // Enable gifts navigation
    const giftsNav = document.getElementById("gifts-nav");
    giftsNav.disabled = false;
    giftsNav.style.opacity = "1";

    // Add celebration animation
    document.body.style.animation = "celebration-background 3s ease";

    // Show completion message
    setTimeout(() => {
        alert(
            "🎊 Amazing! You've completed all challenges! The gift collection is now unlocked!",
        );
    }, 1000);
}

function updateProgress() {
    const progressFill = document.getElementById("progress-fill");
    const progressText = document.getElementById("progress-text");

    const percentage = (gameProgress / maxProgress) * 100;
    progressFill.style.width = percentage + "%";
    progressText.textContent = `${gameProgress}/${maxProgress}`;
}

function showGameMessage(message) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        z-index: 1002;
        font-size: 1.2rem;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: messagePopIn 0.3s ease;
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Add celebration background animation
const celebrationStyle = document.createElement("style");
celebrationStyle.textContent = `
    @keyframes celebration-background {
        0% { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        25% { background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%); }
        50% { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        75% { background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%); }
        100% { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    }
    
    @keyframes messagePopIn {
        from { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
`;
document.head.appendChild(celebrationStyle);

// Add smooth scrolling behavior
document.documentElement.style.scrollBehavior = "smooth";

// Add loading animation for page transitions
function addLoadingAnimation() {
    const loader = document.createElement("div");
    loader.id = "page-loader";
    loader.innerHTML = '<div class="spinner"></div>';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const spinnerStyle = document.createElement("style");
    spinnerStyle.textContent = `
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinnerStyle);
    document.body.appendChild(loader);

    return loader;
}

// Enhanced navigation with loading
function enhancedNavigateToPage(pageId) {
    const loader = addLoadingAnimation();
    loader.style.opacity = "1";

    setTimeout(() => {
        navigateToPage(pageId);
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.remove();
        }, 300);
    }, 500);
}

// Add welcome message on load
window.addEventListener("load", function () {
    setTimeout(() => {
        showWelcomeMessage();
    }, 1000);
});

function showWelcomeMessage() {
    const welcome = document.createElement("div");
    welcome.innerHTML = `
        <h3 style="margin-top: 1rem; padding: 0.5rem 0.5rem;">🎉 Happy Birthday Sahil! 🎉</h3>
        <p>I've put together a small journey for your birthday — hope it brings a smile. Ready to begin?</p>
        <button onclick="this.parentElement.remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: linear-gradient(135deg, #1a0000 0%, #6a0f0f 50%, #FFC300 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">Yes, start the journey</button>
    `;
    welcome.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255);
        padding: 2rem;
        border-radius: 15px;
        z-index: 1003;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: welcomeSlideIn 0.5s ease;
        max-width: 400px;
        color: #B8860B;
    `;

    const welcomeStyle = document.createElement("style");
    welcomeStyle.textContent = `
        @keyframes welcomeSlideIn {
            from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(welcomeStyle);
    document.body.appendChild(welcome);
}

// Add keyboard shortcuts
document.addEventListener("keydown", function (e) {
    if (e.altKey) {
        switch (e.key) {
            case "1":
                navigateToPage("welcome");
                break;
            case "2":
                navigateToPage("memories");
                break;
            case "3":
                navigateToPage("game");
                break;
            case "4":
                if (isGameCompleted) {
                    navigateToPage("gifts");
                }
                break;
        }
    }
});

// Add dynamic birthday countdown (if birthday hasn't passed)
function addBirthdayCountdown() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthday = new Date(currentYear, 5, 5); // August 16th

    // If birthday has passed this year, set it for next year
    if (today > birthday) {
        birthday.setFullYear(currentYear + 1);
    }

    const timeDiff = birthday - today;
    const daysUntilBirthday = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysUntilBirthday > 0 && daysUntilBirthday < 365) {
        const countdownDiv = document.createElement("div");
        countdownDiv.innerHTML = `
            <p>🎂 ${daysUntilBirthday} days until the next birthday celebration!</p>
        `;
        countdownDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 1rem;
            border-radius: 10px;
            z-index: 1000;
            font-size: 0.9rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            color:rgb(184, 134, 11)
        `;
        document.body.appendChild(countdownDiv);
    }
}

// Initialize countdown on load
addBirthdayCountdown();

let player;

// Expose this globally so YouTube can call it
window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("yt-video");
};

document.addEventListener("DOMContentLoaded", function () {
    const ctaBtn = document.querySelector(".ready-for-challenge");

    if (ctaBtn) {
        ctaBtn.addEventListener("click", function () {
            // Stop the video ONLY when button is clicked
            if (player && typeof player.stopVideo === "function") {
                player.stopVideo();
            }

            // Your navigation logic (if needed)
            navigateToPage("game");
        });
    }
});
