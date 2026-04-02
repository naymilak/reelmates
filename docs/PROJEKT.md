# ReelMates — podrobna specifikacija projekta

Dokument za poročilo in usklajevanje z mentorjem. Zadnja uskladitev z zapiski ekipe in emailom profesorja.

---

## 1. Namen (ena poved)

Aplikacija omogoča registriranim uporabnikom iskanje filmov prek TMDB, vodenje osebnega watchlista in seznama ogledanih z oceno 1–10, pregled lastne statistike (tri številke) ter ogled javnih profilov drugih uporabnikov po unikatnem gametag-u, kjer so vidni le ogledani filmi in ocene.

---

## 2. Odgovori na poudarke mentorja

### 2.1 Zunanji API (TMDB) — previdnost

**Namembnost:** TMDB uporabljamo izključno za **iskanje in prikaz metapodatkov** filmov (naslov, leto, žanr, opis, plakat, **TMDB ID**), da uporabniku ni treba ročno vnašati vsega.

**Kako in koliko:**

- Klici API **s strežnika** (backend proxy): API ključ **ni** v frontend bundle.
- **Debounce** pri avtomatskem dopolnjevanju iskanja; **ne** klicati API ob vsakem znaku brez omejitve.
- V lastni bazi hranimo **minimalno nujno** za delovanje aplikacije (npr. `tmdb_id`, naslov, leto, pot do slike — skladno s [TMDB Terms of Use](https://www.themoviedb.org/documentation/api/terms-of-use)): za hitrejši prikaz, manj ponavljanja klicev in delovanje, če je API začasno nedosegljiv.
- **Ne** množično kopirati celotne baze, **ne** prodajati podatkov TMDB.

**Sklep za zagovor:** Uporaba je ciljno usmerjena, omejena in skladna z dokumentacijo ponudnika.

### 2.2 Spreminjanje ocen kasneje — smiselnost

Uporabnikova dojemanja filma se lahko spremenijo (ponovni ogled, razdalja od prvega vtisa). **En zapis na film** z možnostjo **uredi oceno** zmanjšuje podvajanje v bazi in je skladno z našim pravilom „brez večkratnega ogledanega zapisa“. Mentorju lahko povesta, da je to zavestna poslovna odločitev za preprost model podatkov in jasen prikaz na profilu.

### 2.3 Statistika — kaj vsebuje in kaj uporabnik pridobi

**V prvi verziji (obvezno):** na osebnem profilu **tri številke**:

1. **Število ogledanih** filmov (vnosi v „watched“).
2. **Število ocenjenih** filmov — pri nas je vsak ogledan obvezno ocenjen, zato je številka **enaka** prvi; prikaz je smiseln zaradi jasne terminologije („koliko filmov sem dejansko ocenil“) in morebitne razširitve v prihodnosti.
3. **Število na watchlistu** (*want to watch*).

**Kaj s tem uporabnik pridobi (za ustni odgovor):**

- **Hiter pregled napredka:** v enem pogledu vidi razmerje med „še hočem gledati“ in „sem že ocenil“ — brez branja dolgih seznamov.
- **Motivacija in načrt:** watchlist ostaja merilo „rezervoarja“ filmov; število ogledanih pokaže, koliko je že „zaključil“ v aplikaciji.
- **Jasnost za druge:** na javnem profilu je fokus na ogledanem; lastna statistika na zasebnem pogledu pomaga uporabniku razumeti lastno uporabo aplikacije.

**Kaj bi lahko statistika vsebovala v prihodnje (COULD / razširitve):**

- Povprečna ocena, razporeditev po žanrih ali letih.
- Časovnica zadnjih ogledov / zadnjih ocen.
- Cilji (npr. „N filmov letos“), preprost izvoz (CSV).

To pokažeta kot **nadgradnje**, ki niso v obsegu prve verzije, razen če ostane čas.

---

## 3. Funkcionalne zahteve

### MUST

| Območje | Zahteva |
|---------|---------|
| Račun | Registracija, prijava, odjava; **email + geslo**; **JWT ali sešnija** (ena strategija). |
| Identiteta | **Unikatni gametag** (javno iskalno ime). |
| Iskanje filmov | TMDB, **predlogi med tipkanjem** (autocomplete + debounce), rezultati in podrobnosti. |
| Watchlist | Dodaj / odstrani; **brez** ocene. |
| Watched | En zapis na uporabnika in film; ocena **1–10**; **uredi oceno**; brez več zapisa za isti film. |
| Toki v watched | (a) Iskanje → dodaj v watched → **popup ocena**. (b) Film na watchlistu → **Watched** → popup ocena → premik v watched. |
| Javni profil | **Vedno javen**; tuji vidijo **samo watched + ocene**, **ne** watchlist. |
| Skupnost | **Brez** prijateljev; **iskanje uporabnikov po gametag-u**; profil npr. `/u/gametag`. |
| Statistika | Tri številke: ogledani, ocenjeni, want to watch (brez grafov/zgodovine v v1). |
| Tehnologija | React, Node.js, relacijska baza (PostgreSQL); **brez** real-time. |
| Admin | **Ne**. |

### SHOULD

- Obravnava napak TMDB (timeout, rate limit); osnovni **cache** v DB.
- Validacija vhodov, hash gesla, varna seja/JWT, CORS.
- **Nekaj API testov** na ključnih poteh (ko bo implementirano).

### COULD

- Filtri iskanja (leto, žanr).
- Feed zadnjih aktivnosti.
- Izvoz statistike.

---

## 4. Nefunkcionalne zahteve

- Varnost: ne izpostavljati TMDB ključa v brskalnik; varna shranitev gesel.
- Zanesljivost: smiselne HTTP napake, ne puščati aplikacije v nedoločenem stanju ob napaki API.
- Uporabnost: razumljiva navigacija, osnovno prilagojen prikaz (responsive).

---

## 5. Arhitektura in način dela

```
Brskalnik (React)
    → REST JSON → Node (Express)
                        → PostgreSQL
                        → TMDB API (samo strežnik)
```

- **Frontend:** Vite + React + TypeScript; klice na lastni backend (`/api/...`).
- **Backend:** Express; avtentikacija; posredovanje / agregacija TMDB; poslovna pravila (watchlist, watched, ocene, profili).
- **Baza:** uporabniki, gametag, povezave na TMDB ID, watchlist, watched + ocena + časovni žig (če ga shranita za morebitno prihodnost; prikaz v v1 ni obvezen).

### Razdelitev (predlog za 2 osebi)

- **Oseba A:** auth, uporabniki, gametag, javni profili, shema baze, migracije.
- **Oseba B:** TMDB integracija, iskanje/UI, watchlist/watched, ocene, statistika na UI.
- **Skupaj:** OpenAPI ali dogovor o endpointih, Git workflow, testi, priprava poročila.

---

## 6. Slovar pojmov

| Pojem | Pomen |
|--------|--------|
| TMDB | The Movie Database — zunanji API za metapodatke filmov. |
| Watchlist | Seznam „hočem gledati“; brez ocene; ni javen. |
| Watched | Ogledani filmi z obvezno oceno 1–10; ena ocena na film na uporabnika. |
| Gametag | Unikatno javno ime za iskanje in URL profila. |
| JWT / seja | Overjanje prijavljenega uporabnika po prijavi. |

---

## 7. Git in poročanje

- Repozitorij: jasna struktura `frontend/` in `backend/`, `docs/` za specifikacijo.
- Priporočilo: **govorilne uri** po napredku (kot je predlagal mentor); v poročilo kratko **changelog** ali **sprint** zapise.

---

*Ta dokument lahko skrajšata v poglavje poročila ali ga priložita kot prilogo.*
