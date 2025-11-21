# MapWise

> Real-time meetups with shared maps, live ETAs, and a built-in group chat—no logins required.

MapWise is a cross-platform coordination tool for friend groups and teams who need to meet in the real world. One person creates a “room,” picks a destination, and shares a link. Everyone who joins is placed on a shared map with live routing, arrival transparency, and contextual chat so there is never another “I’m five minutes away” mystery.

---

## Feature Highlights

- Live shared map built with MapLibre and Expo—watch every participant move toward the meetup spot in real time.
- Automatic routing + ETA tracking powered by the public OSRM API and Prisma-backed persistence.
- Integrated chat so the logistics conversation stays inside the map view.
- Zero-login join links: anyone with the URL can hop in from web or mobile with a name and location permission.
- Presence-aware rooms: socket-powered status indicators show who’s online and when someone disconnects.

---

## Architecture at a Glance

The repo is organized as a Turborepo monorepo with dedicated apps for every audience and shared packages for types, state, and hooks.

```
apps/web (Next.js) ─┐
apps/mobile (Expo RN) ├─> packages/* (types, hooks, store, eslint, tsconfig)
apps/server (Express + Socket.io + Prisma) ┘

PostgreSQL (rooms, users, messages, routeData JSON)
└─> Socket.io fan-out: room events, location updates, chat stream
```

- **Web (`apps/web`)** – Marketing site + lightweight desktop join/create flow driven by Next.js 15, Tailwind, and interactive hero sections with demo video.
- **Mobile (`apps/mobile`)** – Expo Router app using MapLibre for rendering multi-user polylines, NativeWind for styling, and shared hooks/state for session management.
- **Server (`apps/server`)** – Express API plus Socket.io gateway. Prisma persists rooms, users, live location, and messages in PostgreSQL while route data is cached as JSON blobs.
- **Shared packages** – `@repo/types` (TypeScript contracts for sockets, Prisma DTOs), `@repo/store` (Redux Toolkit slices + providers), `@repo/hooks` (session/socket hooks reused on web + mobile), and tooling packages (`eslint-config`, `typescript-config`).

---

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Expo Router, MapLibre GL, NativeWind.
- **Backend**: Node 20+, Express 5, Socket.io 4, Prisma 6, PostgreSQL, OSRM routing API.
- **Tooling**: Turborepo, pnpm workspaces, TypeScript everywhere, Zod, Redux Toolkit, PM2/Nginx-ready docker assets.

---


### App Overview

![Web experience placeholder](assets/image.png)

![Mobile map placeholder](assets/user.png)

![Chat overlay placeholder](assets/chat.png)

---

## Getting Started Locally

### 1. Prerequisites

- Node 18+ and pnpm 9 (`corepack enable` recommended)
- PostgreSQL instance (Docker works great)
- Expo Go or a dev client for running the mobile app

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create `apps/server/.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mapwise
PORT=4000
```

Run Prisma migrations to set up the schema:

```bash
cd apps/server
pnpm prisma migrate deploy
```

### 4. Start the backend API + socket gateway

```bash
pnpm dev --filter=server
```

The server exposes REST at `http://localhost:4000/api/*` and Socket.io on the same origin.

### 5. Start the marketing web app

```bash
pnpm dev --filter=web
```

Visit `http://localhost:3000` to create/share rooms from the browser.

### 6. Start the Expo app

```bash
pnpm dev --filter=mobile
```

Use the Expo CLI output to open on iOS, Android, or web. The app consumes the same API + sockets; set `EXPO_PUBLIC_API_URL` if you point at a remote backend.

---

## API & Realtime Surface

- `POST /api/room/create-room` – Create a room, persist destination, create the host user, and prefetch OSRM route data.
- `POST /api/room/join/:roomId` – Join an existing room and backfill the route from the user’s position to the destination.
- `GET /api/users/:roomId` – Fetch everyone currently assigned to a room (used for reconnections).
- `GET /api/messages/:roomId` – Room history hydrator for chat transcripts.

Realtime events (Socket.io):

- `joinRoom` / `disconnect` – Track room membership, online status, and last-known position.
- `update-location` → `location-update` – Broadcast latitude/longitude deltas to everyone else.
- `send-message` → `new-message` – Persist chat entries before fan-out to the room.
- `currentUsers`, `current-messages`, `newUser`, `user-disconnected` – Bootstrap payloads the moment a socket connects.

---

Thanks for taking a look! You are share your feedback here :- https://mystery-lnk.vercel.app/u/deepanshu.
