let wordsDiv = document.getElementById("words");
let input = document.getElementById("input");
let timeEl = document.getElementById("time");
let wpmEl = document.getElementById("wpm");
let accEl = document.getElementById("acc");
let resultBox = document.getElementById("result");

let totalTime = 60;
let time = totalTime;
let index = 0;
let correctChars = 0;
let typedChars = 0;
let started = false;
let timer;

function setTime(t){
  totalTime = t;
  time = t;
  timeEl.innerText = t;
  document.querySelectorAll(".top button").forEach(b=>b.classList.remove("active"));
  event.target.classList.add("active");
  reset();
}

function loadWords() {
  wordsDiv.innerHTML = "";
  for(let i=0;i<250;i++){
    let w = wordsList[Math.floor(Math.random()*wordsList.length)];
    let span = document.createElement("span");
    span.innerText = w + " ";
    if(i===0) span.classList.add("active");
    wordsDiv.appendChild(span);
  }
}

input.addEventListener("input", () => {
  if (!started) startTimer();

  let spans = wordsDiv.children;
  let currentWord = spans[index].innerText.trim();

  if (input.value.endsWith(" ")) {
    typedChars += input.value.length;
    if (input.value.trim() === currentWord) {
      spans[index].classList.add("correct");
      correctChars += currentWord.length;
    } else {
      spans[index].classList.add("wrong");
    }

    spans[index].classList.remove("active");
    index++;
    if (spans[index]) spans[index].classList.add("active");
    input.value = "";
    updateStats();
  }
});

function startTimer() {
  started = true;
  timer = setInterval(() => {
    time--;
    timeEl.innerText = time;
    updateStats();
    if (time === 0) endTest();
  }, 1000);
}

function updateStats() {
  let minutes = (totalTime - time) / 60;
  let wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
  let acc = typedChars ? Math.round((correctChars / typedChars) * 100) : 100;
  wpmEl.innerText = wpm;
  accEl.innerText = acc;
}

function endTest() {
  clearInterval(timer);
  input.blur();
  resultBox.classList.remove("hidden");
  resultBox.innerHTML = `
    <h2>result</h2>
    <p>wpm: ${wpmEl.innerText}</p>
    <p>accuracy: ${accEl.innerText}%</p>
    <p>press tab to restart</p>
  `;
}

function reset(){
  clearInterval(timer);
  index=0; correctChars=0; typedChars=0; started=false;
  resultBox.classList.add("hidden");
  input.value="";
  loadWords();
}

document.addEventListener("keydown", e => {
  if (e.key === "Tab") location.reload();
});

loadWords();