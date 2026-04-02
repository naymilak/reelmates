# ReelMates

Majhen full-stack projekt: sledenje filmom. Iščeš po TMDB, dodaš na watchlist al med ogledane z oceno, drugi te najdejo po gametag-u in vidijo samo kaj si gledal.

**Stack:** React (Vite) + TypeScript, Node (Express), PostgreSQL.

Več v smislu „kaj točno delava“ je v [**docs/PROJEKT.md**](docs/PROJEKT.md).

---

## Mape

```
frontend/   → UI
backend/    → API
docs/       → opis projekta
```

---

## Kako zaženeš lokalno

Rabiš Node 20+ in npm.

```bash
# API
cd backend
copy .env.example .env   # Windows, potem dopolnit ključe ko bosta
npm run dev

# drug terminal — frontend
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Health check: http://localhost:3001/api/health

---

## Licenca

MIT — glej [LICENSE](LICENSE).
