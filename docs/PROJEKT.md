# ReelMates — specifikacija projekta

*Angleška različica:* [PROJECT.md](./PROJECT.md)

---

## Namen

Spletna aplikacija za sledenje filmom. Registrirani uporabnik išče filme prek **TMDB**, jih dodaja na **watchlist** ali med **ogledane** z oceno **1–10**. Vsak uporabnik ima javni **@handle**; drugi ga poiščejo in na javnem profilu vidijo le **ogledane** filme z ocenami, ne watchlist. Na lastnem profilu so prikazane tri številke: število ogledanih, število ocenjenih in število naslovov na watchlistu. Uporabniški vmesnik je v **angleščini**. Handle se v besedilu vedno zapiše s **`@`**; v URL poti je le identifikator brez **`@`**, npr. **`/u/{handle}`**.

---

## Funkcionalne zahteve

- **Račun:** registracija, prijava, odjava; email in geslo; avtentikacija z **sejo**.
- **Handle:** unikatni javni **@handle**; iskanje uporabnikov; javni profil na poti **`/u/{handle}`**.
- **Filmi:** iskanje in predlogi med tipkanjem (avtomatsko dopolnjevanje, **debounce**); prikaz podrobnosti; podatki iz TMDB.
- **Watchlist:** dodajanje in odstranjevanje; brez ocene.
- **Ogledano:** en zapis na uporabnika in film; obvezna ocena 1–10; možnost **spremembe ocene**.
- **Toka v ogledano:** (1) iskanje → dodaj med ogledane → obrazec za oceno; (2) naslov na watchlistu → oznaka kot ogledano → obrazec za oceno → premik v seznam ogledanih.
- **Javni profil:** vedno javen; za tuje uporabnike samo ogledano z ocenami.

---

## Zunanji vmesnik (TMDB)

API ključ se hrani **izključno na strežniku**; V lastni bazi se shranjujejo le podatki, potrebni za delovanje aplikacije, v skladu s pogoji uporabe TMDB.

---

## Tehnologija in arhitektura

- **Frontend:** React (Vite), TypeScript.
- **Backend:** Node.js (Express), REST API.
- **Podatkovna baza:** PostgreSQL.


---

## Varnost in kakovost

- Gesla se shranjujejo z zgoščevanjem; smiselna validacija vhodov; CORS nastavljen za frontend.
- Ob napaki TMDB uporabnik prejme sporočilo.

---
