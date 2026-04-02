# ReelMates — sledilnik filmov

[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Kratek opis:** Spletna aplikacija za iskanje filmov (TMDB), osebni **watchlist**, seznam **ogledanih z oceno 1–10**, **osebna statistika** (tri številke) in **javni profil** po **gametag-u**, kjer drugi vidijo le ogledano z ocenami. Full-stack: **React (Vite)**, **Node.js (Express)**, **PostgreSQL**.

---

## Dokumentacija

| Dokument | Vsebina |
|----------|---------|
| [**docs/PROJEKT.md**](docs/PROJEKT.md) | Podroben opis zahtev, arhitekture, TMDB, statistike (tudi odgovor za mentorja), podatkovni model, načrt |

---

## Struktura repozitorija

```
├── frontend/          # React + TypeScript (Vite)
├── backend/           # Express REST API
├── docs/              # Specifikacija in zapisnik
├── .gitignore
├── LICENSE
└── README.md
```

---

## Zagon lokalno

**Zahteve:** Node.js 20+ (priporočeno), npm.

```bash
# terminal 1 — API
cd backend
copy .env.example .env    # Windows; nato uredite vrednosti
npm run dev

# terminal 2 — UI
cd frontend
npm install
npm run dev
```

- Frontend: običajno `http://localhost:5173`
- API health: `GET http://localhost:3001/api/health`

---

## Ekipa

- *(dodajta imeni / gametaga)*
- Repozitorij: *(po ustvaritvi na GitHubu zamenjajta z resnično povezavo)*

---

## Licenca

MIT — glej [LICENSE](LICENSE).
