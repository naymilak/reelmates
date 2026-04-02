# ReelMates — project specification

*Slovenian version:* [PROJEKT.md](./PROJEKT.md)

---

## Purpose

A web application for tracking films. A registered user searches via **TMDB**, adds titles to a **watchlist** or marks them as **watched** with a rating from **1 to 10**. Each user has a **gametag**; others can find them and see **watched** titles and ratings on a public profile, not the watchlist. The user’s own profile shows three counts: watched, rated (equal to watched because a rating is required), and watchlist size. The **user interface is in English**.

---

## Functional requirements

- **Account:** sign-up, sign-in, sign-out; email and password; authentication with **JWT** or **session** (one approach chosen for the project).
- **Gametag:** unique public handle; user search; public profile (e.g. `/u/{gametag}`).
- **Titles:** search with type-ahead suggestions (**debounce**); detail view; data from TMDB.
- **Watchlist:** add and remove; no rating.
- **Watched:** one row per user and title; mandatory rating 1–10; **edit rating** only (no duplicate watched entries for the same film).
- **Flows into watched:** (1) search → add to watched → rating form; (2) title on watchlist → mark watched → rating form → move to watched list.
- **Public profile:** always public; for others, watched titles with ratings only.
- **No** friends system and **no** administrator role.

---

## External API (TMDB)

The API key is stored **only on the server**; the client must not receive it. TMDB calls should be limited (debounce, error handling, rate awareness). The database stores only data required for the app, per TMDB terms of use.

---

## Technology and architecture

- **Frontend:** React (Vite), TypeScript.
- **Backend:** Node.js (Express), REST API.
- **Database:** PostgreSQL.
- **No** real-time layer (e.g. WebSocket).

The browser talks to the project API only; TMDB is called from the server.

---

## Security and quality

- Passwords stored using a suitable hash; input validation; CORS configured for the frontend.
- On TMDB failure, the user sees a clear message.

---

## Glossary

| Term | Meaning |
|------|---------|
| TMDB | The Movie Database — external source of film metadata. |
| Watchlist | Titles to watch later; not visible on the public profile. |
| Watched | Titles with a rating; one rating per user per title. |
| Gametag | Public handle for search and profile URL. |
