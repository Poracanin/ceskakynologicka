# Pravidla projektu České kynologické

Tento dokument je závazný kontext pro všechny další úpravy v tomto projektu.

## Co vytváříme

Vytváříme profesionální webovou aplikaci pro registraci vystavovatelů a přihlašování psů na výstavy. Nejde o obecný marketingový web ani generický KPI dashboard. Rozhraní musí odpovídat skutečné práci vystavovatelů a pořadatelů kynologických výstav.

Projekt má tři hlavní části:

1. Veřejný web s kalendářem a podrobnostmi výstav.
2. Členskou zónu vystavovatele pro osobní údaje, psy, dokumenty, ocenění, přihlášky a platby.
3. Administraci pořadatele pro výstavy, přihlášené psy, vystavovatele, dokumenty, platby, rozpočet a propozice.

## Hlavní uživatelský postup

Registrace uživatele → doplnění osobních údajů → přidání jednoho nebo více psů → nahrání průkazu původu a dokumentů → výběr výstavy → výběr psa a třídy → kontrola a odeslání přihlášky → platba → sledování stavu a vstupní list.

Každá úprava musí tento postup zjednodušovat. Nepřidávat prvky, které s ním nesouvisejí.

## Vizuální směr

- Zachovat profesionální černo-zlatý vizuální styl.
- Rozhraní je určeno převážně lidem, kteří již výstavy psů znají. Text má být věcný, odborný a důvěryhodný.
- Používat výraznou a dobře čitelnou typografii. Drobné texty nepoužívat pro důležité informace nebo ovládání.
- Vytvářet jasnou hierarchii pomocí nadpisů, prostoru, sloupců, jemných linek a změn pozadí celé sekce.
- Nepřidávat tečku na konec H1 a H2, pokud ji význam věty nevyžaduje.
- Animace používat střídmě a pouze tehdy, když pomáhají pochopit změnu stavu.
- Stránky musí být použitelné na počítači, tabletu i telefonu.

## Kontejnery a karty

Nevkládat automaticky každý blok do samostatné zaoblené karty. Vyhnout se dojmu „karta uvnitř karty“ a generickému dashboardovému vzhledu.

Samostatný kontejner použít pouze tehdy, když obsah představuje skutečně samostatnou položku nebo pracovní objekt, například:

- konkrétní výstavu,
- konkrétní přihlášku,
- profil psa,
- dokument,
- ocenění,
- samostatné potvrzení nebo důležitý stav.

Související formulářová pole mají tvořit jednu pracovní plochu. Jednotlivé skupiny oddělovat nadpisem, prostorem nebo linkou, ne dalšími vnořenými kartami.

## Navigace a pracovní plochy

- Navigace musí odpovídat činnostem uživatele, ne technické struktuře webu.
- Po přihlášení musí veřejná navigace nabídnout samostatnou záložku „Můj profil“. Jméno uživatele vpravo slouží jako kompaktní vstup do celé členské zóny, nikoli jako náhrada hlavní navigační záložky.
- Aktivní část a aktuálně vybraný pes nebo výstava musí být vždy zřejmé.
- Seznam souvisejících položek lze zobrazit jako podsekci navigace, pokud tím zůstane hlavní pracovní plocha prostornější.
- Členská zóna nemá obsahovat zbytečné KPI. Upřednostnit psy, dokumenty, přihlášky, výstavy a profil.
- Administrace může obsahovat provozní souhrny pouze tam, kde pomáhají pořadateli řídit konkrétní výstavu.

## Formuláře a tlačítka

- Formuláře musí být přehledné, logicky seskupené a dostatečně prostorné.
- Povinná pole, chyby a očekávaný formát musí být jasně vysvětlené.
- Na jedné pracovní ploše má být jedno jasné hlavní tlačítko. Vedlejší akce mají být vizuálně méně výrazné.
- Hlavní tlačítko nemá být bezdůvodně přes celou obrazovku.
- Tlačítko pro dokončení nebo odeslání musí být viditelné bez vnitřního rolování v malém kontejneru.
- Nepoužívat modální okno pro dlouhé pracovní formuláře. Takové formuláře patří do plnohodnotné stránky nebo pracovní sekce.

## Členská zóna

Uživatel musí mít možnost:

- upravit osobní a kontaktní údaje,
- spravovat více psů pod jedním profilem,
- upravit základní údaje, původ, plemeno, rodiče, čip a zápisové číslo psa,
- nahrát průkaz původu a další dokumenty ve formátu PDF, JPG nebo PNG,
- evidovat ocenění, diplomy, posudky a šampionáty,
- vybrat psa při přihlašování na konkrétní výstavu,
- sledovat stav přihlášky, dokumentů, platby a vstupního listu.

Konkrétní pravidla správy psů:

- Kliknutí na již uloženého psa otevře přehled jeho profilu, dokumentů a ocenění. Nezobrazuje automaticky dlouhý editační formulář.
- Kompletní formulář údajů psa se používá při založení nového psa nebo v samostatně vyvolaném režimu úprav.
- Založení psa probíhá v hlavní pracovní ploše, ne v dlouhém modálním okně.
- Fotografie psa je nepovinná.
- Skupina a plemeno se vybírají z dat `plemena-cmku.json`. Plemena musí být dostupná v abecedním, vyhledávatelném seznamu.
- Formulář pro nového psa začíná prázdný. Názvy polí jsou uvnitř pole a při psaní nebo výběru se přesunou do malé horní popisky.
- Seznam psů pod položkou „Moji psi“ je jednoduchý řádkový seznam bez dlaždic a zbytečného vodorovného odsazení.
- Uložený pes se upravuje výhradně přes jasnou akci „Upravit údaje“; běžné kliknutí na psa zůstává v přehledovém režimu.
- Přihláška na výstavu znovu nevyžaduje osobní, kontaktní ani adresní údaje. Ty se převezmou z profilu a uživatel pouze zvolí uloženého psa, zkontroluje podmínky a vybere platbu.
- Každá odeslaná přihláška má vlastní detail se psem, třídou, doklady, stavem platby a vstupního listu.

## Administrace pořadatele

Pořadatel musí mít možnost:

- zobrazit seznam minulých a budoucích výstav,
- otevřít detail konkrétní výstavy,
- vytvořit výstavu jako samostatný pracovní formulář,
- nastavit termíny, kapacitu, ceny, plemena a výstavní třídy,
- kontrolovat přihlášky a dokumenty,
- sledovat a upravovat platby a rozpočet,
- připravit propozice a exportovat je do PDF.

Přihlášky nejsou samostatná hlavní položka administrace. Otevírají se bezprostředně pod řádkem konkrétní vybrané výstavy, ne až na konci celého seznamu, aby bylo vždy jasné, ke které akci seznam a jeho stavy patří.

Detail konkrétní výstavy obsahuje pod provozním souhrnem také počet vystavovatelů a seznam posledních přihlášek se psem, třídou, doklady a stavem platby. Pořadatel kvůli základní kontrole přihlášených nepřechází na jinou stránku.

Při vytváření výstavy se plemena vybírají jednotlivým kliknutím bez kláves Cmd/Ctrl nebo Shift. Vybraná plemena jsou vždy vidět v samostatném seznamu pod katalogem. Každé vybrané plemeno má vlastní nastavení povolených tříd; při přidání jsou automaticky povolené všechny třídy.

V prototypu může být QR platba pouze názorná demo ukázka. Musí být zřetelně označená jako neplatná, nesmí používat skutečné platební údaje a nesmí předstírat dokončené bankovní napojení.

## Právní a komunikační pravidla

- Nezaměňovat přijetí podmínek se souhlasem se zpracováním osobních údajů.
- Nezbytné zpracování údajů pro účet a přihlášky popsat jako součást poskytování služby.
- Newsletter a marketingová sdělení musí mít samostatný, dobrovolný a předem nezaškrtnutý souhlas.
- Provozní e-maily, potvrzení, platby, změny přihlášky a vstupní listy jasně odlišit od newsletteru.
- U právních textů neprohlašovat bez ověření, že je řešení definitivně právně správné. Pro ostrý provoz doporučit kontrolu českým právníkem.
- Ochrana osobních údajů, podmínky používání, informace o newsletteru a kontakt jsou samostatné informační stránky. Neotevírat je v modálním okně.

## Implementace a kontrola

- Zachovat existující funkční chování a vizuální jazyk, pokud uživatel výslovně nežádá změnu.
- Nepřidávat spekulativní funkce, KPI nebo obsah mimo popsaný produkt.
- Interaktivní prvky musí skutečně fungovat alespoň v rozsahu prototypu.
- Po každé změně zkontrolovat syntaxi, duplicitní identifikátory, vazby formulářů a responzivní pravidla.
- U statického prototypu otevřeně uvést, které akce se neukládají trvale a budou v produkci vyžadovat backend, databázi nebo úložiště souborů.

Pro demo tohoto statického prototypu se člen přihlásí libovolným neprázdným e-mailem a heslem. Pokud přihlášení vyvolal tlačítkem „Přihlásit psa“, po přihlášení se automaticky vrátí k vybrané výstavě a otevře se výběr uloženého psa. Pořadatelská administrace má oddělený demo vstup s heslem `123456`; jde pouze o prototypové omezení a v ostrém provozu musí být nahrazené skutečnou serverovou autentizací a autorizací.

Přihlášení člena se v prototypu drží jen v paměti aktuálně načtené stránky. Při pohybu mezi veřejným webem a členskou zónou se v navigaci i hero sekci zobrazuje jméno „Petr Novák“, ale úplné obnovení stránky stav přihlášení zruší. Pro tento požadavek nepoužívat `localStorage` ani `sessionStorage`.

## Rozhodovací pravidlo

Když existuje více návrhových možností, zvolit tu, která je pro vystavovatele nebo pořadatele nejčitelnější, nejrychlejší a nejméně zatížená zbytečnými kontejnery či dekoracemi.
