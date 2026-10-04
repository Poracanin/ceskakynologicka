# Česká kynologická

Statický prototyp klubového webu a výstavní agendy v černo-zlatém vizuálním stylu.

## Spuštění

V kořenové složce spusťte `python3 -m http.server 4173` a otevřete `http://localhost:4173`.

## Struktura webu

- Úvod: menší animovaný znak a nápis Česká kynologická uprostřed černého, jemně texturovaného pozadí. Po 2,4 sekundách se automaticky zobrazí hero s fotografií z výstavy, přihlašovacím formulářem a odkazem na registraci; bez tlačítka pro pokračování. Klávesa Escape úvod přeskočí. Při omezení animací v systému se úvodní prodleva vynechá.
- `#klub`: veřejná klubová část, článek a kontakt.
- `#vystava-exterieru-psu`: článek z dodaného Wordu, rozdělený do šesti témat. Zachovává autorský pohled; upraveny jsou nadpisy, členění a zjevné překlepy.
- `#kalendar`: veřejný přehled ukázkových výstav. Bez přihlášení nemají jednotlivé výstavy aktivní detail ani přihlášku. Filtrování podle krajů bylo odstraněno; hledání podle názvu a místa doplňují standardní filtry typu a termínu. Výstavy jsou v kompaktním řádkovém seznamu.
- `#vystavy`: výstavní část s vyhledáváním, filtrem typu a akcemi přímo u každé výstavy. Nepřihlášenému návštěvníkovi se zobrazí přihlášení, přihlášenému členská zóna.
- `#prihlaseni` a `#registrace`: samostatné pracovní stránky. Po přihlášení se případný rozpracovaný výběr výstavy obnoví.
- Přihláška psa: samostatná pracovní plocha uvnitř členské zóny, bez dlouhého modálního okna.
- Pořadatelská administrace: samostatný vstup v patičce a mobilní nabídce.

## Zakládání a správa výstav

Administrace má vlastní pracovní plochu na `/#poradatel` (demo heslo `123456`). Navigace obsahuje pouze Výstavy; samostatné sekce Platby a Propozice byly odstraněny. Boční panel je po načtení automaticky skrytý; lze jej otevřít a znovu skrýt tlačítkem v záhlaví. Na telefonu se otevírá jako boční nabídka, kterou zavře křížek, kliknutí mimo panel nebo Escape. Rozpracovaný formulář zůstává zachován. Seznam umožňuje hledat a filtrovat koncepty, zveřejněné, nadcházející a proběhlé výstavy. Přihlášky se rozbalují přímo pod příslušnou výstavou; detail i CSV obsahují pouze její záznamy.

Akce má název, typ, pořadatele, kontakt, město a areál, počáteční a koncové datum, čas zahájení, kapacitu, uzávěrku a cenu. Volitelně lze nastavit cenu dalšího psa téhož vystavovatele. Plemena z katalogu ČMKU se přidávají jednotlivě bez modifikačních kláves, včetně 20 a více plemen. Každé má vlastní povolené třídy. Koncept se ve veřejném ani členském kalendáři neukazuje; po zveřejnění se nastavení používá v detailu i při přihlášení. Uložená výstava se dá znovu upravit.

Přihláška kontroluje povolené plemeno a třídu, uzávěrku, kapacitu a jedinečnost psa v rámci výstavy. Duplicitě brání profil psa, čip i zápisové číslo. Kontrola se opakuje při odeslání. Záznam se objeví členovi i pořadateli a započítá se do kapacity. Cena odeslané přihlášky se při pozdější úpravě ceníku nemění; termín a místo odrážejí aktuální výstavu. Třídy zde odpovídají nastavení pořadatele; prototyp neověřuje oprávnění k pracovní/šampionské třídě ani věkové podmínky jednotlivých tříd.

Pravidla jsou v `event-rules.js`, jejich propojení s rozhraním v `event-management.js`. Ukázkové souhrny vycházejí ze skutečných demo záznamů, nikoli z dekorativních čísel. Výstavy a přihlášky jsou společné jen v právě načtené stránce; jiné záložky ani uživatelé je bez backendu nesdílejí. Při obnovení se všechny změny ztratí. Produkce musí kontrolovat oprávnění, duplicity, cenu, kapacitu i platnost přihlášky na serveru a ukládat data do databáze.

Test pravidel bez dalších závislostí: `node --test tests/event-rules.cjs`.

Kontaktní a právní stránky zůstávají samostatnými HTML soubory. Jejich otevření načte novou stránku; demo přihlášení se tím ukončí.

## Demo a ukládání

Člen se přihlásí libovolným neprázdným e-mailem a heslem. Ukázkový profil používá jméno Petr Novák. Heslo pořadatelské administrace je `123456`.

Přihlášení se drží pouze v paměti načtené stránky, bez `localStorage` a `sessionStorage`. Při přechodech mezi klubem, článkem, veřejným přehledem a členskou zónou zůstává aktivní; obnovení stránky jej zruší.

Registrace, změny profilů, dokumenty, přihlášky a administrace nejsou napojené na trvalou databázi ani souborové úložiště. Prototyp neodesílá e-maily a nezpracovává skutečné platby. Frontendové omezení přístupu je pouze ukázkou chování. Ostrý provoz potřebuje serverovou autentizaci, autorizaci, databázi a úložiště.

## Kontrola

Syntaxe: `node --check app.js`.

Prohlížečový test vyžaduje Playwright a spuštěný lokální server:

```sh
node tests/public-flow.cjs
```

Volitelně lze nastavit `BASE_URL`, `BROWSER_CHANNEL=chrome`, cestu k modulu `PLAYWRIGHT_MODULE` a výstupní složku snímků `SCREENSHOT_DIR`. Test kontroluje veřejný přístup, uzamčení výstav, přihlášení, odhlášení, obnovení stránky, návrat k výstavě, článek, registraci, správu psů, oddělený vstup pořadatele a šířky 320–1440 px.

## Kontaktní formuláře a mapa

Tlačítka na `kontakt.html` otevírají krátké modální formuláře podpory a správce osobních údajů. Typ žádosti předvyplní upravitelný předmět a text; jméno a e-mail návštěvník doplní. Rozpracované formuláře zůstávají pouze v paměti této stránky. Validovaný formulář připraví náhled a odkaz do e-mailové aplikace, nic sám neodesílá ani neukládá na server. Přímé odesílání vyžaduje backend.

Hledání výstav používá společný demo katalog `event-catalog.js`, filtruje název, město i areál bez ohledu na diakritiku a zobrazuje mapu OpenStreetMap s orientačním bodem areálu. Mapa se načítá pouze v otevřeném dialogu; k dispozici je i odkaz na samostatnou mapu. Pořadatelský formulář předvyplní název vybrané výstavy a její kontakt. Kontakty a termíny akcí zůstávají ukázkovými daty. Změny výstav v administraci zůstávají v její aktuální stránce, dokud nebude katalog napojený na společný backend.

Zdroje orientačních poloh: [BVV](https://www.bvv.cz/kontakty), [PVA EXPO](https://pvaexpo.cz/cs/kontakt), [Konopiště](https://konopiste.posazavi.com/cz/turisticke-cile/zamek-konopiste.html), [Výstaviště České Budějovice](https://www.vcb.cz/areal-vystaviste/doprava-a-parkovani), [Černá louka](https://www.cerna-louka.cz/cz/areal/) a [Krásná louka – areál u loděnice](https://vysledky.czechswimming.cz/cz.zma.csps.portal.rest/api/public/competitions/9322/documents/COMPETITION_PLAN?fileName=2025_01_11+-+Mlada_Boleslav_ZP_2024-2025.pdf). [Dokumentace vložené mapy OpenStreetMap](https://wiki.openstreetmap.org/wiki/Export#Embeddable_HTML).
