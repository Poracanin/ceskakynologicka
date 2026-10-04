/* Contact drafts live only in this page. Preparing a message does not send it. */
(() => {
  const dialog = document.querySelector('#contact-dialog');
  const finder = document.querySelector('#event-finder-dialog');
  const form = document.querySelector('#contact-form');
  const prepared = document.querySelector('#contact-prepared');
  const catalog = window.CK_EVENT_CATALOG;
  const search = document.querySelector('#contact-event-search');
  const list = document.querySelector('#contact-event-list');
  const detail = document.querySelector('#contact-event-detail');
  const drafts = new Map();
  const privacyTemplates = {
    access: ['Žádost o přístup k osobním údajům', 'Dobrý den,\nžádám o informaci, jaké osobní údaje o mně zpracováváte v souvislosti s mým účtem a přihláškami na výstavy.\nProsím o odpověď na uvedený e-mail.\nDěkuji.'],
    correction: ['Žádost o opravu osobních údajů', 'Dobrý den,\nžádám o opravu následujících údajů v mém účtu:\n\nÚdaj k opravě:\nSprávná hodnota:\n\nDěkuji.'],
    export: ['Žádost o kopii osobních údajů', 'Dobrý den,\nžádám o kopii osobních údajů spojených s mým účtem a přihláškami na výstavy.\nProsím o informaci, jak mi budou údaje bezpečně předány.\nDěkuji.'],
    deletion: ['Žádost o výmaz osobních údajů', 'Dobrý den,\nžádám o posouzení výmazu osobních údajů spojených s mým účtem. Prosím o informaci o vyřízení žádosti a o údajích, které případně musí být nadále uchovány.\nDěkuji.'],
    restriction: ['Žádost o omezení zpracování', 'Dobrý den,\nžádám o posouzení omezení zpracování svých osobních údajů.\n\nRozsah a důvod žádosti:\n\nDěkuji.']
  };
  let context = null;
  let selectedEventId = catalog[0]?.id;
  let launcher = null;

  const text = (selector, value) => { document.querySelector(selector).textContent = value; };
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('cs');
  const eventDate = event => new Date(`${event.date}T12:00:00`).toLocaleDateString('cs-CZ');

  function saveDraft() {
    if (context) drafts.set(context.key, Object.fromEntries(new FormData(form)));
  }

  function openContact(kind, event = null) {
    saveDraft();
    const key = kind === 'event' ? `event-${event.id}` : kind;
    context = { key, kind, recipient: event?.contact || 'info@ceskakynologicka.cz' };
    if (finder.open) finder.close();
    form.reset();
    [...form.elements].forEach(field => field.setCustomValidity?.(''));
    form.hidden = false;
    prepared.hidden = true;
    document.querySelector('#privacy-kind-field').hidden = kind !== 'privacy';
    const title = kind === 'privacy' ? 'Kontaktovat správce údajů' : kind === 'event' ? 'Napsat pořadateli' : 'Napsat na podporu';
    text('#contact-dialog-title', title);
    text('#contact-dialog-eyebrow', kind === 'privacy' ? 'Osobní údaje' : event?.title || 'Podpora portálu');
    text('#contact-recipient', `Příjemce: ${context.recipient}`);
    form.elements.subject.value = kind === 'privacy' ? privacyTemplates.access[0] : event ? `Dotaz k výstavě: ${event.title}` : 'Podpora portálu';
    form.elements.message.value = kind === 'privacy' ? privacyTemplates.access[1] : event ? `Dobrý den,\nmám dotaz k výstavě ${event.title} (${eventDate(event)}):\n\n` : '';
    const draft = drafts.get(key);
    if (draft) Object.entries(draft).forEach(([name, value]) => { form.elements[name].value = value; });
    if (kind === 'privacy') previousPrivacyKind = form.elements.requestKind.value;
    dialog.showModal();
    document.body.classList.add('contact-modal-open');
    form.elements.name.focus();
  }

  document.querySelectorAll('[data-contact-open]').forEach(button => button.addEventListener('click', () => {
    launcher = button;
    openContact(button.dataset.contactOpen);
  }));
  // Keep an edited draft for each request type when switching templates.
  let previousPrivacyKind = 'access';
  const privacyDrafts = new Map();
  form.elements.requestKind.addEventListener('change', () => {
    privacyDrafts.set(previousPrivacyKind, [form.elements.subject.value, form.elements.message.value]);
    previousPrivacyKind = form.elements.requestKind.value;
    const template = privacyDrafts.get(previousPrivacyKind) || privacyTemplates[previousPrivacyKind];
    [form.elements.subject.value, form.elements.message.value] = template;
  });
  form.addEventListener('input', event => event.target.setCustomValidity?.(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const name of ['name', 'email', 'subject', 'message']) {
      const field = form.elements[name];
      field.value = field.value.trim();
      field.setCustomValidity(field.value ? '' : 'Vyplňte prosím toto pole.');
    }
    if (!form.reportValidity()) return;
    saveDraft();
    const data = Object.fromEntries(new FormData(form));
    const body = `${data.message}\n\n${data.name}\nE-mail pro odpověď: ${data.email}`;
    text('#contact-preview-recipient', context.recipient);
    text('#contact-preview-subject', data.subject);
    text('#contact-preview-message', body);
    document.querySelector('#contact-mail-link').href = `mailto:${context.recipient}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
    form.hidden = true;
    prepared.hidden = false;
    document.querySelector('#contact-prepared-title').focus();
  });
  document.querySelector('#contact-edit').addEventListener('click', () => {
    prepared.hidden = true; form.hidden = false; form.elements.message.focus();
  });

  function selectEvent(id) {
    const event = catalog.find(item => item.id === id);
    if (!event) return;
    selectedEventId = id;
    detail.hidden = false;
    list.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.eventId) === id)));
    text('#contact-event-date', `${eventDate(event)} · ${event.type}`);
    text('#contact-event-title', event.title);
    text('#contact-event-venue', `${event.venue}, ${event.city}`);
    text('#contact-event-organizer', event.organizer);
    const { lat, lon } = event.location;
    const params = new URLSearchParams({ bbox: [lon - .012, lat - .007, lon + .012, lat + .007].join(','), layer: 'mapnik', marker: `${lat},${lon}` });
    const map = document.querySelector('#contact-event-map');
    const url = `https://www.openstreetmap.org/export/embed.html?${params}`;
    if (map.getAttribute('src') !== url) map.src = url;
    map.title = `Mapa: ${event.venue}, ${event.city}`;
    document.querySelector('#contact-map-link').href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
  }

  function renderEvents() {
    const query = normalize(search.value.trim());
    const filtered = catalog.filter(event => normalize(`${event.title} ${event.city} ${event.venue}`).includes(query));
    list.replaceChildren();
    text('#contact-event-count', `Nalezené výstavy: ${filtered.length}`);
    for (const event of filtered) {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.eventId = event.id;
      const title = document.createElement('b'); title.textContent = event.title;
      const meta = document.createElement('span'); meta.textContent = `${eventDate(event)} · ${event.city}`;
      button.append(title, meta);
      button.addEventListener('click', () => selectEvent(event.id));
      list.append(button);
    }
    if (filtered.length) selectEvent(filtered.some(event => event.id === selectedEventId) ? selectedEventId : filtered[0].id);
    else {
      detail.hidden = true;
      const empty = document.createElement('p'); empty.className = 'contact-hint'; empty.textContent = 'Žádná výstava neodpovídá hledání. Zkuste jiný název nebo město.';
      const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = 'Zobrazit všechny výstavy';
      reset.addEventListener('click', () => { search.value = ''; renderEvents(); search.focus(); });
      list.append(empty, reset);
      document.querySelector('#contact-event-map').removeAttribute('src');
    }
  }
  search.addEventListener('input', renderEvents);
  document.querySelector('#open-event-finder').addEventListener('click', event => {
    launcher = event.currentTarget;
    finder.showModal();
    document.body.classList.add('contact-modal-open');
    renderEvents(); search.focus();
  });
  document.querySelector('#contact-event-message').addEventListener('click', () => openContact('event', catalog.find(event => event.id === selectedEventId)));
  for (const modal of [dialog, finder]) {
    modal.querySelector('[data-close-contact]').addEventListener('click', () => modal.close());
    modal.addEventListener('click', event => {
      const rect = modal.getBoundingClientRect();
      if (event.target === modal && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) modal.close();
    });
    modal.addEventListener('close', () => {
      if (modal === dialog) saveDraft();
      if (modal === finder) document.querySelector('#contact-event-map').removeAttribute('src');
      if (!dialog.open && !finder.open) {
        document.body.classList.remove('contact-modal-open');
        launcher?.focus();
      }
    });
  }
})();
