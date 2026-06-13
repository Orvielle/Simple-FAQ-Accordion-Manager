(() => {
  const STORAGE_KEY = 'faq-desk-entries';

  const form = document.getElementById('faq-form');
  const questionInput = document.getElementById('question-input');
  const answerInput = document.getElementById('answer-input');
  const list = document.getElementById('faq-list');
  const countEl = document.getElementById('faq-count');
  const emptyState = document.getElementById('empty-state');
  const template = document.getElementById('faq-item-template');

  /** @type {{id: string, question: string, answer: string}[]} */
  let faqs = loadFaqs();

  // ------------------------------------------------------
  // Persistence
  // ------------------------------------------------------
  function loadFaqs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultFaqs();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
      return defaultFaqs();
    } catch (err) {
      console.warn('Could not load saved FAQs, starting fresh.', err);
      return defaultFaqs();
    }
  }

  function saveFaqs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));
    } catch (err) {
      console.warn('Could not save FAQs.', err);
    }
  }

  function defaultFaqs() {
    return [
      {
        id: createId(),
        question: 'How do I add a new question?',
        answer: 'Use the "New entry" panel on the left. Type your question and answer, then click "Add to list" — it appears at the top of the board.'
      },
      {
        id: createId(),
        question: 'Can I edit or remove an entry later?',
        answer: 'Yes. Open any entry and use the Edit or Delete buttons underneath the answer.'
      },
      {
        id: createId(),
        question: 'Where is this information stored?',
        answer: 'Everything is saved in your browser\'s local storage, so your list will still be here next time you open this page on the same device.'
      }
    ];
  }

  function createId() {
    return 'faq-' + Math.random().toString(36).slice(2, 10);
  }

  // ------------------------------------------------------
  // Rendering
  // ------------------------------------------------------
  function render() {
    list.innerHTML = '';

    faqs.forEach((faq, index) => {
      const node = template.content.cloneNode(true);
      const item = node.querySelector('.accordion__item');
      const trigger = node.querySelector('.accordion__trigger');
      const indexEl = node.querySelector('.accordion__index');
      const questionEl = node.querySelector('.accordion__question');
      const answerEl = node.querySelector('.accordion__answer');
      const panel = node.querySelector('.accordion__panel');
      const editBtn = node.querySelector('[data-action="edit"]');
      const deleteBtn = node.querySelector('[data-action="delete"]');

      item.dataset.id = faq.id;
      indexEl.textContent = String(index + 1).padStart(2, '0');
      questionEl.textContent = faq.question;
      answerEl.textContent = faq.answer;

      trigger.addEventListener('click', () => toggleItem(item, trigger, panel));
      editBtn.addEventListener('click', () => startEdit(item, faq));
      deleteBtn.addEventListener('click', () => deleteFaq(faq.id));

      list.appendChild(node);
    });

    updateCount();
    updateEmptyState();
  }

  function updateCount() {
    const n = faqs.length;
    countEl.textContent = `${n} ${n === 1 ? 'entry' : 'entries'}`;
  }

  function updateEmptyState() {
    emptyState.classList.toggle('empty-state--visible', faqs.length === 0);
  }

  // ------------------------------------------------------
  // Accordion behaviour
  // ------------------------------------------------------
  function toggleItem(item, trigger, panel) {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    // Close any other open items (single-open accordion)
    list.querySelectorAll('.accordion__trigger[aria-expanded="true"]').forEach((openTrigger) => {
      if (openTrigger !== trigger) {
        closePanel(openTrigger, openTrigger.closest('.accordion__item').querySelector('.accordion__panel'));
      }
    });

    if (isOpen) {
      closePanel(trigger, panel);
    } else {
      openPanel(trigger, panel);
    }
  }

  function openPanel(trigger, panel) {
    trigger.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }

  function closePanel(trigger, panel) {
    trigger.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0px';
  }

  // Recalculate height of an open panel (used after edits)
  function refreshOpenPanel(item) {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');
    if (trigger.getAttribute('aria-expanded') === 'true') {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  }

  // ------------------------------------------------------
  // CRUD actions
  // ------------------------------------------------------
  function addFaq(question, answer) {
    faqs.unshift({ id: createId(), question, answer });
    saveFaqs();
    render();
  }

  function deleteFaq(id) {
    faqs = faqs.filter((f) => f.id !== id);
    saveFaqs();
    render();
  }

  function startEdit(item, faq) {
    const panelInner = item.querySelector('.accordion__panel-inner');
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');

    // Make sure the item is open while editing
    if (trigger.getAttribute('aria-expanded') !== 'true') {
      openPanel(trigger, panel);
    }

    item.classList.add('accordion__item--editing');

    panelInner.innerHTML = `
      <input type="text" class="edit-question" value="${escapeHtml(faq.question)}" aria-label="Edit question" />
      <textarea class="edit-answer" rows="3" aria-label="Edit answer">${escapeHtml(faq.answer)}</textarea>
      <div class="accordion__actions">
        <button type="button" class="btn btn--save btn--small" data-action="save">Save changes</button>
        <button type="button" class="btn btn--ghost btn--small" data-action="cancel">Cancel</button>
      </div>
    `;

    const questionField = panelInner.querySelector('.edit-question');
    const answerField = panelInner.querySelector('.edit-answer');
    const saveBtn = panelInner.querySelector('[data-action="save"]');
    const cancelBtn = panelInner.querySelector('[data-action="cancel"]');

    saveBtn.addEventListener('click', () => {
      const newQuestion = questionField.value.trim();
      const newAnswer = answerField.value.trim();
      if (!newQuestion || !newAnswer) return;

      faq.question = newQuestion;
      faq.answer = newAnswer;
      saveFaqs();
      render();
    });

    cancelBtn.addEventListener('click', () => render());

    questionField.focus();
    refreshOpenPanel(item);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ------------------------------------------------------
  // Form submission
  // ------------------------------------------------------
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (!question || !answer) return;

    addFaq(question, answer);
    form.reset();
    questionInput.focus();
  });

  // ------------------------------------------------------
  // Init
  // ------------------------------------------------------
  render();
})();
