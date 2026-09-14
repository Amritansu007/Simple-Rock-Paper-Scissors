let WIN_TARGET = 5;
const CHOICES = ["rock", "paper", "scissors"];

let playerScore = 0;
let computerScore = 0;

const playerScoreEl = document.querySelector("#player-score");
const computerScoreEl = document.querySelector("#computer-score");
const roundPicksEl = document.querySelector("#round-picks");
const roundOutcomeEl = document.querySelector("#round-outcome");
const gameOverEl = document.querySelector("#game-over");
const choicesContainer = document.querySelector("#choices");
const choiceButtons = document.querySelectorAll(".choice-btn");
const resetBtn = document.querySelector("#reset-btn");
const targetDisplayEl = document.querySelector("#target-display");

targetDisplayEl.textContent = WIN_TARGET;

function getComputerChoice() {
  const randomDecimal = Math.random();       
  const scaled = randomDecimal * 3;          
  const index = Math.floor(scaled);          
  const choice = CHOICES[index];           
  return choice;
}

function decideWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return "tie";
  }

  if (playerChoice === "rock" && computerChoice === "scissors") {
    return "win";
  } else if (playerChoice === "paper" && computerChoice === "rock") {
    return "win";
  } else if (playerChoice === "scissors" && computerChoice === "paper") {
    return "win";
  }
  return "lose";
}

function updateScoreDisplay() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

function showRoundResult(playerChoice, computerChoice, outcome) {
  const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  roundPicksEl.textContent =
    "You picked " + cap(playerChoice) + "  —  Computer picked " + cap(computerChoice);
  roundOutcomeEl.classList.remove("outcome-win", "outcome-lose", "outcome-tie");

  if (outcome === "win") {
    roundOutcomeEl.textContent = cap(playerChoice) + " beats " + cap(computerChoice) + " — You win this round!";
    roundOutcomeEl.classList.add("outcome-win");
  } else if (outcome === "lose") {
    roundOutcomeEl.textContent = cap(computerChoice) + " beats " + cap(playerChoice) + " — Computer wins this round!";
    roundOutcomeEl.classList.add("outcome-lose");
  } else {
    roundOutcomeEl.textContent = "It's a tie!";
    roundOutcomeEl.classList.add("outcome-tie");
  }
}

function disableChoiceButtons() {
  choiceButtons.forEach(function (btn) {
    btn.disabled = true;
  });
}

function enableChoiceButtons() {
  choiceButtons.forEach(function (btn) {
    btn.disabled = false;
  });
}

function checkForGameOver() {
  if (playerScore >= WIN_TARGET) {
    gameOverEl.textContent = "🎉 You win the game!";
    gameOverEl.className = "game-over player-wins";
    disableChoiceButtons();
    return true;
  }

  if (computerScore >= WIN_TARGET) {
    gameOverEl.textContent = "💻 Computer wins the game!";
    gameOverEl.className = "game-over computer-wins";
    disableChoiceButtons();
    return true;
  }

  return false;
}

function playRound(playerChoice) {
  const computerChoice = getComputerChoice();
  const outcome = decideWinner(playerChoice, computerChoice);

  if (outcome === "win") {
    playerScore = playerScore + 1;
  } else if (outcome === "lose") {
    computerScore = computerScore + 1;
  }
  updateScoreDisplay();
  showRoundResult(playerChoice, computerChoice, outcome);

  checkForGameOver();
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;

  updateScoreDisplay();

  roundPicksEl.textContent = "Pick rock, paper, or scissors to start!";
  roundOutcomeEl.textContent = "";
  roundOutcomeEl.classList.remove("outcome-win", "outcome-lose", "outcome-tie");
  gameOverEl.textContent = "";
  gameOverEl.className = "game-over";

  enableChoiceButtons();
  targetDisplayEl.textContent = WIN_TARGET;
}

choiceButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const playerChoice = btn.getAttribute("data-choice");
    playRound(playerChoice);
  });
});

resetBtn.addEventListener("click", function () {
  resetGame();
});
