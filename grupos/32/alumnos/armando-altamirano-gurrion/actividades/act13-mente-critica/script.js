const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

document.querySelectorAll(".reflection-btn").forEach(button => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    answer.textContent = button.dataset.answer;
    answer.classList.toggle("visible");
    button.textContent = answer.classList.contains("visible")
      ? "Ocultar reflexión"
      : "Ver reflexión";
  });
});

const correctAnswers = {
  q1: "b",
  q2: "a",
  q3: "c",
  q4: "b",
  q5: "a"
};

document.getElementById("quizForm").addEventListener("submit", event => {
  event.preventDefault();

  let score = 0;
  let answered = 0;

  Object.entries(correctAnswers).forEach(([question, answer]) => {
    const selected = document.querySelector(`input[name="${question}"]:checked`);
    if (selected) {
      answered++;
      if (selected.value === answer) score++;
    }
  });

  const result = document.getElementById("result");

  if (answered < Object.keys(correctAnswers).length) {
    result.innerHTML = `
      <h3>Faltan respuestas</h3>
      <p>Responde las ${Object.keys(correctAnswers).length} preguntas para obtener tu resultado.</p>
    `;
  } else {
    let message;

    if (score === 5) {
      message = "¡Excelente! Identificas muy bien los conceptos y las falacias.";
    } else if (score >= 3) {
      message = "¡Buen trabajo! Ya tienes una base sólida, pero puedes reforzar algunos conceptos.";
    } else {
      message = "Vas por buen camino. Revisa nuevamente las secciones de pensamiento crítico y falacias.";
    }

    result.innerHTML = `
      <h3>Resultado: ${score}/5</h3>
      <p>${message}</p>
    `;
  }

  result.classList.add("show");
  result.scrollIntoView({ behavior: "smooth", block: "center" });
});
