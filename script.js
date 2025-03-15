const fruits = ["🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🥝", "🍅", "🥑", "🥧", "🍕", "🍔", "🍟", "🍩", "🍪", "🍫"];
const slots = document.querySelectorAll(".slot");
const button = document.getElementById("play");
const state = document.getElementById("state");
const multiplierDisplay = document.getElementById("multiplier");
const scoreDisplay = document.getElementById("score");

let multiplier = 1;
let score = 50;
let lastResult = null; // Tracks the last game result ("win", "close", or "lose")
let isSpinning = false;
let gameOver = false;

// Function to spin the slots
function spinSlots() {
    if (isSpinning || gameOver) return;
    isSpinning = true;

    let completed = 0;
    state.textContent = "🎰 Spinning... 🎰";
    state.style.color = "black";

    slots.forEach((slot, index) => {
        const spins = Math.floor(Math.random() * 10) + 5; // Random number of spins
        let counter = 0;

        const spinInterval = setInterval(() => {
            slot.textContent = fruits[Math.floor(Math.random() * fruits.length)];
            counter++;

            if (counter >= spins) {
                clearInterval(spinInterval);
                completed++;

                // Check if all slots have finished spinning
                if (completed === slots.length) {
                    setTimeout(() => {
                        checkWin();
                        isSpinning = false;
                    }, 200); // Small delay before checking the result
                }
            }
        }, 100); // Spin every 100ms
    });
}

// Function to check the result of the spin
function checkWin() {
    const [firstEmoji, secondEmoji, thirdEmoji] = Array.from(slots).map(slot => slot.textContent);

    state.textContent = "😔 You did not win! Try again! 😔";
    state.style.color = "black";
    score -= 10; // Deduct points for each spin

    if (firstEmoji === secondEmoji && secondEmoji === thirdEmoji) {
        // Jackpot win (all three emojis match)
        state.textContent = "🎉 JACKPOT! 🎉 You won BIG! 🎰";
        state.style.color = "green";
        handleWin(100); // Award 100 points multiplied by the multiplier
        lastResult = "win";
    } else if (firstEmoji === secondEmoji || secondEmoji === thirdEmoji || firstEmoji === thirdEmoji) {
        // Close match (two emojis match)
        state.textContent = "🥲 So close! Keep going! 🥲";
        state.style.color = "orange";
        handleWin(50); // Award 50 points multiplied by the multiplier
        lastResult = "close";
    } else {
        // Loss (no matches)
        lastResult = "lose";
        multiplier = 1; // Reset multiplier on loss
    }

    updateDisplay();

    if (score <= 0) {
        endGame();
    }
}

// Function to handle wins and update the multiplier
function handleWin(points) {
    if (lastResult === "win" || lastResult === "close") {
        multiplier++; // Increment multiplier on consecutive wins or close matches
    } else {
        multiplier = 1; // Reset multiplier if the last result was a loss
    }
    score += points * multiplier; // Add points multiplied by the multiplier
}

// Function to update the display with current score and multiplier
function updateDisplay() {
    multiplierDisplay.textContent = `🔥 Multiplier: x${multiplier} 🔥`;
    scoreDisplay.textContent = `💰 Score: ${score} 💰`;
}

// Function to end the game when the score reaches 0
function endGame() {
    gameOver = true;
    state.textContent = "💀 GAME OVER! 💀 No more points!";
    state.style.color = "red";
    button.textContent = "🔄 Restart Game";
    button.onclick = restartGame;
}

// Function to restart the game
function restartGame() {
    score = 50;
    multiplier = 1;
    lastResult = null;
    gameOver = false;
    state.textContent = "🎰 Spin to Win! 🎰";
    state.style.color = "black";
    button.textContent = "Play";
    button.onclick = spinSlots;
    updateDisplay();
}

// Event listener for the play button
button.addEventListener("click", spinSlots);
