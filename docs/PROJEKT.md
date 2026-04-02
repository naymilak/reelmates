# ReelMates — kaj sploh delava

## Namen

Spletna app, kjer se folk registrira, išče filme (podatki pridejo iz TMDB), si jih daje na **watchlist** al pa jih označi kot **ogledane** z oceno 1–10. Vsak ima **gametag** — po njem te drugi najdejo in na tvojem javnem profilu vidijo samo **kaj si gledal in kako si ocenil**, ne pa watchlista. Na svojem profilu še tri številke: koliko ogledanih, koliko ocenjenih (pri nas je to praktično isto), koliko jih še čaka na watchlistu.

---

## Specifikacija

**Račun:** email + geslo, JWT al pa seja (se odločiva eno).

**Gametag:** unikaten, javno viden, po njem iskanje uporabnikov. URL tipa `/u/gametag` al podobno.

**Filmi:** iskanje čez TMDB, med tipkanjem naj kaže predloge (autocomplete), ne smeš metat requesta ob vsakem znaku — debounce. Podrobnosti filma tud.

**TMDB:** ključ samo na backendu, ne v React bundle. V bazi drživa toliko podatkov, kolikor rabiva za app (id, naslov, slika …), brez kopiranja cele baze in brez čudnih stvari — pogoji uporabe TMDB so online.

**Watchlist:** dodaj / zbriši, brez ocene.

**Watched:** en film = en zapis na userja, obvezna ocena 1–10. Če si film še enkrat pogledaš, samo **urediš oceno**, ne delava več vnosov za isti film.

**Dva načina v watched:**  
- išči film → dodaj med ogledane → popup za oceno  
- film je na watchlistu → gumb „ogledano“ → popup za oceno → gre v watched

**Javni profil:** vedno javen. Drugi vidijo samo watched + ocene.

**Brez** sistema prijateljev — samo išči po gametag-u.

**Statistika (v1):** tri številke, brez grafov in zgodovine. Če kdaj razširjava: povprečje, žanri, CSV export, whatever.

**Stack:** React (Vite), Node (Express), PostgreSQL. Brez WebSocketov in real-time stvari.

**Admin panel:** ne.

---

## Še malo tehničnega

- Geslo hashat, CORS za frontend, normalna validacija.
- Če TMDB crkne al rate limit: sporočilo uporabniku, po možnosti cache v DB.
- Kasneje: par testov za pomembne API route.

**Arhitektura:** browser → naš API → baza; TMDB kličeva samo s strežnika.

---

## Pojmi (če kdo ne ve)

- **TMDB** — The Movie Database, zunanji API za filme.
- **Watchlist** — „hočem gledat“, skrito pred drugimi.
- **Watched** — gledano + ocena.
- **Gametag** — javno ime za profil.
