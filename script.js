const fruits = ["🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🥝", "🍅", "🥑", "🥧", "🍕", "🍔", "🍟", "🍩", "🍪", "🍫"];
const slots = document.querySelectorAll(".slot");
const button = document.getElementById("play");
const state = document.getElementById("state");
const multiplierDisplay = document.getElementById("multiplier");
const scoreDisplay = document.getElementById("score");

let multiplier = 1;
let score = 50;
let lastWin = false;
let isSpinning = false;
let gameOver = false;

function spinSlots() {
    if (isSpinning || gameOver) return; // Prevent clicking when game is over
    isSpinning = true;
    
    let completed = 0;
    state.textContent = "🎰 Spinning... 🎰";
    state.style.color = "black";

    slots.forEach((slot, index) => {
        let spins = Math.floor(Math.random() * 10) + 5;
        let counter = 0;
        const spinInterval = setInterval(() => {
            slot.textContent = fruits[Math.floor(Math.random() * fruits.length)];
            counter++;
            if (counter >= spins) {
                clearInterval(spinInterval);
                completed++;
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

function checkWin() {
    let firstEmoji = slots[0].textContent;
    let secondEmoji = slots[1].textContent;
    let thirdEmoji = slots[2].textContent;
    
    state.textContent = "😔 You did not win! Try again! 😔";
    state.style.color = "black";
    score -= 10;
    
    if (firstEmoji === secondEmoji && secondEmoji === thirdEmoji) {
        state.textContent = "🎉 JACKPOT! 🎉 You won BIG! 🎰";
        state.style.color = "green";
        if (lastWin) multiplier++;
        else multiplier = 1;
        score += 100 * multiplier;
        lastWin = true;
    } else if (firstEmoji === secondEmoji || secondEmoji === thirdEmoji || firstEmoji === thirdEmoji) {
        state.textContent = "🥲 So close! Keep going! 🥲";
        state.style.color = "orange";
        if (lastWin) multiplier++;
        else multiplier = 1;
        score += 50 * multiplier;
        lastWin = true;
    } else {
        lastWin = false;
        multiplier = 1;
    }
    
    multiplierDisplay.textContent = `🔥 Multiplier: x${multiplier} 🔥`;
    scoreDisplay.textContent = `💰 Score: ${score} 💰`;

    if (score <= 0) {
        gameOver = true;
        state.textContent = "💀 GAME OVER! 💀 No more points!";
        state.style.color = "red";
        button.textContent = "🔄 Restart Game";
        button.onclick = restartGame;
    }
}

function restartGame() {
    score = 50;
    multiplier = 1;
    lastWin = false;
    gameOver = false;
    state.textContent = "🎰 Spin to Win! 🎰";
    state.style.color = "black";
    button.textContent = "Play";
    button.onclick = spinSlots;
    scoreDisplay.textContent = `💰 Score: ${score} 💰`;
}

button.addEventListener("click", spinSlots);
