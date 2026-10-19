const navToggle = document.querySelector('.navbar-toggle');
const navMenu = document.querySelector('.navbar-nav');

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
