from pathlib import Path

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path("/Users/farisporacanin/Desktop/Weby a aplikace/ceskakynologicka")
SCREENS = ROOT / "tmp/pdfs/screens"
OUTPUT = ROOT / "output/pdf/manual-ceska-kynologicka-prvni-navrh.pdf"

PAGE_W, PAGE_H = landscape(A4)
BLACK = HexColor("#070707")
PANEL = HexColor("#11110F")
PANEL_2 = HexColor("#17150F")
GOLD = HexColor("#D4AF37")
GOLD_LIGHT = HexColor("#F2C94C")
WHITE = HexColor("#FFFFFF")
MUTED = HexColor("#A5A39B")
MUTED_DARK = HexColor("#78766F")
LINE = Color(212 / 255, 175 / 255, 55 / 255, alpha=0.28)

pdfmetrics.registerFont(TTFont("Arial", "/System/Library/Fonts/Supplemental/Arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Italic", "/System/Library/Fonts/Supplemental/Arial Italic.ttf"))


def para(c, text, x, y_top, width, size=9, color=MUTED, leading=None, bold=False, max_height=200):
    style = ParagraphStyle(
        name="manual",
        fontName="Arial-Bold" if bold else "Arial",
        fontSize=size,
        leading=leading or size * 1.35,
        textColor=color,
        alignment=TA_LEFT,
        spaceAfter=0,
        splitLongWords=True,
    )
    p = Paragraph(text, style)
    _, h = p.wrap(width, max_height)
    p.drawOn(c, x, y_top - h)
    return h


def rounded_panel(c, x, y, w, h, fill=PANEL, stroke=LINE, radius=12):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(0.8)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)


def footer(c, page_no, section="UŽIVATELSKÝ MANUÁL"):
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(30, 28, PAGE_W - 30, 28)
    c.setFont("Arial-Bold", 6.6)
    c.setFillColor(MUTED_DARK)
    c.drawString(30, 15, f"ČESKÁ KYNOLOGICKÁ  /  {section}")
    c.setFillColor(GOLD_LIGHT)
    c.drawRightString(PAGE_W - 30, 15, f"{page_no:02d}")


def page_header(c, page_no, eyebrow, title, subtitle):
    c.setFillColor(BLACK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(30, PAGE_H - 39, 32, 2, fill=1, stroke=0)
    c.setFont("Arial-Bold", 7.2)
    c.setFillColor(GOLD_LIGHT)
    c.drawString(30, PAGE_H - 27, eyebrow.upper())
    c.setFont("Arial-Bold", 23)
    c.setFillColor(WHITE)
    c.drawString(30, PAGE_H - 66, title)
    para(c, subtitle, 30, PAGE_H - 76, 730, size=8.5, color=MUTED, leading=11)
    footer(c, page_no)


def draw_image(c, path, x, y, w, h):
    rounded_panel(c, x - 3, y - 3, w + 6, h + 6, fill=PANEL, radius=10)
    image = ImageReader(str(path))
    iw, ih = image.getSize()
    scale = min(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx, dy = x + (w - dw) / 2, y + (h - dh) / 2
    c.drawImage(image, dx, dy, width=dw, height=dh, preserveAspectRatio=True, mask="auto")
    return dx, dy, dw, dh


def marker(c, image_box, number, nx, ny):
    x, y, w, h = image_box
    px = x + w * nx
    py = y + h * (1 - ny)
    c.setFillColor(GOLD_LIGHT)
    c.setStrokeColor(BLACK)
    c.setLineWidth(1.2)
    c.circle(px, py, 10, fill=1, stroke=1)
    c.setFillColor(BLACK)
    c.setFont("Arial-Bold", 8.2)
    c.drawCentredString(px, py - 2.8, str(number))


def callout(c, number, title, body, x, y_top, width=178):
    c.setFillColor(GOLD_LIGHT)
    c.circle(x + 9, y_top - 9, 8.5, fill=1, stroke=0)
    c.setFillColor(BLACK)
    c.setFont("Arial-Bold", 7.5)
    c.drawCentredString(x + 9, y_top - 11.4, str(number))
    c.setFillColor(WHITE)
    c.setFont("Arial-Bold", 9.3)
    c.drawString(x + 24, y_top - 6, title)
    h = para(c, body, x + 24, y_top - 12, width - 24, size=7.4, color=MUTED, leading=9.6)
    return max(42, h + 23)


def screenshot_page(c, page_no, eyebrow, title, subtitle, image_name, markers, callouts, note=None):
    page_header(c, page_no, eyebrow, title, subtitle)
    image_box = draw_image(c, SCREENS / image_name, 30, 82, 568, 355)
    for number, nx, ny in markers:
        marker(c, image_box, number, nx, ny)
    rounded_panel(c, 615, 82, PAGE_W - 645, 355, fill=PANEL_2, radius=12)
    c.setFont("Arial-Bold", 7.1)
    c.setFillColor(GOLD_LIGHT)
    c.drawString(631, 416, "CO UDĚLAT")
    y = 395
    for number, title_text, body in callouts:
        y -= callout(c, number, title_text, body, 631, y, PAGE_W - 677)
    if note:
        c.setStrokeColor(LINE)
        c.line(631, 112, PAGE_W - 46, 112)
        para(c, f"<b>Poznámka:</b> {note}", 631, 101, PAGE_W - 677, size=7, color=MUTED, leading=9)
    c.showPage()


def cover(c):
    c.setFillColor(BLACK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(0, 0, 12, PAGE_H, fill=1, stroke=0)
    c.setFont("Arial-Bold", 8)
    c.setFillColor(GOLD_LIGHT)
    c.drawString(46, PAGE_H - 54, "ČESKÁ KYNOLOGICKÁ  /  PRVNÍ NÁVRH")
    c.setFont("Arial-Bold", 34)
    c.setFillColor(WHITE)
    c.drawString(46, PAGE_H - 116, "Uživatelský manuál")
    c.setFont("Arial-Bold", 20)
    c.setFillColor(GOLD_LIGHT)
    c.drawString(46, PAGE_H - 148, "webu a administračního systému")
    para(
        c,
        "Průvodce veřejnou částí, členskou zónou vystavovatele a administrací pořadatele výstav.",
        46,
        PAGE_H - 177,
        330,
        size=10.5,
        color=MUTED,
        leading=15,
    )
    rounded_panel(c, 46, 72, 304, 137, fill=PANEL_2, radius=14)
    c.setFont("Arial-Bold", 7.2)
    c.setFillColor(GOLD_LIGHT)
    c.drawString(66, 181, "OBSAH MANUÁLU")
    items = [
        "Veřejný web a registrace",
        "Členská zóna a profily psů",
        "Přihlášky, profil a souhlasy",
        "Administrace výstav a exporty",
    ]
    y = 157
    for idx, item in enumerate(items, 1):
        c.setFillColor(GOLD)
        c.circle(70, y + 2, 7, fill=1, stroke=0)
        c.setFillColor(BLACK)
        c.setFont("Arial-Bold", 6.6)
        c.drawCentredString(70, y - 0.5, str(idx))
        c.setFillColor(WHITE)
        c.setFont("Arial", 8.5)
        c.drawString(85, y - 1, item)
        y -= 25
    draw_image(c, SCREENS / "01-verejny-web.png", 401, 88, 400, 250)
    c.setFont("Arial-Bold", 7)
    c.setFillColor(MUTED_DARK)
    c.drawString(46, 42, "Verze prototypu: 24. 8. 2026")
    c.setFillColor(GOLD_LIGHT)
    c.drawRightString(PAGE_W - 40, 42, "01")
    c.showPage()


def system_map(c):
    page_header(
        c,
        2,
        "RYCHLÁ ORIENTACE",
        "Jak je systém rozdělený",
        "Tři části mají odlišné role. Veřejný web informuje, členská zóna slouží vystavovatelům a administrace pořadatelům.",
    )
    cards = [
        (
            30,
            "01",
            "Veřejný web",
            "Kalendář výstav, detail akce, přihlášení a vytvoření účtu.",
            ["Výstavy", "Poradenství", "Kontakt", "Přihlásit se"],
        ),
        (
            293,
            "02",
            "Členská zóna",
            "Profily psů, dokumenty, ocenění, přihlášky a osobní údaje.",
            ["Moji psi", "Přihlášky", "Výstavy", "Můj profil"],
        ),
        (
            556,
            "03",
            "Administrace",
            "Výstavy, seznamy přihlášených, platby, rozpočet a propozice.",
            ["Přehled", "Výstavy", "Platby", "Propozice a PDF"],
        ),
    ]
    for x, number, title, copy, items in cards:
        rounded_panel(c, x, 98, 238, 330, fill=PANEL_2, radius=14)
        c.setFillColor(GOLD_LIGHT)
        c.setFont("Arial-Bold", 9)
        c.drawString(x + 20, 397, number)
        c.setFillColor(WHITE)
        c.setFont("Arial-Bold", 18)
        c.drawString(x + 20, 365, title)
        para(c, copy, x + 20, 344, 198, size=8.2, color=MUTED, leading=11)
        c.setStrokeColor(LINE)
        c.line(x + 20, 286, x + 218, 286)
        y = 258
        for item in items:
            c.setFillColor(GOLD)
            c.circle(x + 25, y + 2, 3, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Arial-Bold", 9)
            c.drawString(x + 38, y - 1, item)
            y -= 37
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.4)
    c.line(270, 263, 285, 263)
    c.line(533, 263, 548, 263)
    for x in (285, 548):
        c.line(x - 5, 267, x, 263)
        c.line(x - 5, 259, x, 263)
    c.showPage()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=landscape(A4), pageCompression=1)
    c.setTitle("Uživatelský manuál webu Česká kynologická")
    c.setAuthor("Česká kynologická")
    c.setSubject("První návrh webu - veřejná část, členská zóna a administrace")

    cover(c)
    system_map(c)

    screenshot_page(
        c, 3, "VEŘEJNÁ ČÁST", "Veřejná úvodní stránka",
        "Z úvodní stránky se návštěvník dostane k výstavám, přihlášení i registraci nového účtu.",
        "01-verejny-web.png",
        [(1, .76, .05), (2, .89, .05), (3, .80, .48), (4, .23, .64)],
        [
            (1, "Přihlášení", "Otevře přihlašovací okno členské zóny."),
            (2, "Vytvořit účet", "Přepne hlavní hero sekci na registrační formulář."),
            (3, "Rychlý vstup", "E-mail a heslo umožní vstup do demonstračního účtu."),
            (4, "Kalendář výstav", "Tlačítko posune návštěvníka k nadcházejícím akcím."),
        ],
        "Horní navigace obsahuje také odkaz Pro pořadatele, který vede do oddělené administrace.",
    )

    screenshot_page(
        c, 4, "ČLENSKÁ ZÓNA", "Přihlášení uživatele",
        "Přihlášení je určeno vystavovatelům. Po úspěšném vstupu se otevře jejich osobní pracovní prostředí.",
        "02-prihlaseni.png",
        [(1, .50, .54), (2, .50, .62), (3, .41, .73), (4, .62, .73)],
        [
            (1, "E-mail", "Zadejte e-mail uložený u členského profilu."),
            (2, "Heslo", "Zadejte heslo a pokračujte tlačítkem Přihlásit se."),
            (3, "Vstup do účtu", "Otevře členskou zónu s profily psů a přihláškami."),
            (4, "Registrace", "Pokud účet ještě neexistuje, pokračujte registrací."),
        ],
        "V prototypu lze použít libovolný platný e-mail a demonstrační heslo. Přihlášení zůstává aktivní do obnovení stránky.",
    )

    screenshot_page(
        c, 5, "NOVÝ UŽIVATEL", "Vytvoření vystavovatelského účtu",
        "Údaje se vyplní jednou a následně se automaticky používají v přihláškách na výstavy.",
        "03-registrace.png",
        [(1, .23, .32), (2, .31, .43), (3, .35, .55), (4, .45, .75), (5, .48, .86), (6, .88, .95)],
        [
            (1, "Osobní údaje", "Jméno, příjmení a případné akademické tituly."),
            (2, "Kontakt", "Telefon a e-mail včetně kontrolního zopakování."),
            (3, "Trvalé bydliště", "Adresa, město, PSČ a stát."),
            (4, "Přístup do účtu", "Uživatelské jméno a heslo pro další přihlášení."),
            (5, "Souhlasy", "Povinné podmínky a samostatný dobrovolný newsletter."),
            (6, "Dokončit registraci", "Po kontrole vytvoří profil vystavovatele."),
        ],
        "Povinná pole jsou označená hvězdičkou. Marketingový souhlas není podmínkou registrace.",
    )

    screenshot_page(
        c, 6, "ČLENSKÁ ZÓNA", "Moji psi a detail profilu",
        "Po přihlášení se jako první otevře evidence psů. Každý pes má samostatný profil a vlastní dokumenty.",
        "04-clenska-zona-psi.png",
        [(1, .10, .26), (2, .11, .35), (3, .91, .16), (4, .88, .34), (5, .36, .44)],
        [
            (1, "Hlavní navigace", "Přepíná psy, přihlášky, výstavy a osobní profil."),
            (2, "Seznam psů", "Kliknutím se otevře vybraný uložený pes."),
            (3, "Přidat psa", "Založí nový profil psa podle průkazu původu."),
            (4, "Upravit údaje", "Otevře editaci právě zobrazeného psa."),
            (5, "Dokumenty a ocenění", "Samostatné záložky pro soubory PDF, JPG a PNG."),
        ],
        "Na mobilu se stejná hlavní navigace zobrazuje jako pevná spodní lišta.",
    )

    screenshot_page(
        c, 7, "EVIDENCE PSA", "Přidání nového psa",
        "Profil psa se zakládá jednou. Později stačí při přihlášce pouze vybrat uloženého psa.",
        "05-pridat-psa.png",
        [(1, .10, .39), (2, .91, .16), (3, .28, .57), (4, .63, .81)],
        [
            (1, "Moji psi", "Přehled všech psů patřících k jednomu účtu."),
            (2, "Nový profil", "Tlačítko otevře formulář Přidat psa."),
            (3, "Fotografie", "Volitelně lze nahrát fotografii ve formátu JPG nebo PNG."),
            (4, "Identifikace psa", "Jméno, zápisové číslo, čip, datum narození, pohlaví a plemeno."),
        ],
        "Průkaz původu a další dokumenty lze nahrát při založení psa nebo doplnit později.",
    )

    screenshot_page(
        c, 8, "ČLENSKÁ ZÓNA", "Přihlášky uživatele",
        "Sekce Přihlášky ukazuje každou odeslanou přihlášku, vybraného psa, cenu a aktuální stav.",
        "06-prihlasky-uzivatele.png",
        [(1, .10, .33), (2, .48, .40), (3, .82, .40), (4, .92, .40)],
        [
            (1, "Přihlášky", "Otevře historii a stav všech přihlášení."),
            (2, "Výstava a pes", "Každý řádek spojuje konkrétní akci s vybraným psem."),
            (3, "Stav", "Zaplaceno, čeká na platbu nebo kontrola dokumentů."),
            (4, "Detail / Zaplatit", "Otevře detail přihlášky nebo navazující platbu."),
        ],
        "Detail přihlášky obsahuje časovou osu kontroly dokladů, platby a vydání vstupního listu.",
    )

    screenshot_page(
        c, 9, "ČLENSKÁ ZÓNA", "Můj profil a souhlasy",
        "Vystavovatel zde upravuje kontaktní údaje, bydliště a dobrovolná komunikační nastavení.",
        "07-profil-uzivatele.png",
        [(1, .10, .47), (2, .46, .48), (3, .84, .48), (4, .65, .94)],
        [
            (1, "Můj profil", "Přejde k osobním údajům a nastavení účtu."),
            (2, "Kontaktní údaje", "Změny se použijí v budoucích přihláškách."),
            (3, "E-mailová nastavení", "Provozní zprávy jsou nutné, newsletter je dobrovolný."),
            (4, "Uložit změny", "Potvrdí úpravu profilu vystavovatele."),
        ],
        "Uživatel může také exportovat svoji kopii dat nebo požádat o zrušení účtu.",
    )

    screenshot_page(
        c, 10, "POŘADATEL", "Vstup do administrace",
        "Administrace pořadatele je oddělená od běžné členské zóny vystavovatelů.",
        "08-vstup-administrace.png",
        [(1, .50, .50), (2, .50, .58), (3, .50, .66)],
        [
            (1, "Heslo pořadatele", "V produkční verzi půjde o zabezpečený pořadatelský účet."),
            (2, "Demo heslo", "Pro první návrh použijte heslo 123456."),
            (3, "Vstoupit", "Otevře přehled všech připravovaných i ukončených výstav."),
        ],
        "Vstup otevřete odkazem Pro pořadatele v horní navigaci veřejného webu.",
    )

    screenshot_page(
        c, 11, "ADMINISTRACE", "Přehled výstav pořadatele",
        "Výchozí administrační obrazovka zobrazuje aktivní, připravované i archivované výstavy.",
        "09-admin-prehled.png",
        [(1, .10, .27), (2, .52, .46), (3, .89, .18), (4, .82, .47)],
        [
            (1, "Administrační nabídka", "Přehled, výstavy, platby a propozice."),
            (2, "Otevřít výstavu", "Kliknutím na řádek se zobrazí detail a přihlášení."),
            (3, "Vytvořit výstavu", "Založí novou akci v samostatném formuláři."),
            (4, "Kapacita", "U každé akce je ihned vidět počet přihlášených psů."),
        ],
        "Detail výstavy navazuje přehledem plateb, rozpočtu a seznamem přihlášených.",
    )

    screenshot_page(
        c, 12, "ADMINISTRACE", "Přihlášky u konkrétní výstavy",
        "Seznam přihlášených se otevírá přímo pod vybranou výstavou a lze jej filtrovat nebo exportovat.",
        "10-admin-vystavy-prihlasky.png",
        [(1, .10, .28), (2, .39, .16), (3, .57, .27), (4, .64, .51), (5, .86, .16)],
        [
            (1, "Výstavy", "Otevře správu akcí a jejich přihlášek."),
            (2, "Vybraná výstava", "Nad tabulkou je vždy uvedeno, ke které akci data patří."),
            (3, "Hledání a filtry", "Vyhledávání podle jména, psa, e-mailu nebo platby."),
            (4, "Řádky přihlášek", "Vystavovatel, pes, třída, doklady, cena a stav platby."),
            (5, "Export CSV", "Stáhne seznam pro další organizační práci."),
        ],
        "Šipka na konci řádku otevírá detail konkrétní přihlášky.",
    )

    screenshot_page(
        c, 13, "NOVÁ AKCE", "Vytvoření nové výstavy",
        "Formulář je rozdělený do tří logických kroků. První část obsahuje základní organizační údaje.",
        "11-admin-vytvorit-vystavu.png",
        [(1, .10, .29), (2, .91, .04), (3, .60, .56), (4, .86, .96)],
        [
            (1, "Výstavy", "Aktivní položka administrace, pod kterou se nová akce zakládá."),
            (2, "Nová výstava", "Rychlý vstup do stejného formuláře z horní lišty."),
            (3, "Základní údaje", "Název, typ, pořadatel, termín, areál, e-mail a kapacita."),
            (4, "Uložit koncept", "Uloží rozpracovanou akci, kterou lze později upravit."),
        ],
        "Povinná pole musí být vyplněná před uložením konceptu.",
    )

    screenshot_page(
        c, 14, "NOVÁ AKCE", "Plemena, třídy a poplatky",
        "Druhá část určuje rozsah výstavy. Třetí část nastavuje uzávěrku a registrační poplatky.",
        "12-admin-plemena-tridy.png",
        [(1, .42, .34), (2, .57, .40), (3, .77, .43), (4, .48, .87), (5, .88, .96)],
        [
            (1, "Katalog plemen", "Abecední seznam s vyhledáváním podle názvu."),
            (2, "Přidat plemeno", "Jedním kliknutím se plemeno zařadí do výstavy."),
            (3, "Výstavní třídy", "Pro každé plemeno lze povolit vlastní sadu tříd."),
            (4, "Přihlášky a poplatky", "Uzávěrka, základní cena a cena dalšího psa."),
            (5, "Uložit koncept", "Dokončí založení rozpracované výstavy."),
        ],
        "Nově přidané plemeno má ve výchozím stavu povolené všechny třídy.",
    )

    screenshot_page(
        c, 15, "ADMINISTRACE", "Propozice a export PDF",
        "Pořadatel upraví propozice v jednom formuláři, zkontroluje náhled a následně dokument exportuje.",
        "13-admin-propozice.png",
        [(1, .10, .41), (2, .37, .54), (3, .75, .53), (4, .88, .18), (5, .37, .94)],
        [
            (1, "Propozice a PDF", "Otevře editor dokumentu výstavy."),
            (2, "Editor", "Název, datum, místo a kompletní text propozic."),
            (3, "Živý náhled", "Okamžitě ukazuje výslednou podobu dokumentu."),
            (4, "Exportovat do PDF", "Vytvoří PDF soubor vhodný k rozeslání nebo tisku."),
            (5, "Uložit a publikovat", "Potvrdí aktuální znění propozic na webu."),
        ],
        "Jde o demonstrační prototyp. Finální napojení na databázi, e-maily a platby bude součástí produkčního řešení.",
    )

    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    build()
