# MyFuel

Fuel Order Management Mini System for the My Fuels internship assessment. The app includes a user portal for placing and tracking fuel orders and an admin panel for managing order status.

## Demo credentials

Create these accounts once via the Signup screen, or run the seed script to insert them automatically.

- Users (all use the same password)
  - user@myfuel.test
  - aisha@myfuel.test
  - daniel@myfuel.test
  - Password: TestUser123!
- Admin
  - Email: admin@myfuel.test
  - Password: TestAdmin123!
  - Admin code (during signup): MYFUEL_ADMIN_2026

Set `ADMIN_SECRET_CODE=MYFUEL_ADMIN_2026` in the backend `.env` so the admin signup works.

## Features

- User: signup/login, dashboard, place fuel order, order history, order details (status tracking)
- Admin: view orders, update status, search and filter
- Order statuses: Pending, Accepted, Out for Delivery, Delivered
- Role-based access control with JWT

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Zod

## Architecture

- React SPA consumes REST API from the Node/Express server.
- JWT is stored in localStorage and attached to requests via Axios interceptors.
- MongoDB stores users and orders.

## Project structure

```
backend/   Express API, MongoDB models, controllers, services
frontend/  React UI (Vite) with role-based routes and layouts
```

## Prerequisites

- Node.js 18+ (or 20+)
- MongoDB instance (local or Atlas)

## Setup

### 1) Backend

Create `backend/.env`:

```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/myfuel
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
ADMIN_SECRET_CODE=MYFUEL_ADMIN_2026
```

Install and run:

```
cd backend
npm install
npm run dev
```

Optional: seed demo data (clears users and orders first):

```
cd backend
npm run seed
```

Server runs at `http://localhost:3000`.

### 2) Frontend

Optional `frontend/.env` (defaults to `http://localhost:3000`):

```
VITE_API_BASE_URL=http://localhost:3000
```

Install and run:

```
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API documentation

Base URL: `http://localhost:3000`

### Health

- `GET /health`

### Auth

- `POST /api/auth/signup`
  - Body: `{ name, email, password, adminCode? }`
  - Response: `{ token, user }`
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, user }`
- `GET /api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user }`

### User orders (auth required)

- `POST /api/orders`
  - Body: `{ fuelType, quantity, deliveryLocation, preferredDeliveryTime? }`
  - Response: `{ order }`
- `GET /api/orders`
  - Response: `{ orders }`
- `GET /api/orders/:id`
  - Response: `{ order }`

### Admin orders (admin only)

- `GET /api/admin/orders`
  - Query: `status`, `search`, `from`, `to`, `page`, `limit`
  - Response: `{ orders, meta }`
- `GET /api/admin/orders/:id`
  - Response: `{ order }`
- `PATCH /api/admin/orders/:id/status`
  - Body: `{ status }`
  - Status values: `Pending`, `Accepted`, `Out for Delivery`, `Delivered`

## Scripts

- Backend: `npm run dev`, `npm start`, `npm run seed`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Notes

- To create an admin, pass `adminCode` during signup that matches `ADMIN_SECRET_CODE`.
- The frontend uses role-based routes, so admin and user dashboards are separated.
