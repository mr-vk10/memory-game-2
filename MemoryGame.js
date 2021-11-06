"use strict";
let count = 0;
let turns = 0;
let currentScore = 16;
let highScore = 0;
let firstChoice, secondChoice, choiceOne, choiceTwo;
let answerKey = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
let savedGameBlocks = [];

const imageMap = {
  0: "images/blank.png",
  1: "images/cheeseburger.png",
  2: "images/fries.png",
  3: "images/hotdog.png",
  4: "images/ice-cream.png",
  5: "images/milkshake.png",
  6: "images/pizza.png",
  7: "images/white.png",
};

const dispScore = document.querySelector("#score");
const dispHighScore = document.querySelector("#highscore");
const dispMessage = document.querySelector(".message");

function disableAllClicks(e) {
  e.stopPropagation();
  e.preventDefault();
}

const disableOnclick = function (id) {
  let block = document.querySelector(`#${id}`);
  console.log(block);
  block.onclick = function () {
    return false;
  };
};

const shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // console.log(j);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function generateUniqueString() {
  let arr = ["a", "b", "c", "d", "e", "f", "g", "h"];
  let shuffledArr = shuffleArray(arr).join("");
  return shuffledArr;
}

function getKeyByValue(obj, value) {
  return Object.keys(obj).find((key) => obj[key].includes(value));
}

const startGame = function () {
  count = 0;
  turns = 0;
  savedGameBlocks = [];
  currentScore = 16;
  // console.log("highscore from Start: ", highScore);
  dispScore.textContent = currentScore;
  dispHighScore.textContent = highScore;
  answerKey = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
  dispMessage.textContent = "Start Game...";
  document.querySelector("body").style.backgroundColor = "#2e2e2e";
  $(".game").empty();

  let hideImg = "https://image.flaticon.com/icons/png/512/36/36601.png";
  let appendStr = "";

  for (let i = 0; i < 4; i++) {
    appendStr = '<div class="row">';
    for (let j = 0; j < 4; j++) {
      const id = generateUniqueString();
      appendStr += `<div id="${id}" onclick="reveal('${id}')" class="box">
      <img src="${hideImg}" />
    </div>`;
    }
    appendStr += "</div";
    $(".game").append(appendStr);
  }
};

const assignValue = function () {
  let boxes = document.querySelectorAll(".box");
  const newArr = shuffleArray([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]);

  for (let [i, box] of boxes.entries()) {
    // answerKey[newArr[i]].push(box);
    answerKey[newArr[i]].push($(box).attr("id"));
    // console.log(box);
  }
  console.log(answerKey);
  // return answerKey;
};

const givePeak = function () {
  document.addEventListener("click", disableAllClicks, true);

  let hideImg = "https://image.flaticon.com/icons/png/512/36/36601.png";
  let boxes = document.querySelectorAll(".box");
  // console.log(boxes);
  let boxesID = [];
  for (let box of boxes) {
    // console.log(box.id);
    boxesID.push(box.id);
  }
  // console.log(boxesID);
  for (let boxID of boxesID) {
    $(`#${boxID}`)
      .find("img")
      .attr("src", imageMap[getKeyByValue(answerKey, boxID)]);
    // $(box).find('img').attr('src', imageMap[getKeyByValue(answerKey, box)]);
  }

  setTimeout(function () {
    for (let box of boxes) {
      $(box).find("img").attr("src", hideImg);
    }
    document.removeEventListener("click", disableAllClicks, true);
  }, 3000);
};

const reveal = function (id) {
  if (count === 0) {
    firstChoice = document.querySelector(`#${id}`);
    // firstChoice = $(`#${id}`);
    // firstChoice = document.querySelectorAll(`#${id}`)[0];
    console.log("firstChoice", firstChoice);
    disableOnclick(id);
    // choiceOne = getKeyByValue(answerKey, firstChoice);
    choiceOne = getKeyByValue(answerKey, id);
    savedGameBlocks.push(id);
    console.log(savedGameBlocks);

    // $(`#${id}`).find("img").attr("src", imageMap[choiceOne]);
    $(`#${id}`).find("img").attr("src", imageMap[choiceOne]);
    // $(firstChoice).find("img").attr("src", imageMap[choiceOne]);
    // $(`#${id}`).off('click');
    // firstChoice.removeEventListener('click', reveal, true);
    count++;
  } else if (count === 1) {
    secondChoice = document.querySelector(`#${id}`);
    // secondChoice = $(`#${id}`);
    // secondChoice = document.querySelectorAll(`#${id}`)[0];
    console.log("secondChoice", secondChoice);
    disableOnclick(id);
    // choiceTwo = getKeyByValue(answerKey, secondChoice);
    choiceTwo = getKeyByValue(answerKey, id);
    savedGameBlocks.push(id);
    console.log(savedGameBlocks);

    $(`#${id}`).find("img").attr("src", imageMap[choiceTwo]);
    // $(secondChoice).find("img").attr("src", imageMap[choiceTwo]);
    // $(`#${id}`).off('click');
    // secondChoice.removeEventListener('click', reveal, true);
    count = 0;
    // setTimeout(3000);
    if (choiceOne === choiceTwo) {
      dispMessage.textContent = "🎉 Correct!!";
    } else {
      currentScore -= 2;
      dispScore.textContent = currentScore;
      dispMessage.textContent = "👎 Wrong Guess!!";
    }
  }

  if (turns < 15) {
    turns++;
  } else {
    dispMessage.textContent = "🚩 GAME OVER 🚩 ";
    document.querySelector("body").style.backgroundColor = "#60b347";
    highScore = currentScore > highScore ? currentScore : highScore;
    dispHighScore.textContent = highScore;
  }

  // $(`#${id}`).val(id);
};

const playAgain = function () {
  startGame();
  assignValue();
  givePeak();
};

const saveGame = function () {
  if (confirm("Do you want to save the game?")) {
    localStorage.clear();
    let savedGameState = {
      cnt: count,
      trns: turns,
      game: `${$(".game").html()}`,
      ans: answerKey,
      selectedBlocks: savedGameBlocks,
      cOne: choiceOne,
      score: currentScore,
      highscore: highScore,
    };

    localStorage.setItem("savedGame", JSON.stringify(savedGameState));
    console.log(localStorage.getItem("savedGame"));
    // window.close();
  } else {
    localStorage.clear();
    window.close();
  }
};

const resumeGame = function () {
  let savedGameState = JSON.parse(localStorage.getItem("savedGame"));
  console.log(savedGameState);
  $(".game").html(savedGameState.game);
  // answerKey = JSON.parse(savedGameState.ans);
  answerKey = savedGameState.ans;
  console.log(answerKey);

  savedGameBlocks = savedGameState.selectedBlocks;
  console.log(savedGameBlocks);
  savedGameBlocks.forEach((id) => {
    disableOnclick(id);
  });
  currentScore = savedGameState.score;
  console.log(currentScore);

  // dispScore.html(currentScore);
  // console.log(dispScore.textContent);
  highScore = savedGameState.highscore;
  // setTimeout(function () {

  // }, 5000);

  // dispScore.html(highScore);
  count = savedGameState.cnt;
  turns = savedGameState.trns;
  choiceOne = savedGameState.cOne;
  dispHighScore.textContent = highScore;
  dispScore.textContent = currentScore;
};

$(function () {
  //Check if there is a saved game
  const isGameSaved = localStorage.getItem("savedGame");
  console.log(isGameSaved);
  if (isGameSaved) {
    if (confirm("Do you want to resume the game?")) {
      // startGame();
      resumeGame();
    } else {
      localStorage.clear();
      startGame();
      assignValue();
      givePeak();
    }
  } else {
    startGame();
    assignValue();
    givePeak();
  }

  $(".again").on("click", playAgain);
  $(".exit").on("click", saveGame);
  // $('#a1').on('click', reveal(this));
});
