const entrepreneurs = {
  head: {
    part: "Cabeza",
    quality: "Visión y estrategia",
    name: "Carlos Slim Helú",
    company: "Grupo Carso / América Móvil",
    reason: "La cabeza representa la capacidad de pensar, analizar y tomar decisiones. Carlos Slim es un ejemplo de visión empresarial y estrategia a largo plazo.",
    highlight: "Una buena estrategia permite identificar oportunidades y construir proyectos sostenibles."
  },
  "left-arm": {
    part: "Brazo izquierdo",
    quality: "Innovación tecnológica",
    name: "Blanca Treviño",
    company: "Softtek",
    reason: "El brazo representa la capacidad de actuar y transformar ideas en resultados. Blanca Treviño destaca por su trayectoria en el sector de tecnología y servicios digitales.",
    highlight: "La innovación ayuda a transformar problemas en soluciones y oportunidades."
  },
  "right-arm": {
    part: "Brazo derecho",
    quality: "Liderazgo y expansión",
    name: "Daniel Servitje",
    company: "Grupo Bimbo",
    reason: "El brazo representa acción y liderazgo. Daniel Servitje ha dirigido la expansión internacional de Grupo Bimbo y su crecimiento como empresa global.",
    highlight: "Liderar también significa coordinar personas, recursos y objetivos para crecer."
  },
  torso: {
    part: "Torso",
    quality: "Diversificación e inversión",
    name: "María Asunción Aramburuzabala",
    company: "Empresaria e inversionista",
    reason: "El torso representa el centro y equilibrio del cuerpo. Su trayectoria empresarial está relacionada con inversión, diversificación y participación en distintos sectores.",
    highlight: "Diversificar puede ayudar a una empresa a aprovechar distintas oportunidades y reducir riesgos."
  },
  "left-leg": {
    part: "Pierna izquierda",
    quality: "Perseverancia",
    name: "Lorenzo Servitje",
    company: "Fundador de Grupo Bimbo",
    reason: "Las piernas representan estabilidad y avance. Lorenzo Servitje es un ejemplo de perseverancia y construcción empresarial a largo plazo.",
    highlight: "Los grandes proyectos requieren constancia, disciplina y capacidad para seguir avanzando."
  },
  "right-leg": {
    part: "Pierna derecha",
    quality: "Crecimiento y competitividad",
    name: "José Antonio Fernández Carbajal",
    company: "FEMSA",
    reason: "La pierna representa movimiento y crecimiento. Su trayectoria al frente de FEMSA permite relacionar el liderazgo con la expansión y competitividad empresarial.",
    highlight: "Competir implica mejorar continuamente, adaptarse y buscar nuevas oportunidades."
  }
};

const infoCard = document.getElementById("infoCard");

document.querySelectorAll(".body-part").forEach(button => {
  button.addEventListener("click", () => {
    const data = entrepreneurs[button.dataset.part];

    infoCard.innerHTML = `
      <div class="card-content">
        <span class="part-label">${data.part} · ${data.quality}</span>
        <h2>${data.name}</h2>
        <p class="company">${data.company}</p>
        <p class="reason">${data.reason}</p>
        <div class="highlight"><strong>¿Por qué esta parte?</strong><br>${data.highlight}</div>
      </div>
    `;

    infoCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

const quizData = [
  {
    question: "¿Qué empresario se relaciona con la visión y estrategia?",
    options: ["Carlos Slim Helú", "Lorenzo Servitje", "Blanca Treviño"],
    answer: 0
  },
  {
    question: "¿Qué cualidad representa principalmente el torso?",
    options: ["Perseverancia", "Diversificación e inversión", "Innovación tecnológica"],
    answer: 1
  },
  {
    question: "¿Con quién se relaciona la innovación tecnológica?",
    options: ["Blanca Treviño", "Daniel Servitje", "José Antonio Fernández Carbajal"],
    answer: 0
  },
  {
    question: "¿Qué empresario se relaciona con la perseverancia?",
    options: ["María Asunción Aramburuzabala", "Lorenzo Servitje", "Carlos Slim Helú"],
    answer: 1
  }
];

const quiz = document.getElementById("quiz");

quizData.forEach((item, i) => {
  const question = document.createElement("div");
  question.className = "quiz-question";
  question.innerHTML = `<p>${i + 1}. ${item.question}</p>` +
    item.options.map((option, j) => `
      <label>
        <input type="radio" name="q${i}" value="${j}">
        ${option}
      </label>
    `).join("");
  quiz.appendChild(question);
});

document.getElementById("checkQuiz").addEventListener("click", () => {
  let score = 0;

  quizData.forEach((item, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && Number(selected.value) === item.answer) score++;
  });

  const result = document.getElementById("quizResult");
  result.textContent = `Obtuviste ${score} de ${quizData.length} respuestas correctas.`;

  if (score === quizData.length) {
    result.textContent += " ¡Excelente trabajo!";
  } else if (score >= 2) {
    result.textContent += " ¡Buen trabajo! Puedes volver a explorar las partes del cuerpo.";
  } else {
    result.textContent += " Te recomendamos revisar nuevamente la actividad.";
  }
});
