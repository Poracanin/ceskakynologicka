const events = window.CK_EVENT_CATALOG.map(event => ({ ...event }));

const eventList = document.querySelector("#event-list");
const eventCount = document.querySelector("#event-count");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#event-search");
const typeFilter = document.querySelector("#type-filter");
const filterForm = document.querySelector("#event-filters");
const mobileFilterToggle = document.querySelector("#mobile-filter-toggle");
const dateFilter = document.querySelector("#date-filter");
const heroShell = document.querySelector(".hero-shell");
const heroAuthCard = document.querySelector("#hero-auth-card");
const heroLoginFace = document.querySelector(".auth-login-face");
const heroRegisterFace = document.querySelector(".auth-register-face");
const eventDialog = document.querySelector("#event-dialog");
const eventModalContent = document.querySelector("#event-modal-content");
const applicationForm = document.querySelector("#application-form");
const qrPaymentDialog = document.querySelector("#qr-payment-dialog");
const accountDialog = document.querySelector("#account-dialog");
const adminAccessDialog = document.querySelector("#admin-access-dialog");
const toast = document.querySelector("#toast");
const memberPortal = document.querySelector("#member-portal");
const adminPortal = document.querySelector("#admin-portal");
const firstLoginDialog = document.querySelector("#first-login-dialog");
const passwordSetupDialog = document.querySelector("#password-setup-dialog");
const breedPickerDialog = document.querySelector("#breed-picker-dialog");
const legalDialog = document.querySelector("#legal-dialog");

const allDialogs = [
  eventDialog,
  qrPaymentDialog,
  accountDialog,
  adminAccessDialog,
  firstLoginDialog,
  passwordSetupDialog,
  breedPickerDialog,
  legalDialog,
];

function setMobileFilters(open) {
  if (!filterForm || !mobileFilterToggle) return;
  filterForm.classList.toggle("mobile-open", open);
  mobileFilterToggle.setAttribute("aria-expanded", String(open));
  const stateLabel = mobileFilterToggle.querySelector("b");
  if (stateLabel) stateLabel.textContent = open ? "Skrýt filtry" : "Otevřít filtry";
}

mobileFilterToggle?.addEventListener("click", () => {
  setMobileFilters(mobileFilterToggle.getAttribute("aria-expanded") !== "true");
});

const registrations = [
  { date: "18. 8. 2026 09:42", name: "Petra Svobodová", email: "petra.svobodova@email.cz", dog: "Moonlight River", showClass: "Třída otevřená", docs: "Ověřeno", amount: 1100, payment: "paid" },
  { date: "18. 8. 2026 09:18", name: "Martin Dvořák", email: "martin.dvorak@email.cz", dog: "Baron Black Star", showClass: "Třída mladých", docs: "Čeká na kontrolu", amount: 1100, payment: "pending" },
  { date: "18. 8. 2026 08:56", name: "Lucie Procházková", email: "lucie.p@email.cz", dog: "Ariel Bohemian Joy", showClass: "Třída šampionů", docs: "Ověřeno", amount: 1250, payment: "paid" },
  { date: "18. 8. 2026 08:21", name: "Tomáš Kučera", email: "tomas.kucera@email.cz", dog: "Copper Field Henry", showClass: "Mezitřída", docs: "Ověřeno", amount: 1100, payment: "paid" },
  { date: "17. 8. 2026 22:47", name: "Eva Malá", email: "eva.mala@email.cz", dog: "Iris z Vltavského údolí", showClass: "Třída pracovní", docs: "Chybí certifikát", amount: 1250, payment: "pending" },
  { date: "17. 8. 2026 21:35", name: "Ondřej Jelínek", email: "ondrej.jelinek@email.cz", dog: "Lucky North Wind", showClass: "Třída veteránů", docs: "Ověřeno", amount: 850, payment: "paid" },
];

const memberDogs = {
  argo: {
    callName: "Argo",
    fullName: "Argo Golden Forest",
    registration: "ČLP/GR/24440",
    chip: "953010004521678",
    tattoo: "",
    birth: "2022-04-12",
    sex: "Pes",
    variety: "Bez variety",
    kennel: "Golden Forest",
    breeder: "Marie Novotná",
    breedGroup: "8 — Retrívři, slídiči a vodní psi",
    breed: "Zlatý retrívr",
    fatherRegistration: "ČLP/GR/16590",
    fatherName: "Diamond Derrick Golden Martha",
    motherRegistration: "ČLP/GR/21847",
    motherName: "Trinity z Havlova dvora",
    status: "Profil kompletní",
    documents: [
      { type: "PDF", title: "Průkaz původu — Argo", file: "argo-prukaz-puvodu.pdf · 1,8 MB", status: "Ověřeno" },
      { type: "JPG", title: "Výsledek RTG", file: "rtg-argo.jpg · 920 kB", status: "Čeká na kontrolu" },
    ],
    awards: [
      { day: "12", month: "KVĚ", result: "V1 · CAC", title: "Klubová výstava retrívrů", detail: "Třída otevřená · rozhodčí Marie Novotná", file: "diplom-klubova-vystava.pdf" },
      { day: "18", month: "DUB", result: "V1 · CACIB", title: "Jarní mezinárodní výstava Praha", detail: "Třída otevřená · rozhodčí Petr Vacek", file: "posudek-praha.jpg" },
    ],
  },
  bella: {
    callName: "Bella",
    fullName: "Bella z Lučního dvora",
    registration: "CMKU/BOC/12988",
    chip: "953010006743112",
    tattoo: "",
    birth: "2023-11-02",
    sex: "Fena",
    variety: "Dlouhosrstá",
    kennel: "z Lučního dvora",
    breeder: "Pavel Černý",
    breedGroup: "1 — Ovčáčtí a honáčtí psi",
    breed: "Border kolie",
    fatherRegistration: "CMKU/BOC/9831",
    fatherName: "Northwind Blue Star",
    motherRegistration: "CMKU/BOC/11042",
    motherName: "Aira Black Meadow",
    status: "Čeká na ověření PP",
    documents: [{ type: "PDF", title: "Průkaz původu — Bella", file: "bella-prukaz-puvodu.pdf · 1,4 MB", status: "Čeká na kontrolu" }],
    awards: [],
  },
};

let currentMemberDogId = "argo";
let breedCatalog = [];
let breedGroups = [];
let breedPickerMode = "breed";
let selectedBreedGroupNumber = null;
let breedPickerIgnoreGroup = false;
let dogCreatePhotoUrl = "";
let dogFormMode = "create";
let memberSessionActive = false;
const demoMemberName = "Petr Novák";
const selectedEventBreeds = new Set();
const eventBreedClasses = new Map();
let activeEventBreed = null;

const memberApplications = {
  prague: { title: "Prague Expo Dog", place: "PVA EXPO Letňany · 5. 9. 2026", dogId: "argo", showClass: "Třída otevřená", status: "Zaplaceno", statusClass: "paid", price: "1 100 Kč", paymentDate: "16. 8. 2026", paymentNote: "Uhrazeno QR platbou", action: "Stáhnout potvrzení →", actionMessage: "Potvrzení o platbě je připravené ke stažení." },
  brno: { title: "Národní výstava psů Brno", place: "BVV — Výstaviště Brno · 29. 8. 2026", dogId: "bella", showClass: "Třída mladých", status: "Čeká na platbu", statusClass: "pending", price: "1 100 Kč", paymentDate: "Dosud neuhrazeno", paymentNote: "Platba zatím nebyla přijata", action: "Zaplatit 1 100 Kč →", actionMessage: "Platební brána je připravená k otevření." },
  retriever: { title: "Klubová výstava retrívrů", place: "Zámecký park Konopiště · 12. 9. 2026", dogId: "argo", showClass: "Třída otevřená", status: "Kontrola dokladů", statusClass: "review", price: "850 Kč", paymentDate: "Čeká na ověření dokladů", paymentNote: "Platba bude zpřístupněna po kontrole dokladů", action: "Zobrazit doklady →", actionMessage: "Otevírám dokumenty přihlášeného psa." },
};

const legalDocuments = {
  privacy: `
    <p class="eyebrow dark">Účinné od 18. srpna 2026</p>
    <h1>Informace o zpracování osobních údajů</h1>
    <p class="legal-lead">Tento dokument vysvětluje, jak Česká kynologická, z. s. používá údaje při vedení účtu, správě profilů psů, přijímání přihlášek na akce, zpracování plateb a zasílání dobrovolných novinek.</p>
    <div class="legal-box"><b>Správce:</b> Česká kynologická, z. s., IČO 22254862, se sídlem Plzeňská 86/38, Beroun-Město, 266 01 Beroun, sp. zn. L 79663/MSPH. Kontakt pro ochranu osobních údajů: <a href="mailto:info@ceskakynologicka.cz">info@ceskakynologicka.cz</a>.</div>
    <h2>1. Jaké údaje zpracováváme</h2>
    <ul><li>identifikační a kontaktní údaje: jméno, příjmení, adresa, telefon a e-mail;</li><li>údaje účtu: bezpečně uložený otisk hesla, stav účtu, historie přihlášení a nastavení komunikace;</li><li>údaje k profilům psů a přihláškám: údaje z průkazu původu, registrační číslo, číslo čipu, pohlaví, datum narození, zvolená třída a přiložené dokumenty; některé dokumenty mohou obsahovat údaje chovatele nebo vlastníka;</li><li>údaje o akcích a platbách: přihlášená výstava, čas odeslání, částka, variabilní symbol, stav a identifikace platby; přístupové údaje k vašemu bankovnictví nezpracováváme;</li><li>technické a bezpečnostní údaje: IP adresa, typ zařízení, čas a záznamy o činnosti nutné pro zabezpečení a řešení incidentů;</li><li>údaj o udělení nebo odvolání marketingového souhlasu včetně času, zdroje a znění souhlasu.</li></ul>
    <h2>2. Účely a právní důvody</h2>
    <ul><li><b>Účet, profily psů, přihlášky, platby a provozní zprávy:</b> plnění smlouvy a kroky před jejím uzavřením podle čl. 6 odst. 1 písm. b) GDPR. Bez povinných údajů nelze účet nebo přihlášku vyřídit.</li><li><b>Účetní a jiné zákonné povinnosti:</b> čl. 6 odst. 1 písm. c) GDPR.</li><li><b>Zabezpečení, prevence zneužití, ochrana a vymáhání práv:</b> oprávněný zájem podle čl. 6 odst. 1 písm. f) GDPR. Proti tomuto zpracování můžete vznést námitku.</li><li><b>Newsletter, pozvánky a nabídky:</b> váš dobrovolný souhlas podle čl. 6 odst. 1 písm. a) GDPR a pravidel pro elektronická obchodní sdělení. Odvolání souhlasu nemá vliv na účet ani přihlášky.</li></ul>
    <p>Potvrzení o registraci, jednorázové heslo, bezpečnostní upozornění, změny přihlášky, platební informace a vstupní listy jsou provozní komunikací, nikoli newsletterem.</p>
    <h2>3. Komu mohou být údaje zpřístupněny</h2>
    <p>Údaje předáváme jen v nezbytném rozsahu pořadateli konkrétní výstavy, poskytovatelům hostingu a IT správy, e-mailové komunikace, úložiště dokumentů, platebních služeb, účetním a právním poradcům a orgánům veřejné moci, vyžaduje-li to zákon. Dodavatelé, kteří jednají jako zpracovatelé, smějí údaje používat pouze podle našich pokynů a smlouvy dle čl. 28 GDPR.</p>
    <p>Pokud by dodavatel zpracovával údaje mimo Evropský hospodářský prostor, použijeme odpovídající právní záruku, zejména rozhodnutí o odpovídající ochraně nebo standardní smluvní doložky. Informaci o aktuálních příjemcích a zárukách poskytneme na vyžádání.</p>
    <h2>4. Jak dlouho údaje uchováváme</h2>
    <ul><li>profil účtu a psa po dobu trvání účtu; po jeho zrušení zpravidla nejvýše 3 roky kvůli ochraně právních nároků, pokud není nutná delší zákonná lhůta;</li><li>přihlášky a související komunikaci po dobu konání akce a následně zpravidla 3 roky;</li><li>účetní a daňové doklady po zákonem stanovenou dobu, zpravidla až 10 let;</li><li>bezpečnostní logy zpravidla 12 měsíců, déle pouze při řešení incidentu;</li><li>marketingový souhlas do jeho odvolání, nejdéle však 3 roky od poslední prokazatelné aktivity; doklad o souhlasu můžeme poté uchovat po dobu nezbytnou k obhajobě práv.</li></ul>
    <h2>5. Vaše práva</h2>
    <p>Máte právo na přístup k údajům, opravu, výmaz, omezení zpracování, přenositelnost údajů a námitku proti zpracování založenému na oprávněném zájmu. Souhlas můžete kdykoli odvolat v profilu nebo odhlašovacím odkazem v každém marketingovém e-mailu. Můžete také podat stížnost u Úřadu pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7, <a href="https://uoou.gov.cz">uoou.gov.cz</a>.</p>
    <h2>6. Zabezpečení a automatizované rozhodování</h2>
    <p>Používáme přiměřená technická a organizační opatření, řízení přístupů, šifrovaný přenos, auditní záznamy a zálohování. Hesla nesmějí být v ostrém provozu ukládána v čitelné podobě. Neprovádíme rozhodování založené výhradně na automatizovaném zpracování, které by pro vás mělo právní nebo obdobně významné účinky.</p>
  `,
  terms: `
    <p class="eyebrow dark">Účinné od 18. srpna 2026</p>
    <h1>Podmínky používání portálu</h1>
    <p class="legal-lead">Tyto podmínky upravují používání portálu České kynologické, z. s., vedení uživatelského účtu a elektronické přihlašování psů na zveřejněné akce.</p>
    <div class="legal-box"><b>Provozovatel:</b> Česká kynologická, z. s., IČO 22254862, Plzeňská 86/38, Beroun-Město, 266 01 Beroun, sp. zn. L 79663/MSPH, e-mail <a href="mailto:info@ceskakynologicka.cz">info@ceskakynologicka.cz</a>.</div>
    <h2>1. Účet a přístup</h2>
    <p>Účet může založit osoba starší 18 let nebo zákonný zástupce. Uživatel uvádí pravdivé a aktuální údaje. Po registraci obdrží na ověřený e-mail jednorázové heslo s omezenou platností a při prvním přihlášení nastaví nové heslo. Přístupové údaje jsou nepřenosné; podezření na zneužití je nutné bezodkladně oznámit.</p>
    <h2>2. Profil psa a dokumenty</h2>
    <p>Uživatel odpovídá za správnost údajů přepsaných z průkazu původu a za oprávnění vložit poskytnuté dokumenty. Portál může označit dokument jako ověřený, toto označení však nenahrazuje kontrolu pořadatele nebo rozhodnutí kynologického orgánu.</p>
    <h2>3. Přihláška na výstavu</h2>
    <p>Před odesláním přihlášky jsou zobrazeny pořadatel, akce, pes, třída, cena a odkaz na propozice. Odesláním uživatel činí závaznou přihlášku a přijímá propozice konkrétní výstavy. Smluvní vztah k účasti vzniká podle znění propozic a potvrzení pořadatele. Pokud akci pořádá jiný subjekt, je tento subjekt poskytovatelem výstavní služby a odpovídá za její průběh.</p>
    <h2>4. Cena, platba, změny a storno</h2>
    <p>Cena a splatnost jsou uvedeny před odesláním a v propozicích. Přihláška se považuje za uhrazenou až po spárování platby. Možnost změny, odhlášení a vrácení poplatku se řídí propozicemi a právními předpisy. U služby volného času poskytované v určeném termínu se obecné čtrnáctidenní právo spotřebitele odstoupit od smlouvy zpravidla neuplatní; tím nejsou dotčena práva při zrušení akce nebo porušení povinností pořadatele.</p>
    <h2>5. Pravidla používání</h2>
    <p>Je zakázáno obcházet zabezpečení, používat účet jiné osoby, vkládat škodlivý obsah, neoprávněně získávat údaje jiných uživatelů nebo používat portál v rozporu s právem či dobrými mravy. Při závažném nebo opakovaném porušení můžeme účet dočasně omezit nebo zrušit; uživatele o důvodu informujeme, nebrání-li tomu bezpečnost či zákon.</p>
    <h2>6. Dostupnost a odpovědnost</h2>
    <p>Usilujeme o bezpečný a dostupný provoz, nemůžeme však zaručit nepřetržitou dostupnost. Plánovanou údržbu oznámíme, pokud je to přiměřeně možné. Odpovědnost nelze vyloučit tam, kde to zákon nepřipouští, zejména při újmě způsobené úmyslně nebo hrubou nedbalostí a ve vztahu k zákonným právům spotřebitele.</p>
    <h2>7. Reklamace, podněty a spory</h2>
    <p>Podnět k portálu nebo reklamaci zašlete na <a href="mailto:info@ceskakynologicka.cz">info@ceskakynologicka.cz</a>. Reklamaci konkrétní výstavy vyřizuje pořadatel uvedený v jejích propozicích. Je-li uživatel spotřebitelem a spor se nepodaří vyřešit přímo, může se obrátit na Českou obchodní inspekci, <a href="https://coi.gov.cz">coi.gov.cz</a>, pokud je pro daný vztah příslušná.</p>
    <h2>8. Změny podmínek</h2>
    <p>Podmínky můžeme přiměřeně změnit kvůli právním, bezpečnostním nebo funkčním změnám. O podstatné změně informujeme předem e-mailem nebo v účtu. Již odeslané přihlášky se řídí podmínkami a propozicemi účinnými při jejich odeslání, není-li změna pro uživatele výhodnější nebo vyžadována zákonem.</p>
  `,
  marketing: `
    <p class="eyebrow dark">Dobrovolné nastavení</p>
    <h1>Newsletter a e-mailová oznámení</h1>
    <p class="legal-lead">Provozní komunikaci oddělujeme od marketingu. Účet i přihlášky můžete používat bez souhlasu s newsletterem.</p>
    <h2>Co dostanete bez marketingového souhlasu</h2>
    <p>Jednorázové heslo, potvrzení registrace a přihlášky, platební údaje, bezpečnostní upozornění, informace o změně či zrušení přihlášené akce a vstupní list. Tyto zprávy jsou nutné k poskytnutí služby.</p>
    <h2>S čím souhlasíte dobrovolně</h2>
    <p>Se zasíláním newsletteru, pozvánek na další výstavy, vzdělávacího obsahu a nabídek České kynologické na zadaný e-mail. Pro personalizaci můžeme použít základní údaje o vašem profilu a navštívených či přihlášených akcích; nepoužíváme citlivé osobní údaje.</p>
    <div class="legal-box"><b>Správce:</b> Česká kynologická, z. s., IČO 22254862. <b>Právní důvod:</b> souhlas podle čl. 6 odst. 1 písm. a) GDPR a pravidel pro elektronická obchodní sdělení. <b>Doba:</b> do odvolání, nejdéle 3 roky od poslední prokazatelné aktivity.</div>
    <h2>Jak souhlas odvolat</h2>
    <p>Jedním přepínačem v sekci „Osobní údaje a souhlasy“, odhlašovacím odkazem v každém newsletteru nebo zprávou na <a href="mailto:info@ceskakynologicka.cz">info@ceskakynologicka.cz</a>. Odvolání je bezplatné a nemá vliv na zákonnost dřívějšího zasílání ani na provozní zprávy.</p>
    <p>Prokazatelně evidujeme datum, zdroj a znění uděleného či odvolaného souhlasu. Zaškrtnutí není předem nastavené a není podmínkou registrace.</p>
  `,
};

let currentApplicationEvent = events[0];
let toastTimer;
let pendingApplicationEventId = null;


function renderEvents() {
  const query = searchInput.value.trim().toLocaleLowerCase("cs");
  const selectedType = typeFilter.value;
  const selectedDate = dateFilter.value;

  const filtered = events.filter((event) => {
    const matchesDate = selectedDate === "all" || event.date === selectedDate;
    const matchesQuery = `${event.title} ${event.city} ${event.venue}`.toLocaleLowerCase("cs").includes(query);
    const matchesType = selectedType === "all" || event.type === selectedType;
    return event.status === "published" && matchesDate && matchesQuery && matchesType;
  });

  eventCount.textContent = filtered.length;
  eventList.innerHTML = filtered
    .map(
      (event, index) => `
        <article class="event-card" style="--i:${index}">
          <div class="event-date">
            <b>${event.day}</b>
            <span>${event.month}</span>
          </div>
          <div class="event-main">
            <span class="badge">${escapeHTML(event.type)}</span>
            <h3>${escapeHTML(event.title)}</h3>
            <p>${event.weekday} · uzávěrka <span class="deadline">${escapeHTML(event.deadline)}</span></p>
            <p class="event-excerpt">${escapeHTML(event.description)}</p>
          </div>
          <div class="event-place">
            <span>Místo konání</span>
            <b>${escapeHTML(event.city)}</b>
            <p>${escapeHTML(event.venue)}</p>
          </div>
          <div class="event-actions">
            ${memberSessionActive ? `
              <button class="details-event" type="button" data-event-detail="${event.id}">Detail výstavy →</button>
              <button class="register-event" type="button" data-event-register="${event.id}">Přihlásit psa</button>
            ` : `<span class="event-locked"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>Po přihlášení</span>`}
          </div>
        </article>
      `,
    )
    .join("");

  eventList.hidden = filtered.length === 0;
  emptyState.hidden = filtered.length !== 0;
}

function setHeroRegistration(open, shouldScroll = true) {
  if (shouldScroll) {
    navigatePublic(open ? "registrace" : "prihlaseni");
    return;
  }
  heroAuthCard.classList.toggle("registering", open);
  heroShell.classList.toggle("registration-open", open);
  heroLoginFace.setAttribute("aria-hidden", String(open));
  heroRegisterFace.setAttribute("aria-hidden", String(!open));
  heroLoginFace.inert = open;
  heroRegisterFace.inert = !open;
}

function showToast(message) {
  toast.querySelector("p").textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3600);
}

function openDialog(dialog) {
  if (dialog.open) return;
  dialog.showModal();
  document.body.classList.add("modal-open");
}

function closeDialog(dialog) {
  if (!dialog?.open) return;
  dialog.close();
  if (!allDialogs.some((item) => item?.open)) {
    document.body.classList.remove("modal-open");
  }
}

function openEventDetail(eventId) {
  if (!memberSessionActive) {
    pendingDetailEventId = Number(eventId);
    navigatePublic("prihlaseni");
    return;
  }
  const event = events.find((item) => item.id === Number(eventId));
  if (!event || event.status !== "published") return;
  eventModalContent.innerHTML = `
    <div class="modal-hero">
      <div>
        <span class="modal-badge">${escapeHTML(event.type)}</span>
        <h2>${escapeHTML(event.title)}</h2>
      </div>
    </div>
    <div class="event-modal-body">
      <div>
        <h3>O výstavě</h3>
        <p>${escapeHTML(event.description)}</p>
        <div class="modal-facts">
          <div><span>Datum a čas</span><b>${dateText(event.date)} · ${escapeHTML(event.startTime)}</b></div>
          <div><span>Místo</span><b>${escapeHTML(event.venue)}</b></div>
          <div><span>Posuzovatelé</span><b>${escapeHTML(event.judges)}</b></div>
          <div><span>Pořadatel</span><b>${escapeHTML(event.organizer)}</b></div>
        </div>
        <details class="event-allowed-breeds"><summary>Povolená plemena a třídy</summary>${Object.entries(event.breedClasses).map(([breed, classes]) => `<p><b>${escapeHTML(breed)}</b><br>${classes.map(EventRules.classLabel).map(escapeHTML).join(", ")}</p>`).join("")}</details><p>Propozice, veterinární podmínky a rozpis skupin budou dostupné po přihlášení v detailu přihlášky.</p>
      </div>
      <aside class="modal-side">
        <div><span>Přihlášeno</span><b>${event.dogs.toLocaleString("cs-CZ")} / ${event.capacity.toLocaleString("cs-CZ")} psů</b></div>
        <div><span>Uzávěrka</span><b>${escapeHTML(event.deadline)}</b></div>
        <div><span>Kontakt</span><b>${escapeHTML(event.contact)}</b></div><div><span>Cena za psa</span><b>${money(event.price)}</b></div><div><span>Povolená plemena</span><b>${Object.keys(event.breedClasses).length} plemen</b></div>
        <button class="gold-button" type="button" data-modal-register="${event.id}">Přihlásit psa <span>→</span></button>
      </aside>
    </div>
  `;
  openDialog(eventDialog);
}

function applicationClassForDog(dog) {
  if (!dog?.birth) return "Třída otevřená";
  const ageMonths = (new Date(currentApplicationEvent.date) - new Date(`${dog.birth}T12:00:00`)) / 2629800000;
  if (ageMonths < 18) return "Třída mladých";
  if (ageMonths >= 96) return "Třída veteránů";
  return "Třída otevřená";
}

function renderApplicationDogOptions() {
  const container = document.querySelector("#application-dog-options");
  const ids = Object.keys(memberDogs);
  const reasons = Object.fromEntries(ids.map(id => [id, EventRules.eligibility(currentApplicationEvent, id, memberDogs[id], registrations)]));
  const eligible = ids.filter(id => !reasons[id]);
  const previous = applicationForm.querySelector("[name='applicationDog']:checked")?.value;
  const preferredId = eligible.includes(previous) ? previous : eligible.includes(currentMemberDogId) ? currentMemberDogId : eligible[0];
  container.replaceChildren(...ids.map(id => {
    const dog = memberDogs[id];
    const label = document.createElement("label");
    label.className = `application-dog-choice${reasons[id] ? " unavailable" : ""}`;
    const checked = id === preferredId;
    label.classList.toggle("selected", checked);
    label.innerHTML = `<input type="radio" name="applicationDog" value="${escapeHTML(id)}" ${checked ? "checked" : ""} ${reasons[id] ? "disabled" : ""} required /><span>${escapeHTML(dogInitials(dog.fullName))}</span><div><b>${escapeHTML(dog.fullName)}</b><small>${escapeHTML(dog.breed)} · ${escapeHTML(dog.registration)}</small>${reasons[id] ? `<small class="dog-ineligible-reason">${escapeHTML(reasons[id])}</small>` : ""}</div><i>${reasons[id] ? "—" : "Vybrat"}</i>`;
    return label;
  }));
  document.querySelector("#application-eligibility-note").textContent = EventRules.availability(currentApplicationEvent) || (eligible.length ? "Každého psa lze na tuto výstavu přihlásit jednou. Vyberte psa a povolenou třídu." : "Žádný z vašich psů nyní nesplňuje podmínky přihlášení. Důvod najdete u každého profilu.");
  updateApplicationDogSelection();
}

function updateApplicationDogSelection() {
  const selected = applicationForm.querySelector("[name='applicationDog']:checked:not(:disabled)");
  applicationForm.querySelectorAll(".application-dog-choice").forEach(label => label.classList.toggle("selected", label.contains(selected)));
  const select = document.querySelector("#application-class");
  const allowed = selected ? EventRules.allowedClasses(currentApplicationEvent, memberDogs[selected.value]) : [];
  select.innerHTML = allowed.map(value => `<option value="${escapeHTML(value)}">${escapeHTML(EventRules.classLabel(value))}</option>`).join('');
  const preferred = applicationClassForDog(memberDogs[selected?.value]);
  const suggested = allowed.find(value => EventRules.classLabel(value) === preferred);
  if (suggested) select.value = suggested;
  select.disabled = !allowed.length;
  document.querySelector("#application-submit").disabled = !selected || !allowed.length;
  applicationForm.querySelectorAll('[name="paymentMethod"]').forEach(input => { input.disabled = !selected; });
  document.querySelectorAll('[data-application-price]').forEach(node => { node.textContent = money(EventRules.price(currentApplicationEvent, demoOwnerId, registrations)); });
}

function drawDemoQrCode() {
  const canvas = document.querySelector("#demo-qr-canvas");
  const context = canvas.getContext("2d");
  const modules = 29;
  const quietZone = 3;
  const moduleSize = 7;
  canvas.width = canvas.height = (modules + quietZone * 2) * moduleSize;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const inFinder = (x, y) => (x < 7 && y < 7) || (x >= modules - 7 && y < 7) || (x < 7 && y >= modules - 7);
  context.fillStyle = "#080808";
  for (let y = 0; y < modules; y += 1) {
    for (let x = 0; x < modules; x += 1) {
      if (inFinder(x, y)) continue;
      const dark = ((x * 17 + y * 31 + x * y * 7) % 13) < 6;
      if (dark) context.fillRect((x + quietZone) * moduleSize, (y + quietZone) * moduleSize, moduleSize, moduleSize);
    }
  }
  const drawFinder = (startX, startY) => {
    context.fillStyle = "#080808";
    context.fillRect((startX + quietZone) * moduleSize, (startY + quietZone) * moduleSize, 7 * moduleSize, 7 * moduleSize);
    context.fillStyle = "#fff";
    context.fillRect((startX + quietZone + 1) * moduleSize, (startY + quietZone + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
    context.fillStyle = "#080808";
    context.fillRect((startX + quietZone + 2) * moduleSize, (startY + quietZone + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };
  drawFinder(0, 0);
  drawFinder(modules - 7, 0);
  drawFinder(0, modules - 7);
}

function openQrPayment(application = null) {
  const selectedDogId = applicationForm.querySelector("[name='applicationDog']:checked")?.value;
  document.querySelector("#qr-event-name").textContent = application?.title || currentApplicationEvent?.title || "Přihláška na výstavu";
  document.querySelector("#qr-amount").textContent = application?.price || money(EventRules.price(currentApplicationEvent, demoOwnerId, registrations));
  document.querySelector("#qr-dog-name").textContent = application ? memberDogs[application.dogId].fullName : selectedDogId ? memberDogs[selectedDogId].fullName : "Přihláška psa";
  drawDemoQrCode();
  openDialog(qrPaymentDialog);
}

function updateApplicationPaymentMethod(openQr = false) {
  const method = applicationForm.querySelector("[name='paymentMethod']:checked")?.value;
  const submit = document.querySelector("#application-submit");
  submit.innerHTML = method === "qr" ? "Odeslat s QR platbou <span>→</span>" : "Odeslat přihlášku <span>→</span>";
  if (openQr && method === "qr") openQrPayment();
}

function openApplication(eventId) {
  const event = events.find((item) => item.id === Number(eventId));
  if (!event || event.status !== "published") return;
  const memberIsActive = memberSessionActive;
  if (!memberIsActive) {
    pendingApplicationEventId = event.id;
    closeDialog(eventDialog);
    window.setTimeout(() => configureAccountDialog("login"), 30);
    showToast("Pro přihlášení psa se nejdříve přihlaste nebo si vytvořte účet.");
    return;
  }
  currentApplicationEvent = event;
  document.querySelector("#application-event-name").textContent = event.title;
  document.querySelector("#summary-event").textContent = event.title;
  document.querySelector("#application-event-place").textContent = `${event.venue}, ${event.city} · ${dateText(event.date)} · ${event.startTime}`;
  applicationForm.reset();
  renderApplicationDogOptions();
  updateApplicationPaymentMethod();
  closeDialog(eventDialog);
  showPortal("member");
  switchMemberPanel("application-new");
  document.querySelector("#application-event-name").focus({ preventScroll: true });
}

function configureAccountDialog(mode) {
  closeDialog(accountDialog);
  navigatePublic(mode === "login" ? "prihlaseni" : "registrace");
}

async function loadBreeds() {
  const fallbackBreeds = [
    { nazev: "Border kolie", skupina_kod: "I", skupina_cislo: 1, skupina_nazev: "plemena ovčácká, pastevecká a honácká" },
    { nazev: "Český teriér", skupina_kod: "III", skupina_cislo: 3, skupina_nazev: "teriéři" },
    { nazev: "Labradorský retrívr", skupina_kod: "VIII", skupina_cislo: 8, skupina_nazev: "slídiči, retrieveři a vodní psi" },
    { nazev: "Německý ovčák", skupina_kod: "I", skupina_cislo: 1, skupina_nazev: "plemena ovčácká, pastevecká a honácká" },
    { nazev: "Zlatý retrívr", skupina_kod: "VIII", skupina_cislo: 8, skupina_nazev: "slídiči, retrieveři a vodní psi" },
  ];
  try {
    let data = window.CMKU_DATA;
    if (!data) {
      const response = await fetch("plemena-cmku.json");
      if (!response.ok) throw new Error("Breed list unavailable");
      data = await response.json();
    }
    breedCatalog = [...data.plemena].sort((a, b) => a.nazev.localeCompare(b.nazev, "cs"));
    breedGroups = [...data.skupiny];
  } catch {
    breedCatalog = fallbackBreeds;
    breedGroups = [...new Map(fallbackBreeds.map((breed) => [breed.skupina_kod, { kod: breed.skupina_kod, cislo: breed.skupina_cislo, nazev: breed.skupina_nazev }])).values()];
  }
  const eventBreedSelect = document.querySelector("#event-breed-select");
  eventBreedSelect.innerHTML = breedCatalog
    .map((breed) => `<option value="${escapeHTML(breed.nazev)}">${escapeHTML(breed.nazev)} · FCI ${escapeHTML(breed.skupina_kod)}</option>`)
    .join("");
  renderEventBreedSelector();
}

function eventClassValues() {
  return [...document.querySelectorAll("[data-event-class]")].map((input) => input.value);
}

function ensureEventBreedClasses(breedName) {
  if (!eventBreedClasses.has(breedName)) {
    eventBreedClasses.set(breedName, new Set(eventClassValues()));
  }
  return eventBreedClasses.get(breedName);
}

function syncEventBreedSelect() {
  const select = document.querySelector("#event-breed-select");
  [...select.options].forEach((option) => {
    option.selected = selectedEventBreeds.has(option.value);
  });
}

function renderEventBreedOptions() {
  const list = document.querySelector("#event-breed-option-list");
  const query = document.querySelector("#event-breed-search").value.trim().toLocaleLowerCase("cs");
  const matchingBreeds = breedCatalog.filter((breed) => breed.nazev.toLocaleLowerCase("cs").includes(query));
  if (!matchingBreeds.length) {
    list.innerHTML = '<p class="event-breed-empty">Žádné plemeno neodpovídá hledání</p>';
    return;
  }
  list.replaceChildren(...matchingBreeds.map((breed) => {
    const button = document.createElement("button");
    const selected = selectedEventBreeds.has(breed.nazev);
    button.type = "button";
    button.className = selected ? "selected" : "";
    button.dataset.eventBreedOption = breed.nazev;
    button.setAttribute("aria-pressed", String(selected));
    button.setAttribute("aria-label", `${selected ? "Přidáno" : "Přidat plemeno"} ${breed.nazev}`);
    button.innerHTML = `<span>${escapeHTML(breed.nazev)}</span><small>FCI ${escapeHTML(breed.skupina_kod)}</small><i>${selected ? "Přidáno" : "+ Přidat"}</i>`;
    return button;
  }));
}

function renderSelectedEventBreeds() {
  const container = document.querySelector("#event-selected-breeds");
  const count = document.querySelector("#event-selected-breed-count");
  count.textContent = `${selectedEventBreeds.size} vybraných plemen`;
  if (!selectedEventBreeds.size) {
    container.innerHTML = "<p>Zatím není vybrané žádné plemeno</p>";
    return;
  }
  container.replaceChildren(...[...selectedEventBreeds].map((breedName) => {
    const row = document.createElement("div");
    const classes = ensureEventBreedClasses(breedName);
    row.className = `event-selected-breed${activeEventBreed === breedName ? " active" : ""}`;
    const edit = document.createElement("button");
    edit.type = "button";
    edit.dataset.eventBreedEdit = breedName;
    edit.innerHTML = `<span>${escapeHTML(breedName)}</span><small>${classes.size === eventClassValues().length ? "Všechny třídy" : `${classes.size} tříd`}</small>`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.eventBreedRemove = breedName;
    remove.setAttribute("aria-label", `Odebrat plemeno ${breedName}`);
    remove.textContent = "×";
    row.append(edit, remove);
    return row;
  }));
}

function renderEventBreedClassEditor() {
  const editor = document.querySelector("#event-breed-class-editor");
  const title = document.querySelector("#event-breed-class-title");
  editor.disabled = !activeEventBreed;
  title.textContent = activeEventBreed || "Nejprve vyberte plemeno";
  const selectedClasses = activeEventBreed ? ensureEventBreedClasses(activeEventBreed) : new Set();
  editor.querySelectorAll("[data-event-class]").forEach((input) => {
    input.checked = selectedClasses.has(input.value);
  });
}

function renderEventBreedSelector() {
  syncEventBreedSelect();
  renderEventBreedOptions();
  renderSelectedEventBreeds();
  renderEventBreedClassEditor();
}

function addEventBreed(breedName) {
  if (!breedCatalog.some(breed => breed.nazev === breedName)) return;
  if (!selectedEventBreeds.has(breedName)) selectedEventBreeds.add(breedName);
  ensureEventBreedClasses(breedName);
  activeEventBreed = breedName;
  renderEventBreedSelector();
}

function removeEventBreed(breedName) {
  selectedEventBreeds.delete(breedName);
  eventBreedClasses.delete(breedName);
  if (activeEventBreed === breedName) activeEventBreed = [...selectedEventBreeds][0] || null;
  renderEventBreedSelector();
}

function groupLabel(group) {
  return `${group.cislo || group.kod} — ${group.nazev}`;
}

function openBreedPicker(mode) {
  breedPickerMode = mode;
  breedPickerIgnoreGroup = false;
  const search = document.querySelector("#breed-picker-search");
  search.value = "";
  document.querySelector("#breed-picker-title").textContent = mode === "group" ? "Vybrat skupinu plemen" : "Vybrat plemeno";
  document.querySelector("#breed-picker-copy").textContent = mode === "group" ? "Skupiny odpovídají katalogu ČMKU a členění FCI" : "Plemena jsou seřazená abecedně podle katalogu ČMKU";
  search.placeholder = mode === "group" ? "Hledat skupinu…" : "Hledat podle názvu plemene…";
  renderBreedPicker();
  openDialog(breedPickerDialog);
  window.setTimeout(() => search.focus(), 30);
}

function renderBreedPicker() {
  const list = document.querySelector("#breed-picker-list");
  const query = document.querySelector("#breed-picker-search").value.trim().toLocaleLowerCase("cs");
  const showAll = document.querySelector("#breed-picker-show-all");
  if (breedPickerMode === "group") {
    const groups = breedGroups.filter((group) => groupLabel(group).toLocaleLowerCase("cs").includes(query));
    document.querySelector("#breed-picker-count").textContent = `${groups.length} skupin`;
    showAll.hidden = true;
    list.replaceChildren(...groups.map((group) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.groupChoice = group.cislo ?? group.kod;
      button.dataset.groupLabel = groupLabel(group);
      button.innerHTML = `<span>${escapeHTML(group.kod)}</span><div><b>${escapeHTML(group.nazev)}</b><small>${group.pocet_plemen ? `${group.pocet_plemen} plemen` : "Skupina FCI"}</small></div><i>→</i>`;
      return button;
    }));
    return;
  }
  const breeds = breedCatalog.filter((breed) => {
    const matchesGroup = breedPickerIgnoreGroup || selectedBreedGroupNumber == null || String(breed.skupina_cislo ?? breed.skupina_kod) === String(selectedBreedGroupNumber);
    const matchesQuery = `${breed.nazev} ${breed.originalni_nazev || ""}`.toLocaleLowerCase("cs").includes(query);
    return matchesGroup && matchesQuery;
  });
  document.querySelector("#breed-picker-count").textContent = `${breeds.length} ${breeds.length === 1 ? "plemeno" : "plemen"}${selectedBreedGroupNumber != null && !breedPickerIgnoreGroup ? " ve vybrané skupině" : ""}`;
  showAll.hidden = selectedBreedGroupNumber == null || breedPickerIgnoreGroup;
  list.replaceChildren(...breeds.map((breed) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.breedChoice = breed.nazev;
    button.dataset.breedGroup = breed.skupina_cislo ?? breed.skupina_kod;
    button.dataset.breedGroupLabel = `${breed.skupina_cislo || breed.skupina_kod} — ${breed.skupina_nazev}`;
    button.innerHTML = `<span>${escapeHTML(breed.nazev.charAt(0).toLocaleUpperCase("cs"))}</span><div><b>${escapeHTML(breed.nazev)}</b><small>${breed.originalni_nazev ? `${escapeHTML(breed.originalni_nazev)} · ` : ""}FCI ${escapeHTML(breed.skupina_kod)}</small></div><i>→</i>`;
    return button;
  }));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function dogInitials(name) {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toLocaleUpperCase("cs");
}

function updateDogRosterSummary() {
  const count = Object.keys(memberDogs).length;
  const sidebarCount = document.querySelector("#member-dog-count");
  const rosterSummary = document.querySelector("#dog-roster-summary");
  if (sidebarCount) sidebarCount.textContent = count;
  if (rosterSummary) rosterSummary.textContent = `${count} ${count === 1 ? "profil" : count < 5 ? "profily" : "profilů"}`;
}

function createDogRosterButton(id, dog) {
  const button = document.createElement("button");
  button.className = "dog-roster-item";
  button.type = "button";
  button.dataset.dogSelect = id;
  const avatar = document.createElement("span");
  avatar.textContent = dog.photo ? "" : dogInitials(dog.fullName);
  if (dog.photo) {
    avatar.style.backgroundImage = `url("${dog.photo}")`;
    avatar.classList.add("has-photo");
  }
  const copy = document.createElement("div");
  const name = document.createElement("b");
  const meta = document.createElement("small");
  name.textContent = dog.fullName;
  meta.textContent = `${dog.breed} · ${dog.sex.toLocaleLowerCase("cs")}`;
  copy.append(name, meta);
  const arrow = document.createElement("i");
  arrow.textContent = "→";
  button.append(avatar, copy, arrow);
  return button;
}

function selectMemberDog(id) {
  const dog = memberDogs[id];
  if (!dog) return;
  currentMemberDogId = id;
  document.querySelector("#member-panel-title").textContent = "Moji psi";
  document.querySelector("#dog-create-view").hidden = true;
  document.querySelector("#dog-profile-view").hidden = false;
  document.querySelectorAll("[data-dog-select]").forEach((button) => button.classList.toggle("active", button.dataset.dogSelect === id));
  const avatar = document.querySelector("#dog-detail-avatar");
  avatar.textContent = dog.photo ? "" : dogInitials(dog.fullName);
  avatar.style.backgroundImage = dog.photo ? `url("${dog.photo}")` : "";
  avatar.classList.toggle("has-photo", Boolean(dog.photo));
  document.querySelector("#dog-detail-name").textContent = dog.fullName;
  document.querySelector("#dog-detail-meta").textContent = `${dog.breed} · ${dog.sex.toLocaleLowerCase("cs")}`;
  document.querySelectorAll("[data-dog-display]").forEach((field) => {
    const key = field.dataset.dogDisplay;
    let value = dog[key] || "Neuvedeno";
    if (key === "birth" && dog.birth) value = new Date(`${dog.birth}T12:00:00`).toLocaleDateString("cs-CZ");
    field.textContent = value;
  });
  renderMemberDogAssets(dog);
}

function openDogCreator() {
  dogFormMode = "create";
  switchMemberPanel("dogs");
  document.querySelector("#dog-profile-view").hidden = true;
  document.querySelector("#dog-create-view").hidden = false;
  document.querySelectorAll("[data-dog-select]").forEach((button) => button.classList.remove("active"));
  const form = document.querySelector("#dog-create-form");
  form.reset();
  selectedBreedGroupNumber = null;
  dogCreatePhotoUrl = "";
  document.querySelector("#new-dog-group-label").textContent = "Vybrat skupinu";
  document.querySelector("#new-dog-breed-label").textContent = "Vybrat plemeno";
  document.querySelector("#dog-photo-preview").innerHTML = "<b>+</b><small>Fotografie psa</small>";
  document.querySelector("#dog-form-eyebrow").textContent = "Nový profil psa";
  document.querySelector("#dog-form-title").textContent = "Přidat psa";
  document.querySelector("#dog-form-copy").textContent = "Údaje vyplňte podle průkazu původu.";
  document.querySelector("#dog-form-submit").textContent = "Vytvořit profil psa →";
  document.querySelector("#member-panel-title").textContent = "Přidat psa";
  memberPortal.querySelector(".portal-main").scrollTo({ top: 0, behavior: "instant" });
}

function openDogEditor() {
  const dog = memberDogs[currentMemberDogId];
  if (!dog) return;
  dogFormMode = "edit";
  switchMemberPanel("dogs");
  document.querySelector("#dog-profile-view").hidden = true;
  document.querySelector("#dog-create-view").hidden = false;
  const form = document.querySelector("#dog-create-form");
  form.reset();
  const values = {
    newDogCallName: dog.callName,
    newDogName: dog.fullName,
    newDogRegistration: dog.registration,
    newDogChip: dog.chip,
    newDogTattoo: dog.tattoo,
    newDogBirth: dog.birth,
    newDogSex: dog.sex,
    newDogVariety: dog.variety,
    newDogKennel: dog.kennel,
    newDogBreeder: dog.breeder,
    newDogBreedGroup: dog.breedGroup,
    newDogBreed: dog.breed,
    newDogFatherRegistration: dog.fatherRegistration,
    newDogFatherName: dog.fatherName,
    newDogMotherRegistration: dog.motherRegistration,
    newDogMotherName: dog.motherName,
  };
  Object.entries(values).forEach(([name, value]) => {
    if (form.elements[name]) form.elements[name].value = value || "";
  });
  selectedBreedGroupNumber = dog.breedGroup?.match(/^\d+/)?.[0] || null;
  dogCreatePhotoUrl = dog.photo || "";
  document.querySelector("#new-dog-group-label").textContent = dog.breedGroup || "Vybrat skupinu";
  document.querySelector("#new-dog-breed-label").textContent = dog.breed || "Vybrat plemeno";
  document.querySelector("#dog-photo-preview").innerHTML = dog.photo
    ? `<img src="${dog.photo}" alt="Fotografie psa ${escapeHTML(dog.fullName)}" /><small>Změnit fotografii</small>`
    : "<b>+</b><small>Fotografie psa</small>";
  document.querySelector("#dog-form-eyebrow").textContent = "Úprava profilu";
  document.querySelector("#dog-form-title").textContent = dog.fullName;
  document.querySelector("#dog-form-copy").textContent = "Upravte uložené údaje. Změny se použijí u dalších přihlášek";
  document.querySelector("#dog-form-submit").textContent = "Uložit změny →";
  document.querySelector("#member-panel-title").textContent = "Upravit psa";
  memberPortal.querySelector(".portal-main").scrollTo({ top: 0, behavior: "instant" });
}

function switchDogTab(tab) {
  document.querySelectorAll("[data-dog-tab]").forEach((button) => button.classList.toggle("active", button.dataset.dogTab === tab));
  document.querySelectorAll("[data-dog-tab-content]").forEach((section) => section.classList.toggle("active", section.dataset.dogTabContent === tab));
}

function renderMemberDogAssets(dog) {
  const documentList = document.querySelector("#dog-document-list");
  const awardList = document.querySelector("#dog-award-list");
  const documents = dog.documents || [];
  const awards = dog.awards || [];
  document.querySelector('[data-dog-tab="documents"] b').textContent = documents.length;
  document.querySelector('[data-dog-tab="awards"] b').textContent = awards.length;
  documentList.innerHTML = documents.length
    ? documents.map((document) => `<article><span class="file-type${document.type === "PDF" ? "" : " image"}">${escapeHTML(document.type)}</span><div><b>${escapeHTML(document.title)}</b><small>${escapeHTML(document.file)}</small></div><i class="status-badge ${document.status === "Ověřeno" ? "paid" : "review"}">${escapeHTML(document.status)}</i><button type="button" data-toast="Náhled dokumentu je připravený.">Zobrazit</button></article>`).join("")
    : '<div class="member-empty-assets"><b>Zatím žádné dokumenty</b><span>Nahrajte průkaz původu nebo další doklad</span></div>';
  awardList.innerHTML = awards.length
    ? awards.map((award) => `<article><time><b>${escapeHTML(award.day)}</b><span>${escapeHTML(award.month)} 2026</span></time><div><h4>${escapeHTML(award.title)}</h4><p>${escapeHTML(award.detail)}</p><small>${escapeHTML(award.file)}</small></div><span class="status-badge paid">${escapeHTML(award.result)}</span><button type="button" data-toast="Náhled ocenění je připravený.">Dokument <span aria-hidden="true">↗</span></button></article>`).join("")
    : '<div class="member-empty-assets"><b>Zatím žádná ocenění</b><span>Výsledky a související doklady sem doplní administrátor.</span></div>';
}

function appendUploadedFiles(input, kind) {
  const dog = memberDogs[currentMemberDogId];
  if (!dog || !input.files?.length || !["pedigree", "document"].includes(kind)) return;
  dog.documents ||= [];
  [...input.files].forEach((file) => {
    const extension = (file.name.split(".").pop() || "soubor").toLocaleUpperCase("cs");
    dog.documents.unshift({ type: extension, title: kind === "pedigree" ? "Průkaz původu" : "Nový dokument", file: `${file.name} · ${(file.size / 1024 / 1024).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} MB`, status: "Čeká na kontrolu" });
  });
  input.value = "";
  renderMemberDogAssets(dog);
  showToast("Dokument byl nahrán a čeká na kontrolu.");
}

function renderMemberEvents() {
  const container = document.querySelector("#member-event-grid");
  const query = document.querySelector("#member-event-search").value.trim().toLocaleLowerCase("cs");
  const type = document.querySelector("#member-event-type").value;
  const filtered = events.filter(event => event.status === "published" && (type === "all" || event.type === type) && `${event.title} ${event.city} ${event.venue}`.toLocaleLowerCase("cs").includes(query));
  document.querySelector("#member-event-count").textContent = `Počet výstav: ${filtered.length}`;
  document.querySelector("#member-events-empty").hidden = filtered.length > 0;
  container.innerHTML = filtered.map(event => `
    <article class="member-event-card">
      <div class="member-event-date"><b>${event.day}</b><span>${event.month}</span></div>
      <div class="member-event-description"><span>${escapeHTML(event.type)}</span><h2>${escapeHTML(event.title)}</h2><p>${escapeHTML(event.venue)}, ${escapeHTML(event.city)}</p></div>
      <div class="member-event-deadline"><span>Uzávěrka přihlášek</span><b>${escapeHTML(event.deadline)}</b><small>${money(event.price)} / pes · ${Math.max(0, event.capacity - event.dogs)} volných míst</small></div>
      <div class="member-event-actions"><button class="gold-button" type="button" data-member-apply="${event.id}"><span>Přihlásit psa</span><span aria-hidden="true">→</span></button><button class="member-event-detail" type="button" data-member-event-detail="${event.id}">Detail výstavy <span aria-hidden="true">↗</span></button></div>
    </article>`).join("");
}

const memberEventFilters = document.querySelector("#member-event-filters");
memberEventFilters.addEventListener("input", renderMemberEvents);
memberEventFilters.addEventListener("submit", event => event.preventDefault());
memberEventFilters.addEventListener("reset", () => window.setTimeout(renderMemberEvents, 0));
document.querySelector("#member-events-reset").addEventListener("click", () => memberEventFilters.reset());

function openMemberApplicationDetail(key) {
  const application = memberApplications[key];
  const dog = memberDogs[application?.dogId];
  if (!application || !dog) return;
  document.querySelector("#member-application-detail-title").textContent = application.title;
  document.querySelector("#member-application-detail-place").textContent = application.place;
  const status = document.querySelector("#member-application-detail-status");
  status.textContent = application.status;
  status.className = `status-badge ${application.statusClass}`;
  document.querySelector("#member-detail-dog").textContent = dog.fullName;
  document.querySelector("#member-detail-breed").textContent = dog.breed;
  document.querySelector("#member-detail-class").textContent = application.showClass;
  document.querySelector("#member-detail-registration").textContent = dog.registration;
  const paymentStep = document.querySelector("#member-detail-payment-step");
  const paid = application.statusClass === "paid";
  paymentStep.classList.toggle("done", paid);
  paymentStep.querySelector(":scope > span").textContent = paid ? "✓" : "3";
  paymentStep.querySelector("b").textContent = paid ? "Platba spárována" : application.status;
  document.querySelector("#member-detail-payment-date").textContent = application.paymentDate;
  document.querySelector("#member-detail-price").textContent = application.price;
  document.querySelector("#member-detail-payment-note").textContent = application.paymentNote;
  const action = document.querySelector("#member-detail-primary-action");
  action.textContent = application.action;
  delete action.dataset.toast;
  action.dataset.applicationPayment = key;
  action.hidden = application.statusClass === "paid";
  action.textContent = "Zobrazit demo platební údaje →";
  document.querySelector("#member-detail-submitted").textContent = new Date(application.submittedAt).toLocaleDateString('cs-CZ');
  document.querySelector("#member-detail-documents").textContent = application.docs || 'Čeká na kontrolu';
  const documents = document.querySelector("#member-detail-documents-step");
  documents.classList.toggle('done', application.docs === 'Ověřeno');
  documents.querySelector(':scope > span').textContent = application.docs === 'Ověřeno' ? '✓' : '2';
  switchMemberPanel("application-detail");
}

function registrationRowMarkup(registration) {
  return `
    <tr>
      <td data-label="Přihlášen">${escapeHTML(registration.date)}</td>
      <td data-label="Vystavovatel"><b>${escapeHTML(registration.name)}</b><span>${escapeHTML(registration.email)}</span></td>
      <td data-label="Pes / třída"><b>${escapeHTML(registration.dog)}</b><span>${escapeHTML(registration.showClass)}</span></td>
      <td data-label="Doklady"><span class="status-badge ${registration.docs === "Ověřeno" ? "paid" : "review"}">${escapeHTML(registration.docs)}</span></td>
      <td data-label="Částka">${registration.amount.toLocaleString("cs-CZ")} Kč</td>
      <td data-label="Platba"><button class="status-badge ${registration.payment === "paid" ? "paid" : "pending"}" type="button" data-toggle-payment="${registrations.indexOf(registration)}">${registration.payment === "paid" ? "Zaplaceno" : "Nezaplaceno"}</button></td>
      <td data-label="Detail"><button type="button" data-toast="Detail přihlášky je připravený." aria-label="Otevřít detail přihlášky ${escapeHTML(registration.dog)}">→</button></td>
    </tr>
  `;
}

function renderRegistrationRows() {
  const query = document.querySelector("#registration-search")?.value.trim().toLocaleLowerCase("cs") || "";
  const payment = document.querySelector("#payment-filter")?.value || "all";
  const rows = eventRecords(currentAdminEventId).filter((registration) => {
    const haystack = `${registration.name} ${registration.email} ${registration.dog}`.toLocaleLowerCase("cs");
    return haystack.includes(query) && (payment === "all" || registration.payment === payment);
  });
  document.querySelector("#registration-rows").innerHTML = rows.map(registrationRowMarkup).join("") || '<tr><td colspan="7">Zatím žádné odpovídající přihlášky.</td></tr>';
}

function renderAdminDetailRegistrationRows() {
  const records = eventRecords(currentAdminEventId);
  document.querySelector("#admin-detail-registration-rows").innerHTML = records.slice(-6).reverse().map(registrationRowMarkup).join("") || '<tr><td colspan="7">Na tuto výstavu zatím nepřišla žádná přihláška.</td></tr>';
  document.querySelector("#admin-recent-count").textContent = `Zobrazeno ${Math.min(records.length, 6)} z ${records.length} přihlášek`;
}

function openAdminAccess() {
  const form = document.querySelector("#admin-access-form");
  const error = document.querySelector("#admin-access-error");
  form.reset();
  form.elements.adminPassword.classList.remove("invalid");
  error.hidden = true;
  openDialog(adminAccessDialog);
  window.setTimeout(() => {
    const password = form.elements.adminPassword;
    password.focus();
    password.select();
  }, 30);
}

function updateMemberSessionUI() {
  const headerAccess = document.querySelector("#header-member-access");
  const headerLabel = document.querySelector("#header-member-label");
  const headerAvatar = document.querySelector("#header-member-avatar");
  const headerKicker = document.querySelector("#header-member-kicker");
  const headerArrow = document.querySelector("#header-member-arrow");
  const registerButton = document.querySelector("#header-register-button");
  const mobileAccess = document.querySelector("#mobile-member-access");
  const desktopProfileLink = document.querySelector("#desktop-profile-link");
  const mobileProfileLink = document.querySelector("#mobile-profile-link");
  document.body.classList.toggle("member-session-active", memberSessionActive);
  headerAccess.classList.toggle("active", memberSessionActive);
  headerAccess.setAttribute("aria-label", memberSessionActive ? `Otevřít nabídku účtu ${demoMemberName}` : "Přihlásit se");
  headerLabel.textContent = memberSessionActive ? demoMemberName : "Přihlásit se";
  headerAvatar.hidden = !memberSessionActive;
  headerKicker.hidden = false;
  headerKicker.textContent = memberSessionActive ? "Přihlášený profil" : "Členská zóna";
  headerArrow.hidden = !memberSessionActive;
  registerButton.hidden = memberSessionActive;
  const mobileAccessLabel = mobileAccess.querySelector("b");
  if (mobileAccessLabel) mobileAccessLabel.textContent = memberSessionActive ? demoMemberName : "Přihlásit se";
  else mobileAccess.textContent = memberSessionActive ? demoMemberName : "Přihlásit se";
  desktopProfileLink.hidden = !memberSessionActive;
  mobileProfileLink.hidden = !memberSessionActive;
  document.querySelector("#hero-login-content").hidden = memberSessionActive;
  document.querySelector("#hero-member-session").hidden = !memberSessionActive;
  if (!memberSessionActive) closeMemberAccountMenu();
  document.querySelector("#exhibition-access-note").hidden = memberSessionActive;

}

const memberAccountMenu = document.querySelector("#member-account-menu");

function closeMemberAccountMenu() {
  if (!memberAccountMenu) return;
  memberAccountMenu.hidden = true;
  document.querySelector("#header-member-access")?.setAttribute("aria-expanded", "false");
}

function toggleMemberAccountMenu() {
  if (!memberAccountMenu || !memberSessionActive) return;
  const open = memberAccountMenu.hidden;
  memberAccountMenu.hidden = !open;
  document.querySelector("#header-member-access")?.setAttribute("aria-expanded", String(open));
  if (open) memberAccountMenu.querySelector("button")?.focus();
}

function setMemberSession(active) {
  memberSessionActive = active;
  if (active) setHeroRegistration(false, false);
  updateMemberSessionUI();
  renderEvents();
}

function showPortal(role) {
  if (role !== "admin" && !memberSessionActive) {
    navigatePublic("prihlaseni");
    return false;
  }
  if (role === "admin" && !adminSessionActive) {
    openAdminAccess();
    return false;
  }
  closeMobileNavigation();
  closeMemberAccountMenu();
  const hash = role === "admin" ? "#poradatel" : "#vystavy";
  if (location.hash !== hash) history.pushState(null, "", hash);
  document.title = role === "admin" ? "Pořadatelská administrace | Česká kynologická" : "Výstavy a členská zóna | Česká kynologická";
  allDialogs.forEach(closeDialog);
  const isAdmin = role === "admin";
  memberPortal.hidden = isAdmin;
  adminPortal.hidden = !isAdmin;
  document.body.classList.add("portal-active");
  document.body.classList.remove("modal-open");
  window.scrollTo({ top: 0 });
  if (isAdmin) {
    switchAdminPanel("admin-overview");
  } else {
    switchMemberPanel("member-events");
  }
}

function enterMemberAndContinue() {
  setMemberSession(true);
  showPortal("member");
  if (pendingMemberPanel) {
    switchMemberPanel(pendingMemberPanel);
    pendingMemberPanel = null;
  }
  const eventId = pendingApplicationEventId;
  const detailId = pendingDetailEventId;
  pendingApplicationEventId = null;
  pendingDetailEventId = null;
  if (eventId) window.setTimeout(() => openApplication(eventId), 50);
  else if (detailId) window.setTimeout(() => openEventDetail(detailId), 50);
}

function hidePortals() {
  memberPortal.hidden = true;
  adminPortal.hidden = true;
  memberPortal.classList.remove("sidebar-open");
  if (adminSidebarMedia.matches) setAdminSidebar(false);
  document.body.classList.remove("portal-active");
}

function exitPortal() {
  navigatePublic("uvod");
}

function switchMemberPanel(panel) {
  const titleMap = { dogs: "Moji psi", applications: "Přihlášky", "application-detail": "Detail přihlášky", "application-new": "Přihlášení psa", "member-events": "Výstavy", profile: "Můj profil" };
  const navigationPanel = panel === "application-detail" ? "applications" : panel === "application-new" ? "member-events" : panel;
  document.querySelectorAll("[data-member-content]").forEach((section) => section.classList.toggle("active", section.dataset.memberContent === panel));
  document.querySelectorAll("[data-member-panel]").forEach((button) => button.classList.toggle("active", button.dataset.memberPanel === navigationPanel));
  document.querySelector("#member-panel-title").textContent = titleMap[panel] || "Členská zóna";
  memberPortal.classList.remove("sidebar-open");
  memberPortal.querySelector(".portal-main").scrollTo({ top: 0, behavior: "instant" });
  if (panel === "dogs") selectMemberDog(currentMemberDogId);
}

function switchAdminPanel(panel) {
  if (!adminSessionActive) return;
  if (panel === "admin-overview") panel = "admin-events";
  const titleMap = { "admin-overview": "Přehled výstav", "admin-event-detail": "Detail výstavy", "admin-events": "Výstavy a přihlášky", "admin-create-event": "Vytvořit výstavu" };
  if (!Object.hasOwn(titleMap, panel)) panel = "admin-events";
  const navigationPanel = panel === "admin-event-detail" ? "admin-events" : panel === "admin-create-event" ? "admin-events" : panel;
  document.querySelectorAll("[data-admin-content]").forEach((section) => section.classList.toggle("active", section.dataset.adminContent === panel));
  document.querySelectorAll("[data-admin-panel]").forEach((button) => button.classList.toggle("active", button.dataset.adminPanel === navigationPanel));
  document.querySelector("#admin-panel-title").textContent = titleMap[panel] || "Administrace";
  if (adminSidebarMedia.matches) setAdminSidebar(false);
  adminPortal.querySelector(".portal-main").scrollTo({ top: 0, behavior: "instant" });
  if (panel === "admin-events") {
    renderAdminEvents();
    document.querySelector("#admin-show-registrations").hidden = true;
    document.querySelectorAll("[data-admin-show-registrations]").forEach((eventRow) => eventRow.classList.remove("expanded"));
  }
}

function openAdminShowRegistrations(trigger) {
  const id = Number(typeof trigger === 'object' ? trigger.dataset.adminShowRegistrations : trigger);
  const event = events.find(item => item.id === id);
  if (!event || !adminSessionActive) return;
  switchAdminPanel("admin-events");
  currentAdminEventId = id;
  let row = document.querySelector(`[data-admin-event-row="${id}"]`);
  if (!row) {
    document.querySelector('#admin-event-filters').reset(); renderAdminEvents();
    row = document.querySelector(`[data-admin-event-row="${id}"]`);
  }
  const section = document.querySelector("#admin-show-registrations");
  row.after(section); row.classList.add("expanded");
  row.querySelector('[data-admin-show-registrations]').setAttribute('aria-expanded', 'true');
  document.querySelector("#admin-registration-show-title").textContent = event.title;
  section.hidden = false;
  renderRegistrationRows();
  section.scrollIntoView({ block: "nearest" });
}

function openAdminEventDetail(trigger) {
  if (!adminSessionActive) return;
  showAdminEventDetail(typeof trigger === 'object' ? trigger.dataset.adminEventDetail : trigger);
}

function openLegalDocument(type) {
  const content = legalDocuments[type];
  if (!content) return;
  document.querySelector("#legal-content").innerHTML = content;
  openDialog(legalDialog);
}

function exportRegistrationsCSV() {
  const header = ["Přihlášen", "Vystavovatel", "E-mail", "Pes", "Třída", "Doklady", "Částka", "Platba"];
  const csv = [header, ...eventRecords(currentAdminEventId).map((item) => [item.date, item.name, item.email, item.dog, item.showClass, item.docs, item.amount, item.payment === "paid" ? "Zaplaceno" : "Nezaplaceno"])]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `prihlasky-vystava-${currentAdminEventId}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("CSV se seznamem přihlášených bylo vytvořeno.");
}

[searchInput, typeFilter, dateFilter].forEach((control) => control.addEventListener("input", renderEvents));
filterForm.addEventListener("submit", (event) => event.preventDefault());
filterForm.addEventListener("reset", () => {
  window.setTimeout(() => {
    renderEvents();
  }, 0);
});
document.querySelector("#empty-reset").addEventListener("click", () => filterForm.reset());

eventList.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-event-detail]");
  const registerButton = event.target.closest("[data-event-register]");
  if (detailButton) openEventDetail(detailButton.dataset.eventDetail);
  if (registerButton) openApplication(registerButton.dataset.eventRegister);
});

eventModalContent.addEventListener("click", (event) => {
  const registerButton = event.target.closest("[data-modal-register]");
  if (registerButton) openApplication(registerButton.dataset.modalRegister);
});

document.addEventListener("click", (event) => {
  const closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) closeDialog(closeButton.closest("dialog"));

  const heroRegisterButton = event.target.closest("[data-hero-register]");
  if (heroRegisterButton) setHeroRegistration(true);

  const heroLoginButton = event.target.closest("[data-hero-login]");
  if (heroLoginButton) navigatePublic("prihlaseni");

  const accountButton = event.target.closest("[data-open-account]");
  if (accountButton) {
    if (accountButton.matches("#header-member-access") && memberSessionActive) {
      toggleMemberAccountMenu();
    } else if (accountButton.dataset.openAccount === "login" && memberSessionActive) {
      showPortal("member");
      if (accountButton.matches("#mobile-member-access")) switchMemberPanel("member-events");
    } else if (accountButton.dataset.openAccount === "register" && !document.body.classList.contains("portal-active")) {
      setHeroRegistration(true);
    } else {
      configureAccountDialog(accountButton.dataset.openAccount);
    }
  }

  const memberProfileButton = event.target.closest("[data-open-member-profile]");
  if (memberProfileButton) {
    closeMemberAccountMenu();
    if (memberSessionActive) {
      showPortal("member");
      switchMemberPanel("profile");
    } else {
      pendingMemberPanel = "profile";
      navigatePublic("prihlaseni");
    }
  }

  if (event.target.closest("[data-open-member-zone]")) {
    closeMemberAccountMenu();
    showPortal("member");
    switchMemberPanel("member-events");
  }

  const accountModeToggle = event.target.closest("#account-mode-toggle");
  if (accountModeToggle) {
    if (accountModeToggle.dataset.nextMode === "register") {
      closeDialog(accountDialog);
      setHeroRegistration(true);
    } else {
      configureAccountDialog(accountModeToggle.dataset.nextMode);
    }
  }

  const toastButton = event.target.closest("[data-toast]");
  if (toastButton) showToast(toastButton.dataset.toast);

  const legalButton = event.target.closest("[data-legal]");
  if (legalButton) {
    event.preventDefault();
    openLegalDocument(legalButton.dataset.legal);
  }

  const memberPanelButton = event.target.closest("[data-member-panel]");
  if (memberPanelButton) {
    closeDialog(memberPanelButton.closest("dialog"));
    switchMemberPanel(memberPanelButton.dataset.memberPanel);
  }

  const memberApplicationDetailButton = event.target.closest("[data-member-application-detail]");
  if (memberApplicationDetailButton) openMemberApplicationDetail(memberApplicationDetailButton.dataset.memberApplicationDetail);

  const dogSelectButton = event.target.closest("[data-dog-select]");
  if (dogSelectButton) {
    selectMemberDog(dogSelectButton.dataset.dogSelect);
    switchDogTab("basic");
  }

  const dogTabButton = event.target.closest("[data-dog-tab]");
  if (dogTabButton) switchDogTab(dogTabButton.dataset.dogTab);

  const breedPickerButton = event.target.closest("[data-open-breed-picker]");
  if (breedPickerButton) openBreedPicker(breedPickerButton.dataset.openBreedPicker);

  const groupChoice = event.target.closest("[data-group-choice]");
  if (groupChoice) {
    selectedBreedGroupNumber = groupChoice.dataset.groupChoice;
    document.querySelector("#new-dog-group").value = groupChoice.dataset.groupLabel;
    document.querySelector("#new-dog-group-label").textContent = groupChoice.dataset.groupLabel;
    document.querySelector("#new-dog-breed").value = "";
    document.querySelector("#new-dog-breed-label").textContent = "Vybrat plemeno";
    closeDialog(breedPickerDialog);
  }

  const breedChoice = event.target.closest("[data-breed-choice]");
  if (breedChoice) {
    selectedBreedGroupNumber = breedChoice.dataset.breedGroup;
    document.querySelector("#new-dog-breed").value = breedChoice.dataset.breedChoice;
    document.querySelector("#new-dog-breed-label").textContent = breedChoice.dataset.breedChoice;
    document.querySelector("#new-dog-group").value = breedChoice.dataset.breedGroupLabel;
    document.querySelector("#new-dog-group-label").textContent = breedChoice.dataset.breedGroupLabel;
    closeDialog(breedPickerDialog);
  }

  const eventBreedRemove = event.target.closest("[data-event-breed-remove]");
  if (eventBreedRemove) {
    removeEventBreed(eventBreedRemove.dataset.eventBreedRemove);
  } else {
    const eventBreedEdit = event.target.closest("[data-event-breed-edit]");
    if (eventBreedEdit) {
      activeEventBreed = eventBreedEdit.dataset.eventBreedEdit;
      renderEventBreedSelector();
    }
    const eventBreedOption = event.target.closest("[data-event-breed-option]");
    if (eventBreedOption) addEventBreed(eventBreedOption.dataset.eventBreedOption);
  }

  const adminPanelButton = event.target.closest("[data-admin-panel]");
  if (adminPanelButton) switchAdminPanel(adminPanelButton.dataset.adminPanel);

  const adminShowRegistrations = event.target.closest("[data-admin-show-registrations]");
  if (adminShowRegistrations) openAdminShowRegistrations(adminShowRegistrations);

  const adminEventDetailButton = event.target.closest("[data-admin-event-detail]");
  if (adminEventDetailButton) openAdminEventDetail(adminEventDetailButton);

  if (event.target.closest("[data-open-full-registration-list]")) openAdminShowRegistrations(currentAdminEventId);
  const editEvent = event.target.closest('[data-edit-event]');
  if (editEvent) openEventEditor(editEvent.dataset.editEvent);
  const paymentDetail = event.target.closest('[data-application-payment]');
  if (paymentDetail) openQrPayment(memberApplications[paymentDetail.dataset.applicationPayment]);
  if (event.target.closest('[data-admin-sign-out]')) { adminSessionActive = false; exitPortal(); }

  if (event.target.closest("[data-enter-admin]")) openAdminAccess();
  if (event.target.closest("[data-switch-member]")) showPortal("member");
  if (event.target.closest("[data-sign-out]")) {
    event.preventDefault();
    allDialogs.forEach(closeDialog);
    setMemberSession(false);
    adminSessionActive = false;
    pendingApplicationEventId = null;
    pendingDetailEventId = null;
    pendingMemberPanel = null;
    document.querySelector("#hero-login-form").reset();
    exitPortal();
  } else if (event.target.closest("[data-exit-portal]")) {
    event.preventDefault();
    exitPortal();
  }

  if (event.target.closest("[data-open-dog]")) openDogCreator();
  if (event.target.closest("[data-edit-dog]")) openDogEditor();
  if (event.target.closest("[data-cancel-dog-create]")) selectMemberDog(currentMemberDogId);
  if (event.target.closest("[data-create-event]")) openEventEditor();
  if (event.target.closest("[data-export-csv]")) exportRegistrationsCSV();

  const memberDetail = event.target.closest("[data-member-event-detail]");
  if (memberDetail) openEventDetail(memberDetail.dataset.memberEventDetail);

  const memberApply = event.target.closest("[data-member-apply]");
  if (memberApply) openApplication(memberApply.dataset.memberApply);

  const publicEvent = event.target.closest("[data-public-event]");
  if (publicEvent) {
    exitPortal();
    window.setTimeout(() => openEventDetail(publicEvent.dataset.publicEvent), 40);
  }

  const paymentButton = event.target.closest("[data-toggle-payment]");
  if (paymentButton && adminSessionActive) {
    const registration = registrations[Number(paymentButton.dataset.togglePayment)];
    if (registration) {
      registration.payment = registration.payment === "paid" ? "pending" : "paid";
      const application = memberApplications[registration.id];
      if (application) {
        application.status = registration.payment === 'paid' ? 'Zaplaceno' : 'Čeká na platbu';
        application.statusClass = registration.payment === 'paid' ? 'paid' : 'pending';
        application.paymentDate = registration.payment === 'paid' ? new Date().toLocaleDateString('cs-CZ') : 'Dosud neuhrazeno';
        application.paymentNote = registration.payment === 'paid' ? 'Označeno jako uhrazené pořadatelem v demu' : 'Platba zatím nebyla přijata';
        renderMemberApplications();
      }
      renderRegistrationRows();
      renderAdminDetailRegistrationRows();
      if (document.querySelector('[data-admin-content="admin-event-detail"]').classList.contains('active')) showAdminEventDetail(currentAdminEventId);
      showToast("Stav platby byl v prototypu změněn.");
    }
  }

  const portalMenu = event.target.closest(".portal-menu");
  if (portalMenu) portalMenu.closest(".portal-shell").classList.toggle("sidebar-open");

  if (!event.target.closest("#member-account-menu, #header-member-access")) closeMemberAccountMenu();
});

allDialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
  dialog.addEventListener("close", () => {
    if (!allDialogs.some((item) => item.open)) {
      document.body.classList.remove("modal-open");
    }
  });
});

document.querySelector("#application-dog-options").addEventListener("change", updateApplicationDogSelection);
document.querySelector(".application-payment-options").addEventListener("change", () => updateApplicationPaymentMethod(true));
document.querySelector("#qr-payment-done").addEventListener("click", () => {
  closeDialog(qrPaymentDialog);
  showToast("Demo QR platební údaje byly zkontrolovány. Přihlášku můžete odeslat.");
});

applicationForm.addEventListener("submit", submitManagedApplication);

document.querySelector("#hero-login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = event.currentTarget.elements.email;
  const password = event.currentTarget.elements.password;
  const valid = Boolean(email.value.trim() && password.value.trim());
  email.classList.toggle("invalid", !email.value.trim());
  password.classList.toggle("invalid", !password.value.trim());
  [email, password].forEach(field => {
    const missing = !field.value.trim();
    field.setAttribute("aria-invalid", String(missing));
    document.querySelector(`#login-${field.name}-error`).hidden = !missing;
  });
  if (!valid) {
    (!email.value.trim() ? email : password).focus();
    return;
  }
  enterMemberAndContinue();
  showToast("Demo přihlášení bylo úspěšné.");
});

document.querySelector("#hero-login-form").addEventListener("input", event => {
  const field = event.target;
  if (!field.matches("input") || !field.value.trim()) return;
  field.classList.remove("invalid");
  field.removeAttribute("aria-invalid");
  document.querySelector(`#login-${field.name}-error`).hidden = true;
});

const sameAddressToggle = document.querySelector("#hero-register-form [name='sameAddress']");
const deliveryAddressFields = document.querySelector("#delivery-address-fields");

function updateDeliveryAddress() {
  const usesPermanentAddress = sameAddressToggle.checked;
  deliveryAddressFields.hidden = usesPermanentAddress;
  heroShell.classList.toggle("delivery-address-open", !usesPermanentAddress);
  deliveryAddressFields.querySelectorAll("input, select").forEach((field) => {
    field.required = !usesPermanentAddress;
    if (usesPermanentAddress) field.classList.remove("invalid");
  });
}

sameAddressToggle.addEventListener("change", updateDeliveryAddress);
updateDeliveryAddress();

const heroRegisterForm = document.querySelector("#hero-register-form");
const registrationErrorSummary = document.querySelector("#registration-error-summary");

function registrationFieldLabel(field) {
  return field.closest("label")?.querySelector(":scope > span:first-child, .consent-copy")?.textContent.replace(/\s*\*\s*$/, "").trim() || field.name;
}

function registrationFieldMessage(field) {
  if (field.validity.valueMissing) return `${registrationFieldLabel(field)} je povinné pole.`;
  if (field.validity.typeMismatch) return `${registrationFieldLabel(field)} nemá správný formát.`;
  if (field.validity.patternMismatch) {
    if (field.name === "phone") return "Telefonní číslo zadejte jako 9 až 14 číslic.";
    if (field.name.toLowerCase().includes("zip")) return "PSČ zadejte jako pět číslic.";
    if (field.name === "password") return "Heslo musí mít alespoň 8 znaků, velké a malé písmeno a číslo.";
    return `${registrationFieldLabel(field)} nemá správný formát.`;
  }
  if (field.validity.tooShort) return `${registrationFieldLabel(field)} je příliš krátké.`;
  return field.validationMessage || `${registrationFieldLabel(field)} zkontrolujte.`;
}

function setRegistrationFieldState(field, showError = true) {
  const valid = field.checkValidity();
  const error = document.querySelector(`#${field.id}-error`);
  field.classList.toggle("invalid", !valid);
  field.setAttribute("aria-invalid", String(!valid));
  if (error) {
    error.textContent = !valid && showError ? registrationFieldMessage(field) : "";
    error.hidden = valid || !showError;
  }
  return valid;
}

function initializeRegistrationErrors() {
  heroRegisterForm.querySelectorAll("input[required], select[required]").forEach((field) => {
    field.id ||= `registration-${field.name}`;
    const error = document.createElement("small");
    error.className = "field-error";
    error.id = `${field.id}-error`;
    error.hidden = true;
    error.setAttribute("aria-live", "polite");
    field.setAttribute("aria-describedby", [field.getAttribute("aria-describedby"), error.id].filter(Boolean).join(" "));
    field.closest("label")?.append(error);
    field.addEventListener("input", () => {
      if (field.name === "password" || field.name === "passwordConfirmation") {
        heroRegisterForm.elements.passwordConfirmation.setCustomValidity(
          heroRegisterForm.elements.password.value === heroRegisterForm.elements.passwordConfirmation.value ? "" : "Hesla se neshodují.",
        );
      }
      if (field.name === "email" || field.name === "emailConfirmation") {
        heroRegisterForm.elements.emailConfirmation.setCustomValidity(
          heroRegisterForm.elements.email.value.trim().toLowerCase() === heroRegisterForm.elements.emailConfirmation.value.trim().toLowerCase()
            ? ""
            : "E-mailové adresy se neshodují.",
        );
      }
      if (field.getAttribute("aria-invalid") === "true") setRegistrationFieldState(field);
    });
    field.addEventListener("blur", () => {
      if (field.value || field.type === "checkbox") setRegistrationFieldState(field);
    });
  });
}

initializeRegistrationErrors();

heroRegisterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const password = form.elements.password;
  const passwordConfirmation = form.elements.passwordConfirmation;
  const email = form.elements.email;
  const emailConfirmation = form.elements.emailConfirmation;

  passwordConfirmation.setCustomValidity(password.value === passwordConfirmation.value ? "" : "Hesla se neshodují.");
  emailConfirmation.setCustomValidity(
    email.value.trim().toLowerCase() === emailConfirmation.value.trim().toLowerCase()
      ? ""
      : "E-mailové adresy se neshodují.",
  );

  const required = [...form.querySelectorAll("input[required], select[required]")];
  const invalidFields = required.filter((field) => !setRegistrationFieldState(field));
  const valid = invalidFields.length === 0;
  if (!valid) {
    registrationErrorSummary.querySelector("ul").innerHTML = invalidFields
      .map((field) => `<li><button type="button" data-error-field="${field.id}">${registrationFieldMessage(field)}</button></li>`)
      .join("");
    registrationErrorSummary.hidden = false;
    registrationErrorSummary.focus();
    showToast("Opravte prosím označená pole registrace.");
    return;
  }

  registrationErrorSummary.hidden = true;

  document.querySelector("#hero-registered-email").textContent = email.value;
  document.querySelector("#member-marketing").checked = form.elements.marketing.checked;
  document.querySelector(".hero-register-fields").hidden = true;
  document.querySelector(".hero-registration-success").hidden = false;
  showToast("Účet byl vytvořen. Váš vystavovatelský profil je připravený.");
});

registrationErrorSummary.addEventListener("click", (event) => {
  const button = event.target.closest("[data-error-field]");
  if (button) document.querySelector(`#${button.dataset.errorField}`)?.focus();
});

document.querySelector("#hero-continue-first-login").addEventListener("click", () => {
  enterMemberAndContinue();
  showToast("Vítejte ve svém vystavovatelském profilu.");
});

document.querySelector("#account-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const isRegister = event.currentTarget.dataset.mode === "register";
  if (!isRegister) {
    const email = event.currentTarget.elements.accountEmail;
    const password = event.currentTarget.elements.accountPassword;
    const valid = Boolean(email.value.trim() && password.value.trim());
    email.classList.toggle("invalid", !email.value.trim());
    password.classList.toggle("invalid", !password.value.trim());
    if (!valid) {
      showToast("Zadejte e-mail a heslo.");
      return;
    }
    closeDialog(accountDialog);
    enterMemberAndContinue();
    showToast("Demo přihlášení bylo úspěšné.");
    return;
  }
  const required = [...event.currentTarget.querySelectorAll("input[required]")];
  let valid = true;
  required.forEach((field) => {
    const fieldValid = field.checkValidity();
    field.classList.toggle("invalid", !fieldValid);
    valid = valid && fieldValid;
  });
  if (!valid) {
    showToast("Doplňte prosím všechna povinná pole.");
    return;
  }
  const email = event.currentTarget.elements.accountEmail.value;
  document.querySelector("#registered-email").textContent = email;
  const randomPart = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).slice(0, 5).toUpperCase();
  document.querySelector("#temporary-password").textContent = `CK-${randomPart}-START`;
  const marketing = event.currentTarget.elements.accountMarketing.checked;
  document.querySelector("#member-marketing").checked = marketing;
  closeDialog(accountDialog);
  window.setTimeout(() => openDialog(firstLoginDialog), 30);
});

document.querySelector("#admin-access-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const password = event.currentTarget.elements.adminPassword;
  const error = document.querySelector("#admin-access-error");
  if (password.value !== "123456") {
    password.classList.add("invalid");
    error.hidden = false;
    showToast("Nesprávné heslo pořadatele.");
    password.focus();
    return;
  }
  password.classList.remove("invalid");
  error.hidden = true;
  closeDialog(adminAccessDialog);
  adminSessionActive = true;
  showPortal("admin");
  showToast("Vstoupili jste do demo administrace.");
});

document.querySelector("#continue-first-login").addEventListener("click", () => {
  closeDialog(firstLoginDialog);
  window.setTimeout(() => openDialog(passwordSetupDialog), 30);
});

document.querySelector("#password-setup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const password = event.currentTarget.elements.newPassword.value;
  const confirmation = event.currentTarget.elements.confirmPassword.value;
  if (password.length < 12) {
    showToast("Nové heslo musí mít alespoň 12 znaků.");
    return;
  }
  if (password !== confirmation) {
    showToast("Zadaná hesla se neshodují.");
    return;
  }
  closeDialog(passwordSetupDialog);
  enterMemberAndContinue();
  showToast("Heslo bylo nastaveno a jednorázový přístup zneplatněn.");
});

document.querySelector("#dog-create-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.checkValidity()) {
    event.currentTarget.reportValidity();
    return;
  }
  const data = new FormData(event.currentTarget);
  if (!data.get("newDogBreedGroup")) {
    showToast("Nejprve vyberte skupinu plemen.");
    openBreedPicker("group");
    return;
  }
  if (!data.get("newDogBreed")) {
    showToast("Vyberte plemeno z katalogu ČMKU.");
    openBreedPicker("breed");
    return;
  }
  const id = dogFormMode === "edit" ? currentMemberDogId : `dog-${Date.now()}`;
  const previousDog = memberDogs[id];
  const name = String(data.get("newDogName")).trim();
  const breed = String(data.get("newDogBreed")).trim();
  const pedigree = data.get("newDogPedigree");
  memberDogs[id] = {
    callName: String(data.get("newDogCallName")).trim(),
    fullName: name,
    registration: String(data.get("newDogRegistration")).trim(),
    chip: String(data.get("newDogChip")).trim(),
    tattoo: String(data.get("newDogTattoo")).trim(),
    birth: String(data.get("newDogBirth")),
    sex: String(data.get("newDogSex")),
    variety: String(data.get("newDogVariety")).trim(),
    kennel: String(data.get("newDogKennel")).trim(),
    breeder: String(data.get("newDogBreeder")).trim(),
    breedGroup: String(data.get("newDogBreedGroup")).trim(),
    breed,
    fatherRegistration: String(data.get("newDogFatherRegistration")).trim(),
    fatherName: String(data.get("newDogFatherName")).trim(),
    motherRegistration: String(data.get("newDogMotherRegistration")).trim(),
    motherName: String(data.get("newDogMotherName")).trim(),
    photo: dogCreatePhotoUrl,
    status: pedigree?.name ? "Čeká na ověření PP" : previousDog?.status || "Chybí průkaz původu",
    documents: pedigree?.name
      ? [{ type: (pedigree.name.split(".").pop() || "PDF").toLocaleUpperCase("cs"), title: "Průkaz původu", file: pedigree.name, status: "Čeká na kontrolu" }, ...(previousDog?.documents || []).filter((document) => !document.title.startsWith("Průkaz původu"))]
      : previousDog?.documents || [],
    awards: previousDog?.awards || [],
  };
  const existingRosterButton = [...document.querySelectorAll("[data-dog-select]")].find((button) => button.dataset.dogSelect === id);
  const rosterButton = createDogRosterButton(id, memberDogs[id]);
  if (existingRosterButton) existingRosterButton.replaceWith(rosterButton);
  else document.querySelector("#dog-roster-list").append(rosterButton);
  updateDogRosterSummary();
  event.currentTarget.reset();
  selectMemberDog(id);
  switchDogTab("basic");
  showToast(dogFormMode === "edit" ? "Údaje psa byly uloženy." : "Profil psa byl vytvořen.");
});

document.querySelector("#new-dog-photo").addEventListener("change", (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    event.currentTarget.value = "";
    showToast("Fotografie může mít maximálně 10 MB.");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    dogCreatePhotoUrl = String(reader.result);
    document.querySelector("#dog-photo-preview").innerHTML = `<img src="${dogCreatePhotoUrl}" alt="Náhled fotografie psa" /><small>Změnit fotografii</small>`;
  });
  reader.readAsDataURL(file);
});

document.querySelector("#breed-picker-search").addEventListener("input", renderBreedPicker);
document.querySelector("#breed-picker-show-all").addEventListener("click", () => {
  breedPickerIgnoreGroup = true;
  renderBreedPicker();
});
document.querySelector("#event-breed-search").addEventListener("input", renderEventBreedOptions);
document.querySelector("#event-breed-class-editor").addEventListener("change", (event) => {
  if (!activeEventBreed || !event.target.matches("[data-event-class]")) return;
  const classes = ensureEventBreedClasses(activeEventBreed);
  if (event.target.checked) classes.add(event.target.value);
  else classes.delete(event.target.value);
  renderSelectedEventBreeds();
});

document.querySelector("#event-create-form").addEventListener("submit", saveManagedEvent);
document.querySelector("#admin-event-filters").addEventListener("input", renderAdminEvents);
document.querySelector("#admin-event-filters").addEventListener("submit", event => event.preventDefault());
document.querySelector('[name="eventFrom"]').addEventListener('change', event => {
  const end = document.querySelector('[name="eventTo"]');
  if (!end.value) end.value = event.target.value;
});

document.querySelector("#profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Kontaktní údaje byly uloženy.");
});

document.querySelector("#member-marketing").addEventListener("change", (event) => {
  showToast(event.currentTarget.checked ? "Souhlas s newsletterem byl uložen." : "Souhlas s newsletterem byl odvolán.");
});

document.querySelector("#pedigree-upload").addEventListener("change", (event) => appendUploadedFiles(event.currentTarget, "pedigree"));
document.querySelector("#dog-document-upload").addEventListener("change", (event) => appendUploadedFiles(event.currentTarget, "document"));

document.querySelector("#registration-search").addEventListener("input", renderRegistrationRows);
document.querySelector("#payment-filter").addEventListener("change", renderRegistrationRows);

document.querySelector(".password-toggle").addEventListener("click", (event) => {
  const input = event.currentTarget.closest(".password-field").querySelector("input");
  input.type = input.type === "password" ? "text" : "password";
  event.currentTarget.setAttribute("aria-label", input.type === "password" ? "Zobrazit heslo" : "Skrýt heslo");
});

const video = document.querySelector("#hero-video");
const soundToggle = document.querySelector("#sound-toggle");
if (video && soundToggle) {
  soundToggle.classList.add("muted");
  soundToggle.addEventListener("click", () => {
    video.muted = !video.muted;
    soundToggle.classList.toggle("muted", video.muted);
    soundToggle.setAttribute("aria-label", video.muted ? "Zapnout zvuk videa" : "Vypnout zvuk videa");
  });
}

const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");
function closeMobileNavigation({ restoreFocus = false } = {}) {
  mobileNav.hidden = true;
  document.body.classList.remove("mobile-menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Otevřít menu");
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  mobileNav.hidden = open;
  document.body.classList.toggle("mobile-menu-open", !open);
  menuButton.setAttribute("aria-label", open ? "Otevřít menu" : "Zavřít menu");
  if (!open) window.setTimeout(() => mobileNav.querySelector("a, button")?.focus(), 30);
});

mobileNav.addEventListener("click", (event) => {
  if (event.target === mobileNav) closeMobileNavigation({ restoreFocus: true });
  if (event.target.closest("a, button")) closeMobileNavigation();
});

window.addEventListener("resize", () => {
  if (window.innerWidth <= 1120) closeMemberAccountMenu();
  if (window.innerWidth > 980 && !mobileNav.hidden) closeMobileNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.body.classList.remove("modal-open");
    closeMemberAccountMenu();
    if (!mobileNav.hidden) closeMobileNavigation({ restoreFocus: true });
  }
});

let pendingDetailEventId = null;
let pendingMemberPanel = null;
let adminSessionActive = false;
const publicPages = new Set(["uvod", "klub", "prihlaseni", "registrace", "vystava-exterieru-psu"]);
const publicTitles = {
  uvod: "Česká kynologická | Klub a výstavy psů",
  klub: "Klub | Česká kynologická",
  prihlaseni: "Přihlášení do výstavní části | Česká kynologická",
  registrace: "Vytvořit vystavovatelský profil | Česká kynologická",
  "vystava-exterieru-psu": "Výstava exteriéru psů | Česká kynologická",
};

function renderPublicPage(page, { focus = true, anchor = null } = {}) {
  allDialogs.forEach(closeDialog);
  hidePortals();
  closeMemberAccountMenu();
  closeMobileNavigation();
  document.body.dataset.publicPage = page;
  document.querySelectorAll("[data-public-page]").forEach((section) => {
    section.hidden = !section.dataset.publicPage.split(" ").includes(page);
  });
  setHeroRegistration(page === "registrace", false);
  document.title = publicTitles[page];
  const activePage = page === "vystava-exterieru-psu" ? "klub" : ["prihlaseni", "registrace"].includes(page) ? "vystavy" : page;
  document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]').forEach((link) => {
    const active = link.getAttribute("href") === `#${activePage}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (anchor) {
    const target = document.getElementById(anchor);
    target?.scrollIntoView({ behavior: "instant", block: "start" });
    if (focus && target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  } else {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (focus) {
      const target = page === "registrace" ? document.querySelector("#hero-register-heading") : document.querySelector('main [data-public-page]:not([hidden]) h1');
      if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
    }
  }
}

function applyPublicRoute({ focus = true } = {}) {
  const route = location.hash.slice(1) || "uvod";
  if (route === "vystavy") {
    if (memberSessionActive) showPortal("member");
    else renderPublicPage("prihlaseni", { focus });
  } else if (route === "poradatel") {
    if (adminSessionActive) showPortal("admin");
    else { renderPublicPage("uvod", { focus }); openAdminAccess(); }
  } else if (route === "kalendar") {
    renderPublicPage("uvod", { focus, anchor: "kalendar" });
  } else if (route.startsWith("clanek-")) {
    renderPublicPage("vystava-exterieru-psu", { focus, anchor: route });
  } else if (route === "poradenstvi") {
    renderPublicPage("klub", { focus });
  } else if (route === "kontakt") {
    location.assign("kontakt.html");
  } else {
    renderPublicPage(publicPages.has(route) ? route : "uvod", { focus });
  }
}

function navigatePublic(page) {
  if (location.hash !== `#${page}`) history.pushState(null, "", `#${page}`);
  applyPublicRoute();
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.hasAttribute("data-exit-portal") || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const page = link.getAttribute("href").slice(1);
  if (page === "main-content") {
    event.preventDefault();
    const main = document.querySelector("#main-content");
    main.focus({ preventScroll: true });
    main.scrollIntoView({ behavior: "instant" });
    return;
  }
  event.preventDefault();
  navigatePublic(page || "uvod");
});
window.addEventListener("popstate", () => applyPublicRoute());
window.addEventListener("hashchange", () => applyPublicRoute());

function showBrandIntro() {
  // Show once per page load; never replay during navigation or keep login in storage.
  if (location.hash && location.hash !== "#uvod") return;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionPreference.matches) return;
  const intro = document.querySelector("#brand-intro");
  const duration = 2400;
  const fadeDuration = 450;
  intro.style.setProperty("--intro-fade-duration", `${fadeDuration}ms`);
  intro.showModal();
  document.body.classList.add("intro-active");
  const dismiss = () => { if (intro.open) intro.close(); };
  const fadeTimer = window.setTimeout(() => intro.classList.add("is-leaving"), duration - fadeDuration);
  const timer = window.setTimeout(dismiss, duration);
  const reduceMotion = (event) => { if (event.matches) dismiss(); };
  motionPreference.addEventListener("change", reduceMotion);
  intro.addEventListener("close", () => {
    window.clearTimeout(fadeTimer);
    window.clearTimeout(timer);
    motionPreference.removeEventListener("change", reduceMotion);
    intro.classList.remove("is-leaving");
    document.body.classList.remove("intro-active");
    document.querySelector("#login-heading")?.focus({ preventScroll: true });
  }, { once: true });
}

initializeEventManagement();
setHeroRegistration(false, false);
updateMemberSessionUI();
renderEvents();
renderMemberEvents();
updateDogRosterSummary();
selectMemberDog(currentMemberDogId);
renderRegistrationRows();
renderAdminDetailRegistrationRows();
loadBreeds();
applyPublicRoute({ focus: false });
showBrandIntro();
