# Next Generation Legal Business Club – web

Nový web klubu [legalbusiness.club](https://legalbusiness.club) – statické HTML, CSS a JavaScript bez sestavování. Stačí nahrát na hosting (nebo zapnout GitHub Pages) a funguje.

## Struktura

```
index.html               úvodní stránka (o klubu, setkání, vedení, reference, Napsali o nás, členství)
sona-rampulova.html      profil – Soňa Rampulová
daniel-vejsada.html      profil – Daniel Vejsada
martina-javorova.html    profil – Martina Javorová
martin-frolik.html       profil – Martin Frolík
css/style.css            společné styly a úvodní animace s logem
js/data.js               obsah: setkání, reference členů, články „Napsali o nás“
js/main.js               interaktivita (animace, filtry, rozklikávání setkání, slider referencí, formulář)
assets/img/              logo, úvodní vizuál, fotky vedení, favicon
```

## Jak upravit obsah

- **Nové setkání:** v `js/data.js` přidejte položku na začátek pole `events` (stejný tvar jako ostatní – `num`, `year`, `date`, `place`, `topic`, `summary`, `guests`, `host`). Filtry podle roku se přepočítají samy. Číslo „11 setkání“ v úvodu upravte v `index.html`.
- **Nový článek do Napsali o nás:** přidejte položku do pole `press` (`type` je `clanek`, `rozhovor`, `podcast` nebo `akce`).
- **Nejbližší setkání** (karta v úvodu) je přímo v `index.html` – hledejte „Nejbližší setkání“.

## Barvy a písmo

- Tmavě modrá `#1E366D`, světle modrá `#7D91C2`
- Nadpisy: Cormorant Garamond, text: Inter (obojí z Google Fonts)

## Co je potřeba dořešit před spuštěním

- **Formulář členství** zatím nic neodesílá, jen ukáže poděkování. Napojte ho na službu typu Formspree nebo na e-mail/CRM (viz komentář v `js/main.js`).
- U Martina Frolíka chybí osobní část bia (v `martin-frolik.html` je označená `[doplnit]`).

## GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → `main` / root. Web pak poběží na `https://michalar333-dot.github.io/Klub-web/`.
