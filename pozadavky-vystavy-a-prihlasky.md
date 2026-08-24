# Požadavky na přehled výstav a online přihlášku psa

Stav analýzy: **17. 8. 2026**

Tento dokument rozlišuje:

- co zobrazuje veřejný kalendář ČMKU,
- co je povinné podle aktuálního Výstavního řádu ČMKU,
- co vyžaduje současný proces v DogOffice,
- co má být povinné v našem vlastním systému.

> Důležité rozhodnutí před vývojem: pokud naše stránka pouze zobrazuje výstavy a uživatele přesměruje do DogOffice, nepotřebujeme vlastní účty, psy, dokumenty, platby ani přihlášky. Pokud budeme přihlášky skutečně přijímat, potřebujeme souhlas a spolupráci pořadatele, správu citlivých dokumentů, platby, potvrzování přihlášek, katalog a dodržení Výstavního řádu ČMKU.

## 1. Stručný závěr: co je pro první verzi opravdu nutné

Pro plnohodnotnou stránku s přehledem a vlastní přihláškou potřebujeme nejméně tyto části:

1. **Přehled výstav** – název, typ, datum, místo, uzávěrky, stav přihlašování a odkaz na detail.
2. **Detail výstavy** – organizátor, kontakt, propozice, termíny, způsobilá plemena/skupiny, třídy a poplatky.
3. **Účet vystavovatele** – jméno, příjmení, e-mail, telefon a jedna kontaktní adresa.
4. **Profil psa** – plemeno, celé jméno, pohlaví, datum narození, zápisové číslo, identifikace a vlastník/spoluvlastníci.
5. **Dokumenty psa** – povinně obě strany průkazu původu; podle třídy také pracovní certifikát nebo doklad o titulu.
6. **Přihláška** – výstava, pes, právě jedna výstavní třída, cena a povinné potvrzení pravidel.
7. **Platba a stav** – částka, měna, stav platby a stav přihlášky.
8. **Potvrzení** – e-mailové potvrzení a záznam v sekci „Moje přihlášky“.
9. **Administrace pořadatele** – kontrola dokumentů, přijetí/zamítnutí, platby, export katalogu a vstupní list.
10. **Ochrana osobních údajů** – informační text, řízení přístupů, doby uchování a zákaz předčasného zveřejnění účastníků.

Nestačí tedy jedna tabulka `prihlasky`. Potřebujeme samostatné entity pro uživatele, psy, dokumenty, výstavy, uzávěrky, přihlášky, přihlášené psy a platby.

## 2. Význam označení

| Označení | Význam |
|---|---|
| **Povinné** | Bez údaje nelze pokračovat nebo jej vyžaduje Výstavní řád/propozice. |
| **Podmíněně povinné** | Povinné jen pro určitou třídu, výstavu, zemi nebo situaci. |
| **Doporučené** | Není nutné k podání přihlášky, ale potřebujeme jej pro kvalitní přehled nebo administraci. |
| **Volitelné** | Nemá blokovat odeslání. |

## 3. Přehled výstav

Veřejný seznam ČMKU používá filtry **typ výstavy** a **konání od–do**. V tabulce zobrazuje datum, typ, název a město. Ikony navíc signalizují dostupné propozice, přihlášení přes DogOffice a blížící se uzávěrku.

### Povinná pole pro kartu nebo řádek výstavy

| Pole | Povinnost | Poznámka |
|---|---:|---|
| `id` nebo `slug` | Povinné | Stabilní interní identifikátor. Číslo ČMKU ukládat zvlášť jako externí ID. |
| `nazev` | Povinné | Úplný název výstavy. |
| `typ_vystavy` | Povinné | Číselník, ne volný text. |
| `datum_od` | Povinné | Datum prvního dne. |
| `datum_do` | Povinné | U jednodenní výstavy stejné jako `datum_od`. |
| `misto` | Povinné | Město nebo přesné místo konání. |
| `prihlasovani_od` | Doporučené | Podle něj lze správně vypočítat stav. |
| `uzaverky[]` | Povinné pro přihlášku | Výstava může mít více uzávěrek a různé ceny. Neukládat jen jednu hodnotu. |
| `stav` | Povinné, odvozené | `pripravovana`, `prihlasovani_otevreno`, `uzavrena`, `zrusena`, `probehla`. |
| `propozice_url` | Podmíněně povinné | Je-li dokument zveřejněn, musí být na kartě i detailu snadno dostupný. |
| `prihlaska_url` | Podmíněně povinné | DogOffice nebo náš interní formulář. Zobrazit jen při otevřeném přihlašování. |
| `zruseno` a `duvod_zruseni` | Podmíněně povinné | Zrušená akce musí být nepřehlédnutelná; nestačí změnit název. |

### Číselník typů výstav z veřejného webu ČMKU

- Mezinárodní
- Národní
- Oblastní a krajské
- Klubové
- Oblastní a krajské klubové
- Speciální
- Klubové speciální
- Mimořádná výstava
- Šampion šampionů
- Bonitace
- Světová výstava
- Jubilejní výstava
- Evropská klubová
- Evropská výstava
- Světová klubová

Nepoužívat tento název jako primární klíč. Číselník se může změnit; od 1. 1. 2027 se podle aktuálního Výstavního řádu mění názvosloví oblastních/krajských výstav.

## 4. Detail výstavy

Veřejný detail ČMKU aktuálně obsahuje název, datum, typ, propozice, organizátora, telefon, e-mail, web, odkaz na přihlášku a jednu či více uzávěrek.

### Minimum pro náš detail

| Pole | Povinnost | Poznámka |
|---|---:|---|
| Všechna pole z přehledu | Povinné | Detail nesmí mít méně informací než karta. |
| `organizator_nazev` | Povinné | Právnická osoba nebo pověřený klub. |
| `kontakt_jmeno` | Doporučené | Kontaktní osoba pro přihlášky. |
| `kontakt_email` | Povinné | Validní e-mail. |
| `kontakt_telefon` | Povinné | Ukládat normalizovaně, ideálně E.164. |
| `web_url` | Volitelné | Web pořadatele nebo výstavy. |
| `propozice_url` nebo dokument | Povinné pro vlastní přihlášení | Uživatel je musí před odesláním otevřít/odsouhlasit. |
| `rozhodci[]` | Podmíněně povinné | V propozicích klubových, speciálních, národních a mezinárodních výstav mají být rozhodčí přiřazeni k plemenům/skupinám. |
| `povolena_plemena[]` / `povolene_skupiny[]` | Povinné | Zabrání přihlášení psa na nesprávnou výstavu nebo den. |
| `rozpis_dnu[]` | Podmíněně povinné | Vícedenní výstava musí určit, které skupiny/plemena jsou který den. |
| `tridy[]` | Povinné | Povolené třídy, věkové limity, podmíněné doklady a cena. |
| `poplatky[]` | Povinné | Cena podle uzávěrky, třídy, pořadí psa a měny. |
| `veterinarni_podminky` | Povinné v propozicích | Mohou být textem nebo odkazem na konkrétní část propozic. |
| `bankovni_udaje` / platební metoda | Povinné při vlastní platbě | Číslo účtu, měna a případně platební brána. Veřejně zobrazit jen údaje určené pořadatelem. |

Propozice nejsou jen příloha „navíc“. Pořadatel musí podle Výstavního řádu vydat propozice se všemi důležitými údaji pro účast a s podmínkami vylučujícími psa z účasti.

## 5. Registrace uživatele

Na dodaném snímku registrace DogOffice jsou uvedena následující pole.

### Pole účtu

| Pole | DogOffice | Pro náš systém |
|---|---:|---:|
| Uživatelské jméno | Povinné | **Nepotřebujeme**, pokud bude přihlášení e-mailem. |
| Heslo | Povinné | Povinné. Neukládat nikdy v otevřeném tvaru, pouze bezpečný hash. |
| Heslo znovu | Povinné | Povinné pouze ve formuláři, neukládat. |
| E-mail | Povinné | Povinné a unikátní. |
| E-mail znovu | Povinné v DogOffice | Doporučené pouze při registraci; neukládat. |

DogOffice na snímku požaduje u uživatelského jména pouze písmena, číslice, `_` a `@`. Heslo musí obsahovat velké a malé písmeno, číslo a alespoň 8 znaků. Pro naši aplikaci uživatelské jméno nepotřebujeme a u hesla nemá smysl zakazovat jiné znaky.

### Osobní a kontaktní údaje

| Pole | Povinnost | Poznámka |
|---|---:|---|
| Titul před / titul za | Volitelné | Nevyžadovat. |
| Jméno | Povinné | Musí odpovídat údajům vlastníka v průkazu původu. |
| Příjmení | Povinné | Totéž. |
| Telefonní předvolba | Povinné | Samostatně nebo společně s telefonem. |
| Telefon | Povinné | DogOffice pro české číslo očekává 9 číslic bez předvolby. My ukládáme normalizovaný mezinárodní formát. |
| Trvalá ulice a č.p. | Povinné pro přihlášku | Není nutné ji vyžadovat už při založení prázdného účtu; lze doplnit při první přihlášce. |
| Trvalé město | Povinné pro přihlášku | Stejně jako výše. |
| Trvalé PSČ | Povinné pro přihlášku | Validace podle země. |
| Stát | Povinné | Číselník zemí. |
| Doručovací adresa | Podmíněně povinné | Jen pokud se liší a pořadatel opravdu něco posílá poštou. Jinak ji nesbírat. |

### Spoluvlastnictví

Pokud má pes více vlastníků, směrodatná jsou jména v průkazu původu. V katalogu se uvádějí jména spolumajitelů, ale pouze jedna kontaktní adresa. Datový model proto musí mít vztah `dog_owners`, ne jedno textové pole `vlastnik`.

## 6. Profil psa

DogOffice při prvním přidání českého psa požaduje nejdříve **zápisové číslo** a **plemeno**. Poté načte nebo doplní detail psa.

### Povinné údaje psa

| Pole | Povinnost | Poznámka |
|---|---:|---|
| `breed_id` | Povinné | Odkaz do našeho souboru `plemena-cmku.json`. |
| `skupina_kod` | Odvozené | Nevyplňuje uživatel; odvodit z plemene. |
| `cele_jmeno` | Povinné | Jméno přesně podle průkazu původu, včetně názvu chovatelské stanice. |
| `zapisove_cislo` | Povinné | Uložit jako text, ne číslo. České příklady mají tvar `registr/plemeno/číslo[/rok...]`; zahraniční formáty se liší. |
| `datum_narozeni` | Povinné | Z něj se počítají povolené třídy k datu konkrétního dne výstavy. |
| `pohlavi` | Povinné | Číselník, minimálně `pes` / `fena`. |
| `owner_ids[]` | Povinné | Vlastník a spoluvlastníci podle PP. |
| `chip` nebo `tetovani` | Podmíněně povinné | Identifikace psa; systém má podporovat obě možnosti. |
| `varieta` | Podmíněně povinné | Barva, velikost nebo typ srsti, pokud se plemeno podle variety rozděluje. |
| `chovatel` | Povinné pro katalog | Jméno chovatele podle PP. |
| `otec_jmeno` | Povinné pro běžný katalog | Z PP; zápisové číslo otce může být volitelné. |
| `matka_jmeno` | Povinné pro běžný katalog | Z PP; zápisové číslo matky může být volitelné. |
| `zahranicni_chs` | Podmíněné | Pomůže při skládání celého jména a zahraničních údajích. |

Jméno psa, plemeno, pohlaví, datum narození, rodiče, chovatel a vlastník se nemají při každé přihlášce znovu opisovat. Přihláška má odkazovat na profil psa a zároveň si při odeslání uložit neměnný „snapshot“ údajů pro katalog.

## 7. Dokumenty psa

### Vždy povinný dokument

- **Úplná a čitelná kopie obou stran průkazu původu**, včetně strany, kde jsou uvedeni vlastníci a spoluvlastníci.

### Podmíněně povinné dokumenty

| Situace / třída | Doklad |
|---|---|
| Třída pracovní | Pracovní certifikát pro dané plemeno a typ výstavy. |
| Třída šampionů | Doklad o uznaném mezinárodním nebo národním šampionátu. |
| Třída vítězů | Doklad o kvalifikačním titulu podle Výstavního řádu. |
| Třída čestná | Doklad o kvalifikačním titulu podle propozic a Výstavního řádu. |
| Zahraniční nebo zvláštní případ | Další dokument uvedený v propozicích konkrétní výstavy. |

DogOffice nabízí typy dokumentů: průkaz původu, pracovní certifikát, národní šampion člena FCI, mezinárodní šampion C.I.B./C.I.E., světový vítěz, sekční vítěz, národní vítěz, klubový vítěz a vítěz speciální výstavy.

Každý dokument má mít nejméně:

- `id`, `dog_id`, `typ`, bezpečný odkaz na soubor,
- datum nahrání,
- stav `cekajici`, `schvaleny`, `zamitnuty`,
- kdo a kdy jej ověřil,
- neveřejnou poznámku pořadatele,
- historii změn.

Dokumenty nesmí být veřejné ani dostupné přes snadno odhadnutelnou URL.

## 8. Výstavní třídy a validační pravidla

Pro zařazení je rozhodující věk psa **v den jeho posouzení**, ne v den odeslání přihlášky. Ostatní podmínky musí být splněny při podání.

### Povinně podporované třídy podle Výstavního řádu platného od 26. 1. 2026

| Třída | Věk / podmínka |
|---|---|
| Štěňat | 4–6 měsíců |
| Dorostu | 6–9 měsíců |
| Mladých | 9–18 měsíců |
| Mezitřída | 15–24 měsíců |
| Otevřená | od 15 měsíců |
| Pracovní | od 15 měsíců + platný certifikát; podmínky se liší podle druhu výstavy a plemene |
| Šampionů | od 15 měsíců; pouze mezinárodní výstavy + doklad o šampionátu |
| Veteránů | od 8 let |
| Vítězů | od 15 měsíců; mimo mezinárodní výstavy + uznaný titul |
| Chovatelů / Bred by Exhibitor | od 15 měsíců, **platí až od 1. 1. 2027**; vystavovatel musí být chovatelem uvedeným v PP a psa osobně předvádět |

### Třídy, které může pořadatel otevřít

| Třída | Věk / podmínka |
|---|---|
| Čestná | od 15 měsíců + uznaný titul |
| Mimo konkurenci | od 15 měsíců; jen klubové a speciální výstavy |

Systém nesmí zobrazit jeden univerzální seznam. Nabídku vypočítá z:

- data narození a konkrétního dne posouzení,
- typu výstavy,
- plemene a jeho pravidel,
- dokumentů psa,
- tříd povolených pořadatelem.

Jeden pes smí být na jedné výstavě přihlášen pouze do jedné třídy. U několika navazujících výstav se třída posuzuje pro každý den zvlášť.

## 9. Samotná přihláška

DogOffice používá čtyři kroky.

### Krok 1 – Přihlašující

Povinně se přebírá z profilu:

- jméno a příjmení,
- telefon,
- e-mail,
- ulice a č.p., PSČ, město a stát.

V průběhu přihlášky se údaje mají pouze potvrdit. Změna musí proběhnout v profilu, aby nevznikly různé adresy u různých přihlášek.

### Krok 2 – Přihlášení psi

Povinné:

- vybrat psa z profilu,
- vybrat právě jednu povolenou třídu,
- mít přiložený oboustranný průkaz původu,
- doložit dokument požadovaný pro podmíněnou třídu.

V souhrnu zobrazit celé jméno, zápisové číslo, plemeno, třídu, otce, matku a chovatele.

### Krok 3 – Doplňkové soutěže

Celý krok je volitelný. Pokud uživatel přidá soutěž, její výběr je povinný. Aktuální DogOffice nabízí například Junior handling, Nejlepší pár psů a Nejlepší chovatelskou skupinu. Každá soutěž potřebuje vlastní pravidla a vlastní cenu; nemá být uložena do sloupce `poznamka`.

### Krok 4 – Shrnutí a odeslání

Povinně zobrazit:

- název výstavy,
- přihlašujícího a kontaktní údaje,
- každého psa a jeho třídu,
- doplňkové soutěže,
- rozpis ceny a cenu celkem,
- pravidla/propozice platné pro tuto přihlášku.

Před odesláním musí uživatel aktivně potvrdit, že se seznámil s propozicemi a Výstavním řádem ČMKU a bude je dodržovat. Checkbox nesmí být předem zaškrtnutý. Uložit:

- čas potvrzení,
- verzi Výstavního řádu,
- verzi nebo hash propozic,
- přesné znění potvrzeného textu.

Tlačítko **Odeslat přihlášku** musí být jasně odlišeno od uložení rozepsaného konceptu. Do posledního potvrzení nevytvářet závaznou přihlášku.

## 10. Platba, stav přihlášky a vstupní list

### Doporučené stavy přihlášky

```text
koncept
→ odeslana
→ ceka_na_kontrolu
→ prijata | zamitnuta | vyzaduje_doplneni
→ uzavrena | stornovana
```

Stav dokumentů, platby a vstupního listu musí být oddělené od stavu přihlášky. Platba má například vlastní tok `nezaplacena → ceka_na_platbu → zaplacena → vracena` a vstupní list `nevydan → vydan`.

### Povinná platební pole

| Pole | Povinnost |
|---|---:|
| `castka` a `mena` | Povinné |
| `variabilni_symbol` nebo ID transakce | Povinné podle platební metody |
| `payment_status` | Povinné |
| `paid_at` | Podmíněně povinné |
| `doklad_o_zaplaceni` | Volitelné; pouze pokud jej pořadatel přijímá |
| `refund_status` | Podmíněně povinné |

Propozice kontrolované výstavy uvádějí, že nezaplacené přihlášky do uzávěrky nebudou přijaty. Po odeslání proto systém musí vygenerovat platební instrukce a uživateli viditelně ukázat termín úhrady.

Pořadatel musí potvrdit přijetí přihlášky. Uživatel musí obdržet e-mail a současně vidět přihlášku v „Moje přihlášky“. Vstupní list má být dostupný až po přijetí a podle harmonogramu pořadatele.

## 11. Doporučený datový model

| Entita | Nejdůležitější pole |
|---|---|
| `users` | e-mail, hash hesla, jméno, příjmení, telefon, kontaktní adresa, stav účtu |
| `dog_owners` | `dog_id`, `user_id` nebo externí vlastník, pořadí, kontaktní vlastník |
| `dogs` | `breed_id`, celé jméno, zápisové číslo, datum narození, pohlaví, čip/tetování, varieta, chovatel, rodiče |
| `dog_documents` | pes, typ, soubor, stav ověření, audit |
| `shows` | externí ID, název, typ, data, místo, organizátor, kontakt, propozice, stav |
| `show_deadlines` | výstava, pořadí uzávěrky, datum a čas |
| `show_classes` | výstava, třída, věkové/podmínkové pravidlo, cena |
| `show_breeds` | výstava/den, plemeno nebo FCI skupina, rozhodčí |
| `entries` | výstava, přihlašující, stav, celková cena, čas odeslání, verze pravidel |
| `entry_dogs` | přihláška, pes, den, třída, cena a snapshot katalogových údajů |
| `competition_entries` | přihláška, soutěž, účastníci, cena |
| `payments` | přihláška, částka, měna, stav, reference, čas úhrady |
| `entry_audit_log` | změna stavu, kdo, kdy a proč |

### Důležité databázové zásady

- `zapisove_cislo` a `fci_cislo` ukládat jako text; FCI číslo může začínat nulou.
- Plemeno a FCI skupinu neukládat jako volný uživatelský text.
- Historická přihláška musí zachovat snapshot údajů i po pozdější změně profilu psa.
- Cena musí být vypočítaná na serveru, ne převzatá z prohlížeče.
- Uzávěrka musí obsahovat časovou zónu; pro české akce standardně `Europe/Prague`.
- Server musí zabránit duplicitní závazné přihlášce stejného psa na stejnou výstavu.
- Přihlášku po uzávěrce nelze běžným uživatelem měnit; výjimka musí mít administrátorský audit.

## 12. Soukromí a bezpečnost – povinné minimum

Protože systém zpracovává jména, adresy, kontakty, kopie průkazů původu a platby, je před spuštěním nutné určit správce a případné zpracovatele osobních údajů.

### Musíme mít

- srozumitelnou informaci o zpracování údajů už při jejich získání,
- identitu a kontakt správce,
- účely a právní základy zpracování,
- příjemce nebo kategorie příjemců,
- dobu uchování,
- popis práv uživatele a způsob jejich uplatnění,
- smlouvy se zpracovateli (hosting, e-mail, platební brána apod.),
- řízení přístupů, audit a bezpečné zálohy,
- pravidla výmazu nebo anonymizace po skončení účelu.

Nevytvářet jeden obecný povinný checkbox „Souhlasím s GDPR“. Nezbytné zpracování přihlášky obvykle potřebuje správně popsaný účel a právní titul; dobrovolný souhlas se používá jen pro skutečně volitelné účely, například marketing. Konkrétní právní titul a texty má před spuštěním potvrdit správce nebo právník.

### Kritické pravidlo pro katalog

Výstavní řád uvádí, že online katalog s plánem hodnocení, plemeny, jmény psů a majiteli smí být zveřejněn až **v den výstavy**, nikdy dříve než **dvě hodiny před oficiálním zahájením prvního dne**. Program zveřejněný dříve nesmí obsahovat jména přihlášených psů ani osobní údaje majitelů.

Toto musí vynucovat backend. Nestačí skrýt odkaz ve frontendové aplikaci.

Výstavní řád dále požaduje archivaci přihlášek pořadatelem po dobu **jednoho roku**. Po této době je nutné rozhodnout, která data musí zůstat kvůli účetnictví, výsledkům nebo právním nárokům a která se vymažou či anonymizují.

## 13. Co není povinné pro první verzi

Následující funkce mohou počkat, pokud je nepotřebuje první pořadatel:

- titul před/za jménem,
- samostatné uživatelské jméno,
- doručovací adresa, pokud se nic neposílá,
- sdílení psa mezi více uživatelskými účty,
- kompletní evidence všech ocenění a šampionátů,
- doplňkové soutěže,
- online výsledky a posudky,
- automatická fakturace v EUR,
- digitální vstupní list do mobilní peněženky.

Spoluvlastníky uvedené v PP, oboustranný PP, výběr třídy, pravidla, platbu a potvrzení přihlášky naopak nelze odsunout, pokud opravdu přijímáme oficiální přihlášky.

## 14. Doporučený postup implementace

1. Rozhodnout, zda jen přesměrováváme do DogOffice, nebo jsme registrační systém pořadatele.
2. Dohodnout s ČMKU/pořadatelem oficiální zdroj a způsob synchronizace výstav; nespoléhat dlouhodobě na ruční kopírování nebo scraping HTML.
3. Implementovat číselníky plemen, skupin, typů výstav, tříd a stavů.
4. Vytvořit přehled a detail výstavy.
5. Vytvořit účet, profil psa a bezpečné dokumenty.
6. Implementovat čtyřkrokovou přihlášku s výpočtem tříd na serveru.
7. Doplnit platby, kontrolu pořadatele, potvrzení a vstupní list.
8. Otestovat uzávěrky, více dnů, více vlastníků, zahraniční zápisová čísla a podmíněné dokumenty.
9. Před ostrým provozem nechat schválit propozice, texty ochrany osobních údajů, retenční lhůty a odpovědnosti mezi námi a pořadatelem.

## 15. Kontrolní checklist před odesláním přihlášky

- [ ] Přihlašování je otevřené a neuplynula uzávěrka.
- [ ] Plemeno je na výstavu a daný den přijímané.
- [ ] Pes dosahuje věku pro zvolenou třídu v den posouzení.
- [ ] Pes není na stejnou výstavu přihlášen v jiné třídě.
- [ ] Profil má všechny povinné katalogové údaje.
- [ ] Vlastník/spoluvlastníci odpovídají průkazu původu.
- [ ] Je přiložen čitelný oboustranný průkaz původu.
- [ ] Jsou přiloženy doklady pro pracovní/šampion/vítěz/čestnou třídu.
- [ ] Cena odpovídá uzávěrce, třídě a počtu přihlášených psů.
- [ ] Uživatel potvrdil aktuální propozice a Výstavní řád.
- [ ] Server uložil snapshot, čas odeslání a verze dokumentů.
- [ ] Byly vygenerovány platební instrukce.
- [ ] Uživatel dostal potvrzení a vidí přihlášku ve svém účtu.

## 16. Použité zdroje

- [Oficiální kalendář výstav ČMKU](https://vystavy.cmku.cz/cz/vystavy)
- [Ukázkový detail mezinárodní výstavy na ČMKU](https://vystavy.cmku.cz/cz/vystavy/detail-vystavy/27771)
- [Výstavní řád ČMKU platný od 26. 1. 2026](https://www.cmku.cz/data/dokumenty/2678-vystavni-rad-cmku-platny-od-2612026.pdf)
- [Propozice Mezinárodní výstavy psů Olomouc 2026](https://vystavy.cmku.cz/data/propozice/27771.pdf)
- Dodané snímky a read-only kontrola aktuálního rozhraní DogOffice: registrace účtu, profil, pes, dokumenty a čtyřkroková přihláška. Nebyla odeslána žádná přihláška ani změna účtu.
- [ÚOOÚ – základní příručka k ochraně údajů](https://uoou.gov.cz/index.php/verejnost/zakladni-prirucka-k-ochrane-udaju)
- [ÚOOÚ – desatero zpracování pro správce](https://uoou.gov.cz/profesional/metodiky-a-doporuceni-pro-spravce/desatero-zpracovani-pro-spravce)
- [Nařízení GDPR – úplné znění na EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=cs)
