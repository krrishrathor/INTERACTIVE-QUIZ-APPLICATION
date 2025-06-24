const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const resultElement = document.getElementById("result");
const nextButton = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score");
const progressBar = document.getElementById("progress-fill");
const restartButton = document.getElementById("restart-btn");


let currentQuestion = 0;
let score = 0;
let questions = [];

function loadQuizData() {
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
        .then(response => response.json())
        .then(data => {
            questions = data.results;
            showQuestion();
        });
}

function showQuestion() {
    resetState();
    let q = questions[currentQuestion];
    questionElement.innerHTML = decodeHTML(q.question);

    let answers = [...q.incorrect_answers];
    let randomIndex = Math.floor(Math.random() * 4);
    answers.splice(randomIndex, 0, q.correct_answer);

    answers.forEach(answer => {
        let button = document.createElement("button");
        button.innerText = decodeHTML(answer);
        button.classList.add("answer-btn");
        button.addEventListener("click", () => selectAnswer(button, answer === q.correct_answer));
        answersElement.appendChild(button);
    });

    updateProgressBar();
}

function selectAnswer(button, isCorrect) {
    Array.from(answersElement.children).forEach(btn => btn.disabled = true);
    if (isCorrect) {
        button.classList.add("correct");
        resultElement.innerText = "Correct!";
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    } else {
        button.classList.add("wrong");
        resultElement.innerText = "Wrong!";
    }

    nextButton.style.display = "block";
}

function resetState() {
    resultElement.innerText = "";
    nextButton.style.display = "none";
    answersElement.innerHTML = "";
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
  questionElement.innerText = "Quiz Complete!";
  answersElement.innerHTML = "";
  resultElement.innerText = `Final Score: ${score}/${questions.length}`;
  nextButton.style.display = "none";
  restartButton.style.display = "block";
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  scoreDisplay.innerText = `Score: 0`;
  restartButton.style.display = "none";
  loadQuizData(); 
}


function updateProgressBar() {
    let percent = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = percent + "%";
}

function decodeHTML(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", restartQuiz);


loadQuizData();
