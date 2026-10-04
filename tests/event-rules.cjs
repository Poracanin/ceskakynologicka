const test = require('node:test');
const assert = require('node:assert/strict');
const rules = require('../event-rules.js');
const catalog = require('../plemena-cmku.json').plemena.map(item => item.nazev);
const now = new Date('2027-03-01T12:00:00');
const dog = { fullName: 'Argo', breed: 'Zlatý retrívr', chip: '123', registration: 'CZ/1' };
const exhibition = () => ({ id: 7, title: 'Jarní výstava', type: 'Klubová', city: 'Praha', venue: 'Areál', organizer: 'Klub', contact: 'klub@example.cz',
  date: '2027-04-10', endDate: '2027-04-10', startTime: '09:00', deadlineAt: '2027-04-01T23:59', capacity: 20, dogs: 0, price: 850, additionalDogPrice: 650,
  status: 'published', breedClasses: { 'Zlatý retriever': ['otevřená'], 'Border kolie': ['mladých', 'otevřená'] } });
test('accepts 20 catalogue breeds and rejects an empty or invented breed/class', () => {
  const event = exhibition();
  assert.equal(rules.validateEvent(event, catalog), '');
  event.breedClasses = Object.fromEntries(catalog.slice(0, 20).map(breed => [breed, [...rules.classes]]));
  assert.equal(rules.validateEvent(event, catalog), '');
  event.breedClasses = {};
  assert.match(rules.validateEvent(event, catalog), /alespoň jedno/);
  event.breedClasses = { 'Vymyšlené plemeno': ['otevřená'] };
  assert.match(rules.validateEvent(event, catalog), /katalogu/);
  event.breedClasses = { 'Zlatý retriever': [] };
  assert.match(rules.validateEvent(event, catalog), /třídu/);
});
test('rejects invalid dates, a late deadline, negative prices and insufficient capacity', () => {
  for (const patch of [{ endDate: '2027-04-09' }, { deadlineAt: '2027-04-11T12:00' }, { date: '' }, { startTime: '' }, { price: -1 }, { price: NaN }, { additionalDogPrice: -1 }, { capacity: 1.5 }, { capacity: 1, dogs: 2 }]) {
    assert.notEqual(rules.validateEvent({ ...exhibition(), ...patch }, catalog), '', JSON.stringify(patch));
  }
});
test('blocks wrong breed, unpublished, expired and full exhibitions', () => {
  assert.match(rules.eligibility(exhibition(), 'd', { ...dog, breed: 'Mops' }, [], now), /Plemeno/);
  for (const patch of [{ status: 'draft' }, { deadlineAt: '2027-02-28T23:59' }, { dogs: 20 }]) {
    assert.notEqual(rules.eligibility({ ...exhibition(), ...patch }, 'd', dog, [], now), '');
  }
  assert.match(rules.eligibility(exhibition(), 'd', dog, [], new Date('2027-04-11')), /proběhla/);
});
test('registration is atomic, priced from the event and unique by dog id, chip and registration', () => {
  const event = exhibition(); const records = [];
  const result = rules.submit(event, 'argo', dog, 'otevřená', records, 'owner', now);
  assert.equal(result.amount, 850); assert.equal(records.length, 1); assert.equal(event.dogs, 1);
  for (const [id, candidate] of [['argo', dog], ['copy', { ...dog, registration: 'different' }], ['copy', { ...dog, chip: 'different' }]]) {
    assert.throws(() => rules.submit(event, id, candidate, 'otevřená', records, 'owner', now), /už je/);
  }
  assert.equal(records.length, 1); assert.equal(event.dogs, 1);
  const second = rules.submit(event, 'bella', { ...dog, chip: '456', registration: 'CZ/2', breed: 'Border kolie' }, 'mladých', records, 'owner', now);
  assert.equal(second.amount, 650); assert.equal(event.dogs, 2);
  event.price = 1200; assert.equal(result.amount, 850, 'existing price snapshot stays unchanged');
});
test('rechecks classes, deadline and capacity at submission', () => {
  const event = exhibition(); const records = [];
  assert.throws(() => rules.submit(event, 'd', dog, 'mladých', records, 'owner', now), /třídu/);
  event.dogs = event.capacity;
  assert.throws(() => rules.submit(event, 'd', dog, 'otevřená', records, 'owner', now), /Kapacita/);
  event.dogs = 0; event.deadlineAt = '2027-02-28T23:59';
  assert.throws(() => rules.submit(event, 'd', dog, 'otevřená', records, 'owner', now), /uzávěrce/);
  assert.equal(records.length, 0); assert.equal(event.dogs, 0);
});
test('same dog can enter another exhibition; zero price and no discount are valid', () => {
  const first = exhibition(); const records = [];
  rules.submit(first, 'd', dog, 'otevřená', records, 'owner', now);
  const second = { ...exhibition(), id: 8, price: 0, additionalDogPrice: null };
  assert.equal(rules.submit(second, 'd', dog, 'otevřená', records, 'owner', now).amount, 0);
});
