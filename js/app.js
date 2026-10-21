/* LAB! — Interacciones de la web cómic.
   JavaScript nativo: menú, scroll, filtros, diálogos, editor y quiz. */
(() => {
  'use strict';

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // Menú móvil accesible.
  const navToggle = $('#nav-toggle');
  const navLinks = $('#nav-links');
  function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    navLinks.classList.remove('is-open');
  }
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    navLinks.classList.toggle('is-open', isOpen);
  });
  $$('a[href^="#"]', navLinks).forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.navigation')) closeNav();
  });

  // Barra de progreso y aparición de las tarjetas.
  const scrollBar = $('#scroll-bar');
  let scrollQueued = false;
  function updateScroll() {
    const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollBar.style.width = `${Math.min(100, Math.max(0, window.scrollY / total * 100))}%`;
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      requestAnimationFrame(updateScroll);
      scrollQueued = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();
  const animated = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 45px 0px' });
    animated.forEach(el => observer.observe(el));
  } else {
    animated.forEach(el => el.classList.add('in-view'));
  }

  // Efecto cómic al presionar BOOM.
  const fxLayer = $('#fx-layer');
  const exclamations = ['¡BOOM!', '¡WOW!', '¡POW!', '¡ZAS!', '¡CLICK!'];
  let boomIndex = 0;
  $('#boom-button').addEventListener('click', () => {
    const word = document.createElement('span');
    word.className = 'fx-word';
    word.textContent = exclamations[boomIndex++ % exclamations.length];
    word.style.left = `${12 + Math.random() * 34}%`;
    word.style.top = `${22 + Math.random() * 36}%`;
    fxLayer.append(word);
    word.addEventListener('animationend', () => word.remove(), { once: true });
    // Seguridad adicional cuando un navegador suspende animaciones.
    setTimeout(() => word.remove(), 1500);
  });

  // Filtros de ideas de proyecto.
  const filters = $$('.filter-button');
  const projectCards = $$('.project-card');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/);
      card.hidden = category !== 'all' && !categories.includes(category);
    });
  }));

  // Datos pedagógicos de las ideas (no representan proyectos entregados).
  const projects = {
    amazonia: {
      tag: '01 / WEB + LORETO', title: 'LANDING AMAZÓNICA',
      description: 'Diseña una página para contar una historia amazónica real: un emprendimiento, iniciativa ambiental, servicio o expresión cultural.',
      tasks: ['Crear portada, secciones y pie de página en HTML semántico.', 'Usar una paleta inspirada en el contexto amazónico.', 'Adaptar el diseño a móvil con CSS y Bootstrap.', 'Incluir imágenes propias o con derechos de uso y sus textos alternativos.']
    },
    dashboard: {
      tag: '02 / UI + DATOS', title: 'MINI DASHBOARD',
      description: 'Construye un panel que explique información mediante tarjetas, métricas y componentes visuales coherentes.',
      tasks: ['Diseñar una cuadrícula responsive con Bootstrap.', 'Agregar al menos tres indicadores descriptivos.', 'Mostrar datos de ejemplo claramente identificados como tales.', 'Usar JavaScript para filtrar o cambiar una métrica.']
    },
    portfolio: {
      tag: '03 / WEB PERSONAL', title: 'PORTAFOLIO CREATIVO',
      description: 'Imagina una identidad digital para presentar tus habilidades y trabajos en un sitio personal.',
      tasks: ['Escribir una presentación clara y original.', 'Crear sección de proyectos con tarjetas visuales.', 'Diseñar navegación funcional y adaptable.', 'Integrar interacciones sencillas con JavaScript.']
    },
    comunidad: {
      tag: '04 / UI + COMUNIDAD', title: 'COMUNIDAD CONECTADA',
      description: 'Prototipa una experiencia digital sencilla que facilite encontrar iniciativas, eventos o información comunitaria.',
      tasks: ['Definir a quién ayudará la página y con qué problema.', 'Diseñar tarjetas de información y un buscador visual.', 'Probar el sitio con navegación por teclado.', 'Evitar información privada o datos reales no autorizados.']
    }
  };

  const projectDialog = $('#project-dialog');
  const dialogClose = $('#dialog-close');
  function closeProjectDialog() { projectDialog.close(); }
  $$('[data-project]').forEach(button => button.addEventListener('click', () => {
    const data = projects[button.dataset.project];
    if (!data) return;
    $('#dialog-tag').textContent = data.tag;
    $('#dialog-title').textContent = data.title;
    $('#dialog-description').textContent = data.description;
    $('#dialog-list').replaceChildren(...data.tasks.map(item => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
    if (typeof projectDialog.showModal === 'function') projectDialog.showModal();
    else projectDialog.setAttribute('open', '');
  }));
  dialogClose.addEventListener('click', closeProjectDialog);
  $('#dialog-done').addEventListener('click', closeProjectDialog);
  projectDialog.addEventListener('click', event => {
    if (event.target === projectDialog) closeProjectDialog();
  });

  // Fotografía original, ampliada sin recortes.
  const photoDialog = $('#photo-dialog');
  $('#view-photo').addEventListener('click', () => photoDialog.showModal());
  $('#close-photo').addEventListener('click', () => photoDialog.close());
  photoDialog.addEventListener('click', event => {
    if (event.target === photoDialog) photoDialog.close();
  });

  // Mini editor: los tres archivos del ejercicio se guardan solo en memoria.
  // La vista previa está aislada mediante el atributo sandbox del iframe.
  const initialCode = {
    html: `<main class="tarjeta">\n  <span class="etiqueta">MI PRIMER DISEÑO</span>\n  <h1>¡Hola, web! ✨</h1>\n  <p>¡Yo puedo crear algo increíble!</p>\n  <button id="saludar">Haz clic aquí</button>\n  <p id="mensaje"></p>\n</main>`,
    css: `body {\n  margin: 0;\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  font-family: Arial, sans-serif;\n  background: #fff3c7;\n}\n.tarjeta {\n  margin: 18px;\n  padding: 27px;\n  border: 3px solid #171822;\n  background: white;\n  box-shadow: 7px 7px #171822;\n  text-align: center;\n}\n.etiqueta {\n  color: #5468f7;\n  font-size: 11px;\n  font-weight: bold;\n}\nh1 { color: #ff6750; }\nbutton {\n  border: 2px solid #171822;\n  padding: 11px 15px;\n  background: #ffcf3e;\n  font-weight: bold;\n  cursor: pointer;\n}`,
    js: `const boton = document.getElementById('saludar');\n\nboton.addEventListener('click', () => {\n  document.getElementById('mensaje')\n    .textContent = '¡PUM! JavaScript funciona 🚀';\n});`
  };
  let currentTab = 'html';
  let code = { ...initialCode };
  const tabs = $$('.code-tab');
  const codeEditor = $('#code-editor');
  const codePreview = $('#code-preview');
  const previewStatus = $('#preview-status');

  function switchTab(next) {
    code[currentTab] = codeEditor.value;
    currentTab = next;
    codeEditor.value = code[currentTab];
    tabs.forEach(tab => {
      const selected = tab.dataset.tab === next;
      tab.classList.toggle('selected', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const nextIndex = (i + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      switchTab(tabs[nextIndex].dataset.tab);
      tabs[nextIndex].focus();
    });
  });
  codeEditor.value = code.html;
  // Permitir indentación con Tab dentro del editor.
  codeEditor.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = codeEditor.selectionStart;
      const end = codeEditor.selectionEnd;
      codeEditor.setRangeText('  ', start, end, 'end');
    }
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      executeCode();
    }
  });
  function executeCode() {
    code[currentTab] = codeEditor.value;
    // Evitar romper las etiquetas de estilo/script que envuelven las entradas.
    const safeCSS = code.css.replace(/<\/style/gi, '<\\/style');
    const safeJS = code.js.replace(/<\/script/gi, '<\\/script');
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${safeCSS}</style></head><body>${code.html}<script>${safeJS}<\/script></body></html>`;
    codePreview.srcdoc = html;
    previewStatus.textContent = 'ACTUALIZADO ✓';
  }
  $('#run-code').addEventListener('click', executeCode);
  $('#reset-code').addEventListener('click', () => {
    code = { ...initialCode };
    codeEditor.value = code[currentTab];
    executeCode();
    previewStatus.textContent = 'REINICIADO ✓';
  });
  executeCode();

  // Quiz de tres preguntas; retroalimentación inmediata.
  const questions = [
    { question: '¿Qué lenguaje define la estructura de una página web?', options: ['CSS', 'HTML', 'JavaScript'], answer: 1, reason: 'HTML organiza elementos como títulos, párrafos, imágenes y enlaces.' },
    { question: '¿Qué tecnología usamos principalmente para dar estilo y color?', options: ['CSS', 'SQL', 'Python'], answer: 0, reason: 'CSS permite crear estilos, disposiciones adaptables y animaciones.' },
    { question: '¿Cuál añade interacción a los botones y componentes de una web?', options: ['PDF', 'HTML solamente', 'JavaScript'], answer: 2, reason: 'JavaScript permite responder a clics, validar formularios y actualizar contenido.' }
  ];
  let questionIndex = 0;
  let quizScore = 0;
  let answered = false;
  const quizContent = $('#quiz-content');
  const quizProgress = $('#quiz-progress');
  const quizProgressBar = $('#quiz-progress-bar');
  function renderQuestion() {
    answered = false;
    const q = questions[questionIndex];
    quizProgress.textContent = `${String(questionIndex + 1).padStart(2, '0')} / 0${questions.length}`;
    quizProgressBar.style.width = `${(questionIndex + 1) / questions.length * 100}%`;
    quizContent.replaceChildren();
    const title = document.createElement('h3');
    title.className = 'quiz-question';
    title.textContent = q.question;
    const optionList = document.createElement('div');
    optionList.className = 'quiz-options';
    q.options.forEach((label, index) => {
      const choice = document.createElement('button');
      choice.className = 'quiz-option';
      choice.type = 'button';
      const letter = document.createElement('span');
      letter.className = 'quiz-letter';
      letter.textContent = String.fromCharCode(65 + index);
      const value = document.createElement('span');
      value.textContent = label;
      choice.append(letter, value);
      choice.addEventListener('click', () => answerQuestion(index, q, optionList, footer));
      optionList.append(choice);
    });
    const footer = document.createElement('div');
    footer.className = 'quiz-feedback';
    footer.setAttribute('role', 'status');
    quizContent.append(title, optionList, footer);
  }
  function answerQuestion(answer, q, optionList, footer) {
    if (answered) return;
    answered = true;
    if (answer === q.answer) quizScore++;
    $$('.quiz-option', optionList).forEach((button, index) => {
      button.disabled = true;
      if (index === q.answer) button.classList.add('correct');
      if (index === answer && answer !== q.answer) button.classList.add('incorrect');
    });
    footer.textContent = `${answer === q.answer ? '¡Correcto! ✳' : '¡Sigue intentándolo! ✦'} ${q.reason}`;
    const next = document.createElement('button');
    next.className = 'quiz-next';
    next.type = 'button';
    next.textContent = questionIndex === questions.length - 1 ? 'VER MI RESULTADO →' : 'SIGUIENTE PREGUNTA →';
    next.addEventListener('click', () => {
      questionIndex++;
      if (questionIndex < questions.length) renderQuestion();
      else renderResult();
    });
    quizContent.append(next);
    next.focus({ preventScroll: true });
  }
  function renderResult() {
    quizProgress.textContent = 'COMPLETADO ✓';
    quizProgressBar.style.width = '100%';
    quizContent.replaceChildren();
    const result = document.createElement('div');
    result.className = 'quiz-result';
    const icon = document.createElement('div');
    icon.className = 'quiz-result-star';
    icon.textContent = quizScore === 3 ? '🏆' : '✳';
    const title = document.createElement('h3');
    title.textContent = `${quizScore} DE ${questions.length} ACIERTOS`;
    const info = document.createElement('p');
    info.textContent = quizScore === 3 ? '¡Eres una leyenda del código! Sigue creando.' : 'Cada pregunta es una oportunidad de aprender. ¡Prueba otra vez!';
    const restart = document.createElement('button');
    restart.type = 'button';
    restart.className = 'comic-btn btn-yellow';
    restart.textContent = '↺ REPETIR EL RETO';
    restart.addEventListener('click', () => { quizScore = 0; questionIndex = 0; renderQuestion(); });
    result.append(icon, title, info, restart);
    quizContent.append(result);
  }
  renderQuestion();

  $('#year').textContent = String(new Date().getFullYear());
})();
