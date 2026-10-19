const syllabusSections = [
  { id: 'resumen', label: 'Resumen académico' },
  { id: 'descripcion', label: 'Descripción' },
  { id: 'aporte', label: 'Aporte al perfil' },
  { id: 'objetivo', label: 'Objetivo general' },
  { id: 'unidades', label: 'Unidades de aprendizaje' },
  { id: 'habilidades', label: 'Habilidades blandas' },
  { id: 'evaluacion', label: 'Evaluación' },
  { id: 'proyecto', label: 'PlasTrack' },
  { id: 'bibliografia', label: 'Bibliografía' },
  { id: 'docente', label: 'Perfil docente' }
];

const evaluationDates = [
  { code: 'EVAL1', date: '2026-11-22', label: 'Primera evaluación' },
  { code: 'EVAL2', date: '2027-01-10', label: 'Segunda evaluación' },
  { code: 'EVAL3', date: '2027-02-14', label: 'Tercera evaluación' }
];

function setupAccordion(selector, openerSelector, closeAllSelector) {
  const blocks = document.querySelectorAll(selector);
  const toggleAll = document.querySelector(closeAllSelector);

  blocks.forEach(block => {
    const trigger = block.querySelector(openerSelector);
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      block.classList.toggle('is-open');
      const buttonLabel = trigger.querySelector('.toggle-label');
      if (buttonLabel) {
        buttonLabel.textContent = block.classList.contains('is-open') ? 'Ocultar' : 'Expandir';
      }
    });
  });

  if (toggleAll) {
    toggleAll.addEventListener('click', () => {
      const shouldOpen = !Array.from(blocks).every(block => block.classList.contains('is-open'));
      blocks.forEach(block => {
        block.classList.toggle('is-open', shouldOpen);
        const trigger = block.querySelector(openerSelector);
        const buttonLabel = trigger ? trigger.querySelector('.toggle-label') : null;
        if (buttonLabel) buttonLabel.textContent = shouldOpen ? 'Ocultar' : 'Expandir';
      });
    });
  }
}

function setActiveLinkFromScroll() {
  const sections = syllabusSections.map(item => document.getElementById(item.id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.side-nav a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}

function filterContent(query) {
  const searchTerm = query.trim().toLowerCase();
  const candidates = document.querySelectorAll('[data-search]');

  if (!searchTerm) {
    candidates.forEach(item => item.classList.remove('hidden-search-item'));
    return;
  }

  candidates.forEach(item => {
    const text = item.textContent.toLowerCase();
    const visible = text.includes(searchTerm);
    item.classList.toggle('hidden-search-item', !visible);
  });
}

function highlightKeywordMatches() {
  const searchTerm = document.querySelector('#silabo-search')?.value.trim().toLowerCase();
  if (!searchTerm) {
    document.querySelectorAll('mark').forEach(node => {
      const text = document.createTextNode(node.textContent);
      node.replaceWith(text);
    });
    return;
  }

  document.querySelectorAll('[data-search]').forEach(node => {
    const html = node.innerHTML;
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    node.innerHTML = html.replace(regex, '<mark>$1</mark>');
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function updateCountdown() {
  const countdownNode = document.querySelector('#countdown-next');
  if (!countdownNode) return;

  const now = new Date();
  const futureEvaluations = evaluationDates
    .map(item => ({ ...item, dateObj: new Date(item.date + 'T00:00:00') }))
    .filter(item => item.dateObj > now);

  if (!futureEvaluations.length) {
    countdownNode.textContent = 'Todas las evaluaciones ya han ocurrido.';
    return;
  }

  const next = futureEvaluations[0];
  const diff = next.dateObj - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  countdownNode.textContent = `${next.code}: ${days} días, ${hours} horas y ${minutes} minutos restantes.`;
}

function renderEvaluationTimeline() {
  const timeline = document.querySelector('#evaluation-timeline');
  if (!timeline) return;

  const now = new Date();

  timeline.innerHTML = evaluationDates.map(item => {
    const eventDate = new Date(item.date + 'T00:00:00');
    const isPast = eventDate < now;
    const isNext = !isPast && item.date === evaluationDates
      .filter(entry => new Date(entry.date + 'T00:00:00') > now)
      .sort((a, b) => new Date(a.date + 'T00:00:00') - new Date(b.date + 'T00:00:00'))[0]?.date;

    return `
      <article class="timeline-card ${isPast ? 'past' : isNext ? 'next' : ''}" data-search="${item.code} ${item.label}">
        <span class="tag">${item.code}</span>
        <h3>${item.label}</h3>
        <p>${new Date(item.date + 'T00:00:00').toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </article>
    `;
  }).join('');
}

function bindSearch() {
  const input = document.querySelector('#silabo-search');
  if (!input) return;

  input.addEventListener('input', event => {
    const value = event.target.value;
    filterContent(value);
    highlightKeywordMatches();
  });
}

function bindTopButtons() {
  const backToTop = document.querySelector('#back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupAccordion('.unit-panel', '.unit-toggle', '#toggle-all-units');
  setupAccordion('.skill-card', '.skill-toggle', '#toggle-all-skills');
  setActiveLinkFromScroll();
  bindSearch();
  bindTopButtons();
  renderEvaluationTimeline();
  updateCountdown();
  setInterval(updateCountdown, 60000);

  const searchInput = document.querySelector('#silabo-search');
  if (searchInput) {
    searchInput.value = '';
  }
});
