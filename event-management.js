/* UI for the shared, in-memory exhibition catalogue. */
let editingEventId = null;
let currentAdminEventId = null;
const demoOwnerId = 'member-demo';
const money = value => `${Number(value).toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} Kč`;
const dateText = value => new Date(`${value}T12:00:00`).toLocaleDateString('cs-CZ');
const deadlineText = value => new Date(value).toLocaleString('cs-CZ', { dateStyle: 'short', timeStyle: 'short' });
const eventRecords = id => registrations.filter(item => Number(item.eventId) === Number(id));
const adminSidebarMedia = window.matchMedia('(max-width: 820px)');
let adminDesktopSidebarOpen = false;

function setAdminSidebar(open, { focus = true } = {}) {
  const sidebar = document.querySelector('#admin-sidebar');
  const toggle = document.querySelector('#admin-sidebar-toggle');
  const main = adminPortal.querySelector('.portal-main');
  const backdrop = adminPortal.querySelector('.admin-sidebar-backdrop');
  const mobile = adminSidebarMedia.matches;
  const focusWasInSidebar = sidebar.contains(document.activeElement) || document.activeElement === backdrop;
  if (!mobile) adminDesktopSidebarOpen = open;
  adminPortal.classList.toggle('admin-sidebar-hidden', !open);
  sidebar.hidden = !open;
  sidebar.inert = !open;
  main.inert = mobile && open;
  backdrop.hidden = !mobile || !open;
  toggle.setAttribute('aria-expanded', String(open));
  const label = open ? 'Schovat boční panel' : 'Otevřít boční panel';
  toggle.setAttribute('aria-label', label);
  toggle.title = label;
  toggle.querySelector('.admin-panel-chevron').setAttribute('d', open ? 'm15 9-3 3 3 3' : 'm12 9 3 3-3 3');
  if (!focus || adminPortal.hidden) return;
  if (mobile && open) sidebar.querySelector('[data-admin-sidebar-close]').focus();
  else if (focusWasInSidebar) toggle.focus();
}

function initializeAdminSidebar() {
  const sidebar = document.querySelector('#admin-sidebar');
  document.querySelector('#admin-sidebar-toggle').addEventListener('click', () => setAdminSidebar(sidebar.hidden));
  adminPortal.querySelectorAll('[data-admin-sidebar-close]').forEach(button => {
    button.addEventListener('click', () => setAdminSidebar(false));
  });
  adminSidebarMedia.addEventListener('change', () => setAdminSidebar(adminSidebarMedia.matches ? false : adminDesktopSidebarOpen));
  adminPortal.addEventListener('keydown', event => {
    if (!adminSidebarMedia.matches || sidebar.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setAdminSidebar(false);
    } else if (event.key === 'Tab') {
      const controls = [...sidebar.querySelectorAll('button:not(:disabled), a[href]')];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
  setAdminSidebar(false, { focus: false });
}

function decorateEvent(event) {
  const date = new Date(`${event.date}T12:00:00`);
  event.day = String(date.getDate()).padStart(2, '0');
  event.month = date.toLocaleDateString('cs-CZ', { month: 'long' });
  event.weekday = date.toLocaleDateString('cs-CZ', { weekday: 'long' });
  event.deadline = deadlineText(event.deadlineAt);
  return event;
}

function initializeEventManagement() {
  initializeAdminSidebar();
  const catalog = window.CMKU_DATA?.plemena || [];
  events.forEach(event => {
    const [day, month, year] = event.deadline.match(/\d+/g);
    const breeds = catalog.filter(breed => event.id === 3 ? breed.nazev.toLocaleLowerCase('cs').includes('retriever') : event.id === 6 ? breed.skupina_cislo === 1 : true);
    Object.assign(event, { status: 'published', endDate: event.date, startTime: '09:00', price: event.id === 3 ? 850 : 1100, additionalDogPrice: null,
      deadlineAt: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59`,
      breedClasses: Object.fromEntries(breeds.map(breed => [breed.nazev, [...EventRules.classes]])) });
    decorateEvent(event);
  });
  registrations.forEach((record, index) => { record.eventId = [1, 1, 2, 2, 3, 6][index]; record.id = `seed-${index}`; });
  Object.entries(memberApplications).forEach(([key, application]) => {
    const eventId = { brno: 1, prague: 2, retriever: 3 }[key];
    const dog = memberDogs[application.dogId];
    Object.assign(application, { eventId, submittedAt: '2026-08-14T10:00:00', docs: application.statusClass === 'review' ? 'Čeká na kontrolu' : 'Ověřeno' });
    registrations.push({ id: key, eventId, dogId: application.dogId, dogChip: dog.chip, dogRegistration: dog.registration, ownerId: demoOwnerId,
      name: demoMemberName, email: 'petr.novak@email.cz', dog: dog.fullName, breed: dog.breed, showClass: application.showClass, docs: application.docs,
      amount: eventId === 3 ? 850 : 1100, payment: application.statusClass === 'paid' ? 'paid' : 'pending', date: '14. 8. 2026 10:00' });
  });
  events.forEach(event => { event.dogs = eventRecords(event.id).length; });
  refreshEventViews();
  renderMemberApplications();
}

function refreshEventViews() {
  Object.values(memberApplications).forEach(application => {
    const event = events.find(item => item.id === application.eventId);
    if (!event) return;
    application.title = event.title;
    application.place = `${event.venue}, ${event.city} · ${dateText(event.date)} · ${event.startTime}`;
  });
  const selectedDate = dateFilter.value;
  dateFilter.innerHTML = '<option value="all">Všechny termíny</option>' + [...new Set(events.filter(event => event.status === 'published').map(event => event.date))].sort().map(date => `<option value="${escapeHTML(date)}">${dateText(date)}</option>`).join('');
  dateFilter.value = [...dateFilter.options].some(option => option.value === selectedDate) ? selectedDate : 'all';
  renderEvents();
  renderMemberEvents();
  renderAdminEvents();
  renderMemberApplications();
}

function eventStatus(event) {
  if (event.status === 'draft') return 'Koncept';
  return EventRules.availability(event) || 'Přihlašování otevřeno';
}

function renderAdminEvents() {
  const query = document.querySelector('#admin-event-search').value.trim().toLocaleLowerCase('cs');
  const status = document.querySelector('#admin-event-status').value;
  const now = new Date();
  const filtered = events.filter(event => {
    const past = new Date(`${event.endDate}T23:59:59`) < now;
    return `${event.title} ${event.city} ${event.venue}`.toLocaleLowerCase('cs').includes(query) &&
      (status === 'all' || status === event.status || (status === 'past' && past && event.status === 'published') || (status === 'upcoming' && !past && event.status === 'published'));
  }).sort((a, b) => b.id - a.id);
  const panel = document.querySelector('#admin-show-registrations');
  // The expanded registration panel lives directly after its exhibition row.
  document.querySelector('[data-admin-content="admin-events"]').append(panel);
  panel.hidden = true;
  document.querySelector('#admin-event-total').textContent = events.length;
  document.querySelector('#admin-filter-count').textContent = `${filtered.length} výstav`;
  document.querySelector('#admin-event-list').innerHTML = filtered.map(event => `
    <article class="managed-event-row" data-admin-event-row="${event.id}">
      <div class="managed-event-title"><span>${escapeHTML(event.type)}</span><button type="button" data-admin-event-detail="${event.id}">${escapeHTML(event.title)}</button><small>${escapeHTML(event.venue)}, ${escapeHTML(event.city)}</small></div>
      <div><b>${dateText(event.date)}${event.endDate !== event.date ? ` – ${dateText(event.endDate)}` : ''}</b><small>Zahájení ${escapeHTML(event.startTime)}</small><small>Uzávěrka ${escapeHTML(event.deadline)}</small></div>
      <div><b>${Object.keys(event.breedClasses).length} plemen</b><small>${money(event.price)} / pes</small></div>
      <div><span class="status-badge ${event.status === 'draft' ? 'review' : 'paid'}">${escapeHTML(eventStatus(event))}</span><button class="managed-applications" type="button" data-admin-show-registrations="${event.id}" aria-expanded="false">${event.dogs} / ${event.capacity} psů · Přihlášky ↓</button></div>
      <div class="managed-event-actions"><button class="outline-button" type="button" data-edit-event="${event.id}">Upravit</button><button type="button" data-admin-event-detail="${event.id}">Detail →</button></div>
    </article>`).join('') || '<p class="event-notice">Žádná výstava neodpovídá filtru.</p>';
}

function openEventEditor(id = null) {
  if (!adminSessionActive) return;
  const event = id == null ? null : events.find(item => item.id === Number(id));
  editingEventId = event?.id || null;
  const form = document.querySelector('#event-create-form');
  form.reset();
  selectedEventBreeds.clear(); eventBreedClasses.clear(); activeEventBreed = null;
  document.querySelector('#event-breed-search').value = '';
  document.querySelector('#event-form-error').hidden = true;
  document.querySelector('#event-form-title').textContent = event ? 'Upravit výstavu' : 'Vytvořit výstavu';
  document.querySelector('#event-form-eyebrow').textContent = event ? event.title : 'Nová akce';
  document.querySelector('#event-save-draft').hidden = event?.status === 'published';
  document.querySelector('#event-save-publish').textContent = event?.status === 'published' ? 'Uložit změny' : 'Zveřejnit výstavu →';
  if (event) {
    const values = { eventName: event.title, eventType: event.type, eventOrganizer: event.organizer, eventEmail: event.contact, eventFrom: event.date,
      eventTo: event.endDate, eventStartTime: event.startTime, eventCity: event.city, eventVenue: event.venue, eventCapacity: event.capacity,
      eventDeadline: event.deadlineAt, eventPrice: event.price, eventAdditionalDogPrice: event.additionalDogPrice ?? '', eventDescription: event.description, eventNote: event.internalNote || '' };
    Object.entries(values).forEach(([name, value]) => { form.elements[name].value = value; });
    Object.entries(event.breedClasses).forEach(([breed, classes]) => { selectedEventBreeds.add(breed); eventBreedClasses.set(breed, new Set(classes)); });
    activeEventBreed = [...selectedEventBreeds][0] || null;
  }
  renderEventBreedSelector();
  switchAdminPanel('admin-create-event');
  document.querySelector('#admin-panel-title').textContent = event ? 'Upravit výstavu' : 'Vytvořit výstavu';
}

function saveManagedEvent(submission) {
  submission.preventDefault();
  if (!adminSessionActive) return;
  const form = submission.currentTarget;
  const error = document.querySelector('#event-form-error');
  error.hidden = true;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const data = new FormData(form);
  const text = key => String(data.get(key) || '').trim();
  const existing = events.find(item => item.id === editingEventId);
  const event = { id: existing?.id || Math.max(0, ...events.map(item => item.id)) + 1, dogs: existing?.dogs || 0,
    title: text('eventName'), type: text('eventType'), city: text('eventCity'), venue: text('eventVenue'), date: text('eventFrom'), endDate: text('eventTo'),
    startTime: text('eventStartTime'), organizer: text('eventOrganizer'), contact: text('eventEmail'), capacity: Number(data.get('eventCapacity')),
    deadlineAt: text('eventDeadline'), price: Number(data.get('eventPrice')), additionalDogPrice: text('eventAdditionalDogPrice') === '' ? null : Number(data.get('eventAdditionalDogPrice')),
    description: text('eventDescription'), internalNote: text('eventNote'), judges: existing?.judges || 'Bude upřesněno v propozicích',
    status: existing?.status === 'published' ? 'published' : submission.submitter?.value === 'published' ? 'published' : 'draft',
    breedClasses: Object.fromEntries([...selectedEventBreeds].map(breed => [breed, [...ensureEventBreedClasses(breed)]])) };
  const message = EventRules.validateEvent(event, breedCatalog.map(breed => breed.nazev));
  if (message) { error.textContent = message; error.hidden = false; error.scrollIntoView({ block: 'center' }); return; }
  decorateEvent(event);
  if (existing) Object.assign(existing, event); else events.push(event);
  refreshEventViews();
  openAdminEventDetail(event.id);
  showToast(event.status === 'published' ? 'Výstava je zveřejněná. Nastavení se promítlo do kalendáře i přihlášek.' : 'Koncept uložen. Vystavovatelé jej uvidí až po zveřejnění.');
}

function showAdminEventDetail(id) {
  const event = events.find(item => item.id === Number(id));
  if (!event) return;
  currentAdminEventId = event.id;
  const records = eventRecords(event.id);
  const paid = records.filter(record => record.payment === 'paid');
  document.querySelector('#admin-detail-title').textContent = event.title;
  document.querySelector('#admin-detail-copy').textContent = `${eventStatus(event)} · ${event.type}`;
  document.querySelector('#admin-detail-edit').dataset.editEvent = event.id;
  document.querySelector('#admin-detail-dogs').textContent = `${event.dogs} / ${event.capacity}`;
  document.querySelector('#admin-detail-paid').textContent = paid.length;
  document.querySelector('#admin-detail-revenue').textContent = money(paid.reduce((sum, record) => sum + record.amount, 0));
  document.querySelector('#admin-detail-deadline').textContent = event.deadline;
  document.querySelector('#admin-detail-exhibitors').textContent = new Set(records.map(record => record.ownerId || record.email)).size;
  document.querySelector('#admin-detail-registration-total').textContent = records.length;
  document.querySelector('#admin-event-facts').innerHTML = `<div><span>Termín a čas</span><b>${dateText(event.date)}${event.endDate !== event.date ? ` – ${dateText(event.endDate)}` : ''} · ${escapeHTML(event.startTime)}</b></div><div><span>Místo</span><b>${escapeHTML(event.venue)}, ${escapeHTML(event.city)}</b></div><div><span>Cena za psa</span><b>${money(event.price)}</b>${event.additionalDogPrice != null ? `<small>Další pes ${money(event.additionalDogPrice)}</small>` : ''}</div>`;
  document.querySelector('#admin-breed-total').textContent = `(${Object.keys(event.breedClasses).length})`;
  document.querySelector('#admin-detail-breeds').innerHTML = Object.entries(event.breedClasses).map(([breed, classes]) => `<div><b>${escapeHTML(breed)}</b><span>${classes.map(EventRules.classLabel).map(escapeHTML).join(', ')}</span></div>`).join('');
  renderAdminDetailRegistrationRows();
  switchAdminPanel('admin-event-detail');
}

function renderMemberApplications() {
  document.querySelectorAll('[data-member-panel="applications"] > b').forEach(badge => { badge.textContent = Object.keys(memberApplications).length; });
  document.querySelector('#member-application-list').innerHTML = Object.entries(memberApplications).reverse().map(([id, app]) => {
    const event = events.find(event => event.id === app.eventId);
    const dog = memberDogs[app.dogId];
    return `<article><div class="member-application-date"><b>${event.day}</b><span>${escapeHTML(event.month)} ${event.date.slice(0, 4)}</span></div><div class="member-application-main"><span>${escapeHTML(event.type)} výstava</span><h2>${escapeHTML(app.title)}</h2><p>${escapeHTML(app.place)}</p></div><div class="member-application-dog"><span>Přihlášený pes</span><b>${escapeHTML(dog.fullName)}</b><small>${escapeHTML(app.showClass)}</small></div><div class="member-application-state"><span class="status-badge ${app.statusClass}">${escapeHTML(app.status)}</span><small>${escapeHTML(app.price)}</small></div><button type="button" data-member-application-detail="${escapeHTML(id)}">Detail →</button></article>`;
  }).join('');
}

function submitManagedApplication(submission) {
  submission.preventDefault();
  if (!memberSessionActive) { navigatePublic('prihlaseni'); return; }
  if (!applicationForm.checkValidity()) { applicationForm.reportValidity(); return; }
  const dogId = applicationForm.elements.applicationDog.value;
  const dog = memberDogs[dogId];
  try {
    const record = EventRules.submit(currentApplicationEvent, dogId, dog, applicationForm.elements.showClass.value, registrations, demoOwnerId);
    Object.assign(record, { name: demoMemberName, email: document.querySelector('#profile-form [name="profileEmail"]')?.value || 'petr.novak@email.cz', date: new Date(record.submittedAt).toLocaleString('cs-CZ'), paymentMethod: applicationForm.elements.paymentMethod.value });
    memberApplications[record.id] = { eventId: record.eventId, dogId, title: currentApplicationEvent.title, place: `${currentApplicationEvent.venue}, ${currentApplicationEvent.city} · ${dateText(currentApplicationEvent.date)} · ${currentApplicationEvent.startTime}`,
      showClass: record.showClass, status: 'Čeká na platbu', statusClass: 'pending', price: money(record.amount), submittedAt: record.submittedAt, docs: record.docs,
      paymentDate: 'Dosud neuhrazeno', paymentNote: 'Demo přihláška · platba nebyla přijata', action: 'Zobrazit platební údaje →', actionMessage: 'Demo platební údaje' };
    refreshEventViews(); renderMemberApplications();
    openMemberApplicationDetail(record.id);
    showToast('Přihláška je v přehledu i u pořadatele. Demo data se při obnovení stránky ztratí.');
  } catch (error) {
    renderApplicationDogOptions();
    document.querySelector('#application-eligibility-note').textContent = error.message;
    showToast(error.message);
  }
}
