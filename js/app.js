/* Declaration of principale variables*/
const cards = document.querySelectorAll(".card");
const deck = document.querySelector(".deck");
const moves = document.querySelector(".moves");
const starsList = document.querySelectorAll(".stars li i");
const runningTime = document.querySelector(".runningTime");
const restartGame = document.querySelectorAll(".restart");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const clickstowin = cards.length / 2;
let visualizedCards, clicks, counter, timer, interval, numStars;

/* Start game */
function startGame() {
  clicks = 0;
  counter = 0;
  timer = 0;
  moves.innerHTML = counter;
  runningTime.innerHTML = timer;
  deck.innerHTML = "";
  numStars = starsList.length;
  clearInterval(interval);
  visualizedCards = [];
  modal.style.display = "none";

  starsList.forEach(function(star) {
    star.classList.add("fa-star");
  });

  /* Display the cards on the page
  - shuffle the list of cards using the provided "shuffle" method below
  - loop through each card and create its HTML
  - add each card's HTML to the page */

  /* Using the rest parameter to shuffle all cards*/
  const shuffleList = shuffle([...cards]);
  /* Documentation from https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment */
  const fragment = document.createDocumentFragment();
  shuffleList.forEach(function(card) {
    card.classList.remove("show", "open", "match");
    fragment.append(card);
  });

  deck.append(fragment);
}
/* Initialize the timer*/
function startTimer() {
  interval = setInterval(function() {
    timer++;
    runningTime.innerHTML = timer;
  }, 1000);
}
/* Reset time*/
function stopTimer() {
  clearInterval(interval);
}
/*Visualize all cards*/
function viewCard(card) {
  card.classList.toggle("open");
  card.classList.toggle("show");
}

function match() {
  clicks++;
  visualizedCards.forEach(function(card) {
    card.classList.add("match");
  });
  visualizedCards = [];

  if (clicks === clickstowin) {
    stopTimer();
    visualModal();
  }
}

function unmatch() {
  visualizedCards[0].classList.add("unmatch");
  visualizedCards[1].classList.add("unmatch");
  setTimeout(function() {
    visualizedCards[0].classList.remove("show", "open", "unmatch");
    visualizedCards[1].classList.remove("show", "open", "unmatch");
    visualizedCards = [];
  }, 1000);
}
/* Compare the cards */
function compareCard(card) {
  visualizedCards.push(card);

  if (visualizedCards.length === 2) {
    computeMoves();

    if (visualizedCards[0].dataset.type === visualizedCards[1].dataset.type) {
      match();
    } else {
      unmatch();
    }
  }
}

/*Reduce star number */
function subtractStar() {
  numStars--;
  const stars = document.querySelectorAll(".fa-star");
  stars[stars.length - 1].classList.remove("fa-star");
}
/* Calculate all moves */
function computeMoves() {
  counter++;
  if (counter === 1) {
    startTimer();
  }
  moves.innerHTML = counter;
  if (counter === 18 || counter === 30) {
    subtractStar();
  }
}
/* If the user matchs all the cards, a winner message (Modal) shows all the moves, the rating, and the time*/
function visualModal() {
  const totalMoves = document.querySelector(".total-moves");
  const totalTime = document.querySelector(".totalTime");
  const totalStars = document.querySelector(".total-stars");
  totalMoves.innerHTML = counter;
  totalTime.innerHTML = timer;
  totalStars.innerHTML = numStars;
  modal.style.display = "block";
}

/* Shuffle function from http://stackoverflow.com/a/2450976 */
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/* set up the event listener for a card. If a card is clicked:
- display the card's symbol (put this functionality in another function that you call from this one)
- add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
- if the list already has another card, check to see if the two cards match
+ if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
+ if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
+ increment the move counter and display it on the page (put this functionality in another function that you call from this one)
+ if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)*/

/* Add event listener by clicking on card */
deck.addEventListener("click", function(event) {
  if (event.target.nodeName !== "LI") return;
  if (event.target.classList.contains("open", "show", "match")) return;
  if (visualizedCards.length === 2) return;
  const card = event.target;
  viewCard(card);
  compareCard(card);
});
/* Add event listener for restart the game */
restartGame.forEach(function(restart) {
  restart.addEventListener("click", startGame);
});

/* the user can close the modal clicking on x */
close.onclick = function() {
  modal.style.display = "none";
};

/*the user clicks outside of the modal and can close it */
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", startGame);
