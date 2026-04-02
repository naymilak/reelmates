# ReelMates — project specification

*Slovenian version:* [PROJEKT.md](./PROJEKT.md)

---

## Purpose

A web application for tracking films. A registered user searches via **TMDB**, adds titles to a **watchlist** or marks them as **watched** with a rating from **1 to 10**. Each user has a public **@handle**; others can find them and see **watched** titles and ratings on a public profile, not the watchlist. The user’s own profile shows three counts: watched, rated, and watchlist size. The **user interface is in English**.

---

## Functional requirements

- **Account:** sign-up, sign-in, sign-out; email and password; authentication with **session**.
- **Handle:** unique public **@handle**; user search; public profile at **`/u/{handle}`**.
- **Titles:** search with type-ahead suggestions (**debounce**); detail view; data from TMDB.
- **Watchlist:** add and remove; no rating.
- **Watched:** from watchlist to watched; rating 1–10; **edit rating**.
- **Flows into watched:** (1) search → add to watched → rating form; (2) title on watchlist → mark watched → rating form → move to watched list.
- **Public profile:** always public; for other users, watched titles with ratings only.

---

## External API (TMDB)

The API key is stored **only on the server**; The database stores only data required for the app, per TMDB terms of use.

---

## Technology and architecture

- **Frontend:** React (Vite), TypeScript.
- **Backend:** Node.js (Express), REST API.
- **Database:** PostgreSQL.

---

## Security and quality

- Passwords stored using a suitable hash; input validation; CORS configured for the frontend.
- On TMDB failure, the user sees a clear message.

---
