/* Shared prototype rules. Production must enforce these on the server too. */
(function (root) {
  const classes = ['štěňat', 'dorostu', 'mladých', 'mezitřída', 'otevřená', 'pracovní', 'šampionů', 'veteránů'];
  const normalize = value => String(value || '').normalize('NFC').trim().toLocaleLowerCase('cs');
  const normalizeBreed = value => normalize(value).replace(/retrívr/g, 'retriever');
  const classLabel = value => value === 'mezitřída' ? 'Mezitřída' : `Třída ${value}`;
  function duplicate(event, dogId, dog, applications) {
    return applications.some(item => Number(item.eventId) === Number(event.id) && (
      item.dogId === dogId ||
      (dog.chip && normalize(item.dogChip) === normalize(dog.chip)) ||
      (dog.registration && normalize(item.dogRegistration) === normalize(dog.registration))
    ));
  }
  function availability(event, now = new Date()) {
    if (!event || event.status !== 'published') return 'Výstava není zveřejněná';
    if (new Date(`${event.endDate || event.date}T23:59:59`) < now) return 'Výstava již proběhla';
    if (new Date(event.deadlineAt) <= now) return 'Přihlášky jsou po uzávěrce';
    if (event.dogs >= event.capacity) return 'Kapacita výstavy je naplněná';
    return '';
  }
  function allowedClasses(event, dog) {
    const breed = Object.keys(event.breedClasses || {}).find(name => normalizeBreed(name) === normalizeBreed(dog?.breed));
    return breed ? event.breedClasses[breed] : [];
  }
  function eligibility(event, dogId, dog, applications, now = new Date()) {
    if (!dog) return 'Nejprve přidejte psa do svého profilu';
    if (duplicate(event, dogId, dog, applications)) return 'Pes už je na tuto výstavu přihlášený';
    const closed = availability(event, now);
    if (closed) return closed;
    if (!allowedClasses(event, dog).length) return 'Plemeno není pro tuto výstavu povolené';
    return '';
  }
  function price(event, ownerId, applications) {
    const previous = applications.some(item => Number(item.eventId) === Number(event.id) && item.ownerId === ownerId);
    return previous && event.additionalDogPrice != null ? event.additionalDogPrice : event.price;
  }
  function validateEvent(event, catalog) {
    if (![event.title, event.city, event.venue, event.organizer, event.contact, event.type].every(value => String(value || '').trim())) return 'Vyplňte všechny povinné základní údaje.';
    if (!['Národní', 'Mezinárodní', 'Klubová', 'Speciální'].includes(event.type)) return 'Vyberte typ výstavy.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.contact)) return 'Zadejte platný kontaktní e-mail.';
    const start = new Date(`${event.date}T${event.startTime}`);
    const end = new Date(`${event.endDate}T23:59:59`);
    const deadline = new Date(event.deadlineAt);
    if (![start, end, deadline].every(date => Number.isFinite(date.getTime()))) return 'Vyplňte platné datum, čas a uzávěrku.';
    if (end < start) return 'Konec výstavy nesmí předcházet jejímu začátku.';
    if (deadline > start) return 'Uzávěrka přihlášek musí být nejpozději při zahájení výstavy.';
    if (!Number.isInteger(event.capacity) || event.capacity < Math.max(1, event.dogs || 0)) return 'Kapacita musí být celé kladné číslo a nesmí být nižší než počet přihlášených psů.';
    if (!Number.isFinite(event.price) || event.price < 0 || (event.additionalDogPrice != null && (!Number.isFinite(event.additionalDogPrice) || event.additionalDogPrice < 0))) return 'Cena musí být nezáporné číslo.';
    const breeds = Object.entries(event.breedClasses || {});
    if (!breeds.length) return 'Přidejte alespoň jedno povolené plemeno.';
    for (const [breed, selected] of breeds) {
      if (!catalog.includes(breed)) return `Plemeno ${breed} není v katalogu ČMKU.`;
      if (!Array.isArray(selected) || !selected.length || selected.some(item => !classes.includes(item))) return `Vyberte alespoň jednu platnou třídu pro plemeno ${breed}.`;
    }
    return '';
  }
  function submit(event, dogId, dog, showClass, applications, ownerId, now = new Date()) {
    const error = eligibility(event, dogId, dog, applications, now);
    if (error) throw new Error(error);
    if (!allowedClasses(event, dog).includes(showClass)) throw new Error('Vyberte povolenou výstavní třídu.');
    const record = {
      id: `application-${event.id}-${dogId}-${now.getTime()}`,
      eventId: event.id, dogId, ownerId, dogChip: dog.chip, dogRegistration: dog.registration,
      dog: dog.fullName, breed: dog.breed, showClass: classLabel(showClass), classValue: showClass,
      amount: price(event, ownerId, applications), submittedAt: now.toISOString(), payment: 'pending', docs: 'Čeká na kontrolu',
    };
    applications.push(record);
    event.dogs += 1;
    return record;
  }
  const api = { classes, classLabel, duplicate, availability, allowedClasses, eligibility, price, validateEvent, submit };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.EventRules = api;
})(typeof window !== 'undefined' ? window : globalThis);
