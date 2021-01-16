// Quiz areas
const quizInitContainer = document.querySelector('.quiz-init');
const quizGameContainer = document.querySelector('.quiz-game');
const quizCongratulationsContainer = document.querySelector('.quiz-congratulations');

// Quiz init container elements
const playerForm = document.querySelector('.player-form');
const playerNameField = document.querySelector('.player-name');

// Quiz game container elements
const greetings = document.querySelector('.greetings');
const questionAndAnswers = document.querySelector('.questions-and-answers');
const questionsCounter = document.querySelector('.questions-counter');
const btnNextQuestion = document.querySelector('.btn-next');

// Quiz congratulations container elements
const quizResult = document.querySelector('.quiz-result');
const btnStartAgain = document.querySelector('.btn-start-again');

// General elements
let playerName = 'Anônimo(a)';
let totalQuestionsValue = 0;
let currentQuestionIndex = 0;
let currenQuestionCorrectAnswerIndex = 0;
let lastQuestionIndex = 0;
let score = 0;
let isAbleToPlusScore = true;
let isAnAnswerSelected = false;
let isAbleToDecreaseScore = true;

// Funtions
function finishQuiz() {
  quizCongratulationsContainer.classList.remove('set-none');
  quizResult.textContent = `Ao todo, acertou ${score} de ${totalQuestionsValue} questões`
}

function goToNextQuestion() {
  if (isAnAnswerSelected && currentQuestionIndex < totalQuestionsValue - 1) {
    isAnAnswerSelected = false;
    isAbleToPlusScore = true;
    currentQuestionIndex++;
    isAbleToDecreaseScore = false;
    updateQuizQuestions();
  } else if (isAnAnswerSelected && currentQuestionIndex === totalQuestionsValue - 1) {
    setTimeout(() => {
      quizGameContainer.classList.add('set-none');
      finishQuiz();
    }, 500);
  }
}

function selectThisAnswer(answer) {
  const allAnswers = document.querySelectorAll('.answer');
  allAnswers.forEach((eachAnswer) => eachAnswer.classList.remove('selected'));

  answer.classList.add('selected');
  isAnAnswerSelected = true;

  const currentAnswerIndex = Number(answer.dataset.index);
  const areTheSameIndex = currentAnswerIndex === currenQuestionCorrectAnswerIndex;
  
  if (areTheSameIndex && isAbleToPlusScore) {
    score++;
    isAbleToPlusScore = false;
    isAbleToDecreaseScore = true;
  } else if (areTheSameIndex && isAnAnswerSelected) {
    score = score;
    isAbleToPlusScore = false;
  } else if (isAbleToDecreaseScore) {
    score--;
    if (score < 0) score = 0
    isAbleToPlusScore = true;
    isAbleToDecreaseScore = false;
  }
}

function generateAnswersTemplate(answers) {
  return answers.reduce((acc, answer, index) => {
    acc += `<p class="answer" onclick="selectThisAnswer(this)" data-index="${index}">${answer}</p>`;
    return acc;
  }, '');
}

function generateQuestionTemplate({ 
  id, question, answers, correct 
}) {
  currenQuestionCorrectAnswerIndex = correct;
  questionsCounter.textContent = `${id} de ${totalQuestionsValue} questões.`;

  const answersTemplate = generateAnswersTemplate(answers);
  return `
    <h1 class="question">Q${id}. ${question}</h1>
    <div class="answers">${answersTemplate}</div>
  `;
}

async function getQuestionDatas() {
  const data = await (await (fetch('./questions.json'))).json();
  totalQuestionsValue = data.length;
  return data[currentQuestionIndex];
}

async function updateQuizQuestions() {
  const questionData = await getQuestionDatas();
  const questionTemplate = generateQuestionTemplate(questionData);
  
  questionAndAnswers.innerHTML = questionTemplate;
  greetings.textContent = `Bem-vindo! ${playerName}`;
}

function startQuiz() {
  quizGameContainer.classList.remove('set-none');
  updateQuizQuestions();
}

function resetQuiz() {
  playerName = 'Anônimo(a)';
  totalQuestionsValue = 0;
  currentQuestionIndex = 0;
  currenQuestionCorrectAnswerIndex = 0;
  lastQuestionIndex = 0;
  score = 0;
  isAbleToPlusScore = true;
  isAnAnswerSelected = false;
  isAbleToDecreaseScore = true;

  setTimeout(() => {
    quizCongratulationsContainer.classList.add('set-none');
    startQuiz();
  }, 500);
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const playerNameFieldValue = playerNameField.value.trim();
  playerName = playerNameFieldValue !== ''
    ? playerNameFieldValue
    : 'Anônimo(a)';
    
  quizInitContainer.classList.add('hidden');
  setTimeout(() => {
    quizInitContainer.classList.remove('hidden');
    quizInitContainer.classList.add('set-none');
    startQuiz();
  }, 500);
}

// Event Listeners
playerForm.addEventListener('submit', handleFormSubmit);
btnNextQuestion.addEventListener('click', goToNextQuestion);
btnStartAgain.addEventListener('click', resetQuiz);
