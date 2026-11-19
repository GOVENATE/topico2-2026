const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const highlightBtn = document.getElementById('highlightBtn');
const finalMessage = document.getElementById('finalMessage');

highlightBtn.addEventListener('click', () => {
  finalMessage.textContent = 'Un verdadero líder construye resultados, pero también construye oportunidades.';
  highlightBtn.textContent = '✓ Mensaje destacado';
  highlightBtn.style.background = '#101418';
  highlightBtn.style.color = '#fff';
});

const cards = document.querySelectorAll('.feature-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {threshold: 0.12});

cards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(18px)';
  card.style.transition = 'opacity .5s ease, transform .5s ease, box-shadow .25s, border-color .25s';
  observer.observe(card);
});
