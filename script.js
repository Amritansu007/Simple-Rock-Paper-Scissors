/*
 * ===================================================================
 *  CHEAT-SHEET — How the key logic works (read this before explaining)
 * ===================================================================
 *
 *  1. HOW Math.random() BECOMES A CHOICE
 *     -----------------------------------
 *     We have an array: ["rock", "paper", "scissors"]   (indices 0, 1, 2)
 *
 *     Step-by-step:
 *       a) Math.random()         → a decimal from 0 (inclusive) to 1 (exclusive), e.g. 0.731
 *       b) Math.random() * 3     → scale it to 0 .. 2.999…,                      e.g. 2.193
 *       c) Math.floor(… * 3)     → chop off the decimal to get 0, 1, or 2,       e.g. 2
 *       d) choices[index]        → look up the array: 0→"rock", 1→"paper", 2→"scissors"
 *
 *     Each of the three outcomes has an equal ~33.3% chance because
 *     Math.random() is uniformly distributed in [0, 1).
 *
 *
 *  2. HOW WIN/LOSE/TIE IS DECIDED
 *     ----------------------------
 *     There are 9 total combinations (3 player choices × 3 computer choices).
 *
 *     We check in this order:
 *       • If both picked the same thing  → it's a TIE  (3 combos: r-r, p-p, s-s)
 *       • Else if the player wins        → PLAYER WINS (3 combos)
 *           rock     beats scissors
 *           paper    beats rock
 *           scissors beats paper
 *       • Else (anything left over)      → COMPUTER WINS (the remaining 3 combos)
 *
 *     That accounts for all 9 combos with no gaps.
 * ===================================================================
 */

// ---- CONFIGURATION ------------------------------------------------
// Change this number to make the game shorter or longer.
// Whoever reaches this score first wins the whole game.
let WIN_TARGET = 5;

// ---- CHOICES ARRAY ------------------------------------------------
// The three possible moves, mapped to indices 0, 1, 2.
const CHOICES = ["rock", "paper", "scissors"];

// ---- SCORE TRACKING -----------------------------------------------
// These change after every round, so we use "let".
let playerScore = 0;
let computerScore = 0;

// ---- DOM ELEMENT REFERENCES ---------------------------------------
// These never change, so we use "const".
const playerScoreEl = document.querySelector("#player-score");
const computerScoreEl = document.querySelector("#computer-score");
const roundPicksEl = document.querySelector("#round-picks");
const roundOutcomeEl = document.querySelector("#round-outcome");
const gameOverEl = document.querySelector("#game-over");
const choicesContainer = document.querySelector("#choices");
const choiceButtons = document.querySelectorAll(".choice-btn");
const resetBtn = document.querySelector("#reset-btn");
const targetDisplayEl = document.querySelector("#target-display");

// Show the current win target in the subtitle
targetDisplayEl.textContent = WIN_TARGET;


// ====================================================================
//  FUNCTIONS
// ====================================================================

// -- getComputerChoice -----------------------------------------------
// Generates a random choice for the computer.
// Uses Math.random() to pick an index (0, 1, or 2), then looks up
// the corresponding string in the CHOICES array.
function getComputerChoice() {
  const randomDecimal = Math.random();       // e.g. 0.731
  const scaled = randomDecimal * 3;          // e.g. 2.193
  const index = Math.floor(scaled);          // e.g. 2
  const choice = CHOICES[index];             // e.g. "scissors"
  return choice;
}


// -- decideWinner ----------------------------------------------------
// Compares the player's choice and the computer's choice and returns
// a string: "win", "lose", or "tie".
//
// We check all 9 combos explicitly:
//   - 3 tie cases  (same pick)
//   - 3 player-win cases
//   - 3 computer-win cases (the "else" catches these)
function decideWinner(playerChoice, computerChoice) {
  // --- TIE: both picked the same thing ---
  if (playerChoice === computerChoice) {
    return "tie";
  }

  // --- PLAYER WINS: check the three winning combos ---
  if (playerChoice === "rock" && computerChoice === "scissors") {
    return "win";
  } else if (playerChoice === "paper" && computerChoice === "rock") {
    return "win";
  } else if (playerChoice === "scissors" && computerChoice === "paper") {
    return "win";
  }

  // --- COMPUTER WINS: everything else ---
  // The remaining 3 combos are:
  //   rock vs paper      → computer wins
  //   paper vs scissors   → computer wins
  //   scissors vs rock    → computer wins
  return "lose";
}


// -- updateScoreDisplay ----------------------------------------------
// Writes the current values of playerScore and computerScore
// into the scoreboard elements on the page.
function updateScoreDisplay() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}


// -- showRoundResult -------------------------------------------------
// Updates the "result" section to tell the player what happened
// this round: what each side picked, and whether it was a win/lose/tie.
function showRoundResult(playerChoice, computerChoice, outcome) {
  // Capitalise the first letter for nicer display
  const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  roundPicksEl.textContent =
    "You picked " + cap(playerChoice) + "  —  Computer picked " + cap(computerChoice);

  // Remove any previous outcome colour class
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


// -- disableChoiceButtons --------------------------------------------
// Greys out the Rock/Paper/Scissors buttons so the player can't
// keep playing after the game is over.
function disableChoiceButtons() {
  choiceButtons.forEach(function (btn) {
    btn.disabled = true;
  });
}


// -- enableChoiceButtons ---------------------------------------------
// Re-enables the buttons so a new game can be played.
function enableChoiceButtons() {
  choiceButtons.forEach(function (btn) {
    btn.disabled = false;
  });
}


// -- checkForGameOver ------------------------------------------------
// After updating scores, checks if either player has reached the
// WIN_TARGET. If so, shows a final message and disables buttons.
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


// -- playRound -------------------------------------------------------
// The main function that runs when the player clicks a choice button.
// It coordinates all the other functions:
//   1. Get the computer's random pick
//   2. Decide who won
//   3. Update scores
//   4. Update the display
//   5. Check if the game is over
function playRound(playerChoice) {
  const computerChoice = getComputerChoice();
  const outcome = decideWinner(playerChoice, computerChoice);

  // Update score variables
  if (outcome === "win") {
    playerScore = playerScore + 1;
  } else if (outcome === "lose") {
    computerScore = computerScore + 1;
  }
  // (ties don't change either score)

  // Update what's shown on the page
  updateScoreDisplay();
  showRoundResult(playerChoice, computerChoice, outcome);

  // See if someone just won the whole game
  checkForGameOver();
}


// -- resetGame -------------------------------------------------------
// Resets everything back to the starting state so the player can
// play again without refreshing the page.
function resetGame() {
  // Reset score variables
  playerScore = 0;
  computerScore = 0;

  // Reset displayed scores
  updateScoreDisplay();

  // Clear round result text
  roundPicksEl.textContent = "Pick rock, paper, or scissors to start!";
  roundOutcomeEl.textContent = "";
  roundOutcomeEl.classList.remove("outcome-win", "outcome-lose", "outcome-tie");

  // Clear game-over banner
  gameOverEl.textContent = "";
  gameOverEl.className = "game-over";

  // Re-enable buttons
  enableChoiceButtons();

  // In case WIN_TARGET was changed in the console, update the display
  targetDisplayEl.textContent = WIN_TARGET;
}


// ====================================================================
//  EVENT LISTENERS
// ====================================================================

// -- Choice buttons --------------------------------------------------
// Each button has a "data-choice" attribute (e.g. data-choice="rock").
// When clicked, we read that attribute and pass it to playRound().
choiceButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const playerChoice = btn.getAttribute("data-choice");
    playRound(playerChoice);
  });
});

// -- Reset button ----------------------------------------------------
// Clicking "Play Again / Reset" starts a fresh game.
resetBtn.addEventListener("click", function () {
  resetGame();
});
