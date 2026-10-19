const navToggle = document.querySelector('.navbar-toggle');
const navMenu = document.querySelector('.navbar-nav');
const themeToggle = document.querySelector('#theme-toggle');

function applyTheme(theme) {
  const selectedTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.classList.toggle('theme-dark', selectedTheme === 'dark');
  localStorage.setItem('bi-theme', selectedTheme);

  if (themeToggle) {
    themeToggle.textContent = selectedTheme === 'dark' ? '☀️ Claro' : '🌙 Oscuro';
    themeToggle.setAttribute('aria-label', selectedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }
}

const preferredTheme = localStorage.getItem('bi-theme') || 'light';
applyTheme(preferredTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });
}

const etlToggle = document.querySelector('#toggle-etl-example');
const etlExample = document.querySelector('.etl-example');

if (etlToggle && etlExample) {
  etlToggle.addEventListener('click', () => {
    const isVisible = etlExample.classList.toggle('visible');
    etlToggle.textContent = isVisible ? 'Ocultar ejemplo ETL' : 'Ver ejemplo ETL';
  });
}

const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(link => {
  link.addEventListener('click', event => {
    const targetSelector = link.getAttribute('href');
    if (!targetSelector || targetSelector === '#') return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
