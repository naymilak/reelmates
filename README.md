<div align="center">

# ReelMates

**Movie tracking web app** — search (TMDB), watchlist, watched titles with ratings, public profiles by gametag.

[![Node.js](https://img.shields.io/badge/node-%3E%3D20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=222)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

Docs: [**EN**](./docs/PROJECT.md) · [**SL**](./docs/PROJEKT.md)

</div>

---

## Quick start

| Service | Command | URL |
|--------|---------|-----|
| API | `cd backend` → copy `.env.example` to `.env` → `npm run dev` | http://localhost:3001 — [`/api/health`](http://localhost:3001/api/health) |
| UI | `cd frontend && npm install && npm run dev` | http://localhost:5173 |

> [!TIP]
> Keep `TMDB_API_KEY` and database credentials **only** in `backend/.env` (never commit `.env`).

```mermaid
flowchart LR
  subgraph client [Client]
    R[React SPA]
  end
  subgraph server [Server]
    E[Express REST]
  end
  R <-->|JSON| E
  E --> DB[(PostgreSQL)]
  E --> TMDB[TMDB API]
```

---

<details>
<summary><strong>🇸🇮 Slovenščina</strong></summary>

**ReelMates** — spletna aplikacija za sledenje filmom: iskanje (TMDB), osebni watchlist, ogledani naslovi z oceno, javni profili po **gametag-u**. Uporabniški vmesnik je v **angleščini**.

Zagon enak kot zgoraj: `backend` (`npm run dev`), `frontend` (`npm install`, `npm run dev`). Specifikacija: [SL](./docs/PROJEKT.md) / [EN](./docs/PROJECT.md).

</details>

---

MIT License — see [LICENSE](LICENSE).
