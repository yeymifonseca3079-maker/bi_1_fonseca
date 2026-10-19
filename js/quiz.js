const quizQuestions = [
  {
    question: '¿Qué define mejor a Business Intelligence?',
    options: [
      'La creación de campañas publicitarias.',
      'El conjunto de procesos para recopilar, analizar y visualizar datos para apoyar decisiones.',
      'La organización de archivos físicos en una empresa.',
      'El diseño de interfaces de usuario.'
    ],
    answer: 1,
    explanation: 'BI convierte datos en información útil para orientar decisiones de negocio.'
  },
  {
    question: '¿Cuál es la primera etapa de la toma de decisiones?',
    options: [
      'Evaluar resultados.',
      'Identificar el problema.',
      'Seleccionar una herramienta visual.',
      'Definir la marca.'
    ],
    answer: 1,
    explanation: 'Antes de decidir, es necesario reconocer claramente el problema o la necesidad.'
  },
  {
    question: '¿Qué función cumple el ETL en BI?',
    options: [
      'Diseñar interfaces web para clientes.',
      'Extraer, transformar y cargar datos para analizarlos.',
      'Generar reportes fiscales obligatorios.',
      'Crear campañas de correo masivo.'
    ],
    answer: 1,
    explanation: 'ETL prepara la información para que pueda usarse en análisis y dashboards.'
  },
  {
    question: '¿Cuál es una buena práctica para mantener la calidad de los datos?',
    options: [
      'Eliminar duplicados y corregir inconsistencias.',
      'Subir todos los archivos sin validarlos.',
      'Guardar datos solo en papel.',
      'Cambiar nombres de columnas manualmente cada semana.'
    ],
    answer: 0,
    explanation: 'Los datos limpios y consistentes mejoran la fiabilidad de decisiones y reportes.'
  },
  {
    question: '¿Qué es un KPI?',
    options: [
      'Un documento financiero legal.',
      'Un indicador clave de rendimiento para medir resultados.',
      'Una base de datos de proveedores.',
      'Un perfil de usuario en una plataforma CRM.'
    ],
    answer: 1,
    explanation: 'Los KPI ayudan a medir si una estrategia o proceso está funcionando como se espera.'
  },
  {
    question: '¿Qué ventaja aporta un dashboard bien diseñado?',
    options: [
      'Oculta la información relevante.',
      'Presenta indicadores clave en una vista clara y rápida.',
      'Reduce la necesidad de análisis.',
      'Solo sirve para reportes contables.'
    ],
    answer: 1,
    explanation: 'Los dashboards permiten monitorear tendencias y detectar anomalías con rapidez.'
  },
  {
    question: '¿Qué ocurre durante la etapa de transformación en ETL?',
    options: [
      'Se extraen los datos desde su fuente.',
      'Se limpian, validan y normalizan los datos.',
      'Se eliminan todas las columnas.',
      'Se publican los resultados en redes sociales.'
    ],
    answer: 1,
    explanation: 'En transformación se corrigen errores, formatos y duplicados para preparar la información.'
  },
  {
    question: '¿Cuál de estas opciones representa mejor una decisión basada en datos?',
    options: [
      'Reponer productos según la demanda observada y el análisis de ventas.',
      'Comprar inventario sin revisar indicadores.',
      'Cambiar precios cada día sin evidencia.',
      'Eliminar la competencia del mercado.'
    ],
    answer: 0,
    explanation: 'La analítica de ventas permite responder con evidencia para optimizar inventario.'
  },
  {
    question: '¿Qué fuente de datos puede alimentar una solución BI?',
    options: [
      'Solo una hoja de cálculo.',
      'CSV, bases de datos, ERP y plataformas web.',
      'Un solo archivo de texto sin estructura.',
      'Exclusivamente correos electrónicos.'
    ],
    answer: 1,
    explanation: 'Las soluciones BI integran información de distintas fuentes para obtener una visión completa.'
  },
  {
    question: '¿Qué debe hacerse después de implementar una decisión?',
    options: [
      'No volver a evaluar resultados.',
      'Hacer seguimiento y medir impacto para ajustar si es necesario.',
      'Excluir los datos del siguiente mes.',
      'Eliminar los reportes anteriores.'
    ],
    answer: 1,
    explanation: 'La evaluación posterior confirma si la decisión tuvo el efecto esperado y permite corregir.'
  }
];

const state = {
  index: 0,
  score: 0,
  answered: false,
  maxScore: quizQuestions.length * 10,
  correctAnswers: 0
};

const questionNode = document.querySelector('#quiz-question');
const answersNode = document.querySelector('#quiz-answers');
const feedbackNode = document.querySelector('#quiz-feedback');
const counterNode = document.querySelector('#question-counter');
const progressBar = document.querySelector('#quiz-progress');
const nextButton = document.querySelector('#next-question');
const finishButton = document.querySelector('#finish-quiz');
const resultBox = document.querySelector('#quiz-result');
const resultMessage = document.querySelector('#result-message');
const resultScore = document.querySelector('#result-score');
const resultDetails = document.querySelector('#result-details');
const retryButton = document.querySelector('#retry-quiz');

function getCurrentQuestion() {
  return quizQuestions[state.index];
}

function getRank(scorePercent) {
  if (scorePercent >= 80) return 'Experto BI';
  if (scorePercent >= 60) return 'Analista BI';
  return 'Aprendiz BI';
}

function updateProgress() {
  const progress = ((state.index + 1) / quizQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
  counterNode.textContent = `Pregunta ${state.index + 1}/${quizQuestions.length}`;
}

function renderQuestion() {
  const question = getCurrentQuestion();
  if (!question) return;

  questionNode.textContent = question.question;
  answersNode.innerHTML = '';
  feedbackNode.className = 'feedback';
  feedbackNode.textContent = '';
  nextButton.disabled = true;
  nextButton.textContent = state.index === quizQuestions.length - 1 ? 'Finalizar' : 'Siguiente';
  finishButton.style.display = state.index === quizQuestions.length - 1 ? 'inline-flex' : 'none';
  state.answered = false;

  question.options.forEach((option, optionIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    button.textContent = `${String.fromCharCode(65 + optionIndex)}. ${option}`;

    button.addEventListener('click', () => {
      if (state.answered) return;
      state.answered = true;

      const isCorrect = optionIndex === question.answer;
      if (isCorrect) {
        state.score += 10;
        state.correctAnswers += 1;
        feedbackNode.textContent = `¡Correcto! ${question.explanation}`;
        feedbackNode.classList.add('success');
        button.classList.add('correct');
      } else {
        feedbackNode.textContent = `No es correcto. ${question.explanation}`;
        feedbackNode.classList.add('error');
        button.classList.add('incorrect');
        const correctButton = Array.from(answersNode.children).find((optionButton, idx) => {
          const correctOption = optionIndex !== idx && quizQuestions[state.index].answer === idx;
          return correctOption;
        });
        if (correctButton) correctButton.classList.add('correct');
      }

      Array.from(answersNode.children).forEach(optionButton => {
        optionButton.classList.add('disabled');
      });

      nextButton.disabled = false;
      finishButton.disabled = false;
      feedbackNode.classList.add('show');
    });

    answersNode.appendChild(button);
  });

  updateProgress();
}

function completeQuiz() {
  const totalQuestions = quizQuestions.length;
  const performance = Math.round((state.score / state.maxScore) * 100);
  const rank = getRank(performance);
  const wrongAnswers = totalQuestions - state.correctAnswers;

  resultBox.classList.add('visible');
  resultScore.textContent = `${performance}%`;
  resultDetails.textContent = `Aciertos: ${state.correctAnswers} • Errores: ${wrongAnswers} • Puntuación: ${state.score} puntos`;
  resultMessage.innerHTML = `<span class="range-badge">${rank}</span><div class="reward-mark">🏆</div><strong>${performance >= 80 ? '¡Excelente!' : performance >= 60 ? '¡Muy bien!' : '¡Sigue practicando!'}</strong><p>Has completado el cuestionario y reforzado tus conocimientos sobre BI y ETL.</p>`;

  const ring = document.querySelector('.score-ring');
  if (ring) {
    ring.style.background = `conic-gradient(var(--accent) ${performance * 3.6}deg, #dbeafe ${performance * 3.6}deg 360deg)`;
  }

  const questionWrapper = document.querySelector('.question-box');
  if (questionWrapper) {
    questionWrapper.style.display = 'none';
  }
  nextButton.style.display = 'none';
  finishButton.style.display = 'none';
}

nextButton.addEventListener('click', () => {
  if (!state.answered) return;

  if (state.index < quizQuestions.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    completeQuiz();
  }
});

finishButton.addEventListener('click', () => {
  if (!state.answered) return;
  completeQuiz();
});

retryButton.addEventListener('click', () => {
  state.index = 0;
  state.score = 0;
  state.answered = false;
  state.correctAnswers = 0;

  resultBox.classList.remove('visible');
  const questionWrapper = document.querySelector('.question-box');
  if (questionWrapper) {
    questionWrapper.style.display = 'block';
  }
  nextButton.style.display = 'inline-flex';
  progressBar.style.width = '0%';
  renderQuestion();
});

renderQuestion();
