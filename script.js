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
let luckFactor = Math.random() * 0.6; // Luck factor (0% to 60%)

// Function to spin the slots
function spinSlots() {
    if (isSpinning || gameOver) return;
    isSpinning = true;

    let completed = 0;
    state.textContent = "🎰 Spinning... 🎰";
    state.style.color = "black";

    let firstChoice = getRandomFruit();
    let secondChoice = getRandomFruitWithLuck(firstChoice);
    let thirdChoice = getRandomFruitWithLuck(secondChoice);

    slots.forEach((slot, index) => {
        const spins = Math.floor(Math.random() * 10) + 5;
        let counter = 0;

        const spinInterval = setInterval(() => {
            slot.textContent = fruits[Math.floor(Math.random() * fruits.length)];
            counter++;

            if (counter >= spins) {
                clearInterval(spinInterval);
                completed++;

                // Assign the final result with luck applied
                if (index === 0) slot.textContent = firstChoice;
                if (index === 1) slot.textContent = secondChoice;
                if (index === 2) slot.textContent = thirdChoice;

                if (completed === slots.length) {
                    setTimeout(() => {
                        checkWin();
                        isSpinning = false;
                    }, 200);
                }
            }
        }, 100);
    });
}

// Function to get a random fruit
function getRandomFruit() {
    return fruits[Math.floor(Math.random() * fruits.length)];
}

// Function to get a random fruit with luck influence
function getRandomFruitWithLuck(previousSymbol) {
    return Math.random() < luckFactor ? previousSymbol : getRandomFruit();
}

// Function to check the result of the spin
function checkWin() {
    let [firstEmoji, secondEmoji, thirdEmoji] = Array.from(slots).map(slot => slot.textContent);
    let resultType = "lose"; 

    state.textContent = "😔 You did not win! Try again! 😔";
    state.style.color = "black";
    score -= 10; // Deduct points for each spin

    if (firstEmoji === secondEmoji && secondEmoji === thirdEmoji) {
        state.textContent = "🎉 JACKPOT! 🎉 You won BIG! 🎰";
        state.style.color = "green";
        resultType = "win";
        handleWin(100);
    } else if (firstEmoji === secondEmoji || secondEmoji === thirdEmoji || firstEmoji === thirdEmoji) {
        state.textContent = "🥲 So close! Keep going! 🥲";
        state.style.color = "orange";
        resultType = "close";
        handleWin(50);
    } else {
        multiplier = 1; // Reset multiplier on loss
    }

    applySpecialMultiplier(lastResult, resultType); // Apply special 1.5x multiplier condition
    lastResult = resultType;
    updateDisplay();

    if (score <= 0) {
        endGame();
    }
}

// Function to handle wins and update the multiplier
function handleWin(points) {
    score += points * multiplier;
}

// Function to apply special 1.5x multiplier increase rule
function applySpecialMultiplier(prev, current) {
    if ((prev === "close" && current === "win") || (prev === "win" && current === "close")) {
        multiplier *= 1.5; // Increase multiplier by 1.5x
        multiplier = parseFloat(multiplier.toFixed(2)); // Keep 2 decimal places
    } else if (current !== "lose") {
        multiplier++; // Normal increase
    }
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
    button.disabled = false; // Ensure button is clickable
    button.style.display = "block"; // Show button in case it's hidden
    button.onclick = restartGame; // Assign restart function
}

// Function to restart the game
function restartGame() {
    score = 50;
    multiplier = 1;
    lastResult = null;
    luckFactor = Math.random() * 0.6; // Reset luck for new game
    gameOver = false;
    
    state.textContent = "🎰 Spin to Win! 🎰";
    state.style.color = "black";

    button.textContent = "Play";
    button.onclick = spinSlots;
    
    updateDisplay();
}

// Event listener for the play button
button.addEventListener("click", spinSlots);
