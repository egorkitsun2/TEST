// Состояние приложения
let currentQuestionIndex = 0;
let score = 0;
let shuffledOptions = [];

// Элементы DOM
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const progressDisplay = document.getElementById('question-counter');
const progressBar = document.getElementById('progress-bar');
const categoryLabel = document.getElementById('category-label');
const feedbackPanel = document.getElementById('feedback-panel');
const extraInfoText = document.getElementById('extra-info-text');
const statusTitle = document.getElementById('status-title');
const nextBtn = document.getElementById('next-btn');
const resultScreen = document.getElementById('result-screen');
const quizCard = document.querySelector('.quiz-card');
const finalScoreDisplay = document.getElementById('final-score');
const resultComment = document.getElementById('result-comment');

// 1. Запуск теста
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion(questions[currentQuestionIndex]);
}

// 2. Отображение вопроса
function showQuestion(question) {
    resetState();
    
    // Обновляем текст вопроса и счетчик
    questionText.innerText = question.question;
    categoryLabel.innerText = `Категория: ${question.category}`;
    progressDisplay.innerText = `Вопрос ${currentQuestionIndex + 1} / ${questions.length}`;
    
    // Обновляем полоску прогресса
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Перемешиваем варианты ответов, чтобы они не были всегда в одном порядке
    shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

    // Создаем кнопки для ответов
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(button, question));
        optionsList.appendChild(button);
    });
}

// 3. Сброс состояния перед новым вопросом
function resetState() {
    while (optionsList.firstChild) {
        optionsList.removeChild(optionsList.firstChild);
    }
    feedbackPanel.classList.add('hidden');
    nextBtn.disabled = true;
}

// 4. Логика выбора ответа
function selectOption(selectedBtn, question) {
    const isCorrect = selectedBtn.innerText === question.answer;
    
    // Блокируем все кнопки после выбора
    const allButtons = optionsList.querySelectorAll('.option-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;
        // Подсвечиваем правильный ответ зеленым в любом случае
        if (btn.innerText === question.answer) {
            btn.classList.add('correct');
        }
    });

    if (isCorrect) {
        score++;
        selectedBtn.classList.add('correct');
        statusTitle.innerText = "Правильно! 🎉";
        statusTitle.style.color = "var(--success-color)";
    } else {
        selectedBtn.classList.add('wrong');
        statusTitle.innerText = "Ошибка 😕";
        statusTitle.style.color = "var(--error-color)";
    }

    // Показываем пояснение
    extraInfoText.innerText = question.extra_info;
    feedbackPanel.classList.remove('hidden');
    nextBtn.disabled = false;
    
    // Плавная прокрутка к пояснению (для мобильных)
    feedbackPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 5. Обработка нажатия "Следующий вопрос"
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        showFinalResults();
    }
});

// 6. Финальный экран
function showFinalResults() {
    quizCard.classList.add('hidden');
    feedbackPanel.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    progressBar.style.width = `100%`;
    
    finalScoreDisplay.innerText = score;
    
    // Оценка результата
    let comment = "";
    const percent = (score / questions.length) * 100;
    
    if (percent === 100) comment = "Великолепно! Вы настоящий магистр баз данных!";
    else if (percent >= 80) comment = "Отличный результат! Экзамен будет сдан легко.";
    else if (percent >= 50) comment = "Хорошо, но стоит еще немного повторить теорию.";
    else comment = "Нужно больше практики. Попробуйте пройти тест еще раз!";
    
    resultComment.innerText = comment;
}

// Инициализация при загрузке страницы
startQuiz();