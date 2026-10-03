# Smart Expense Tracker

A full-stack expense tracker with login/signup, logout, and an analytics dashboard
(category breakdown chart, 6-month trend chart, and expense CRUD).

## Tech Stack

- **Backend:** Node.js + Express
- **Auth:** JWT stored in an httpOnly cookie, passwords hashed with bcrypt
- **Database:** Simple JSON file storage (`backend/data/users.json`, `backend/data/expenses.json`) — no external database or native modules required, so it runs anywhere `npm install` works
- **Frontend:** Plain HTML/CSS/JavaScript + Chart.js (loaded from CDN), served as static files by the same Express server

## Folder Structure

```
smart-expense-tracker/
├── backend/
│   ├── server.js            # Express app entry point
│   ├── db.js                # JSON file "database" helper
│   ├── package.json
│   ├── .env                 # PORT + JWT_SECRET (edit before deploying)
│   ├── middleware/
│   │   └── auth.js          # JWT cookie verification middleware
│   ├── routes/
│   │   ├── auth.js          # register / login / logout / me
│   │   ├── expenses.js      # expense CRUD
│   │   └── dashboard.js     # summary stats for charts
│   └── data/                # auto-created JSON "database" files
├── frontend/
│   ├── index.html           # Login / Sign up page
│   ├── dashboard.html       # Protected dashboard page
│   ├── css/style.css
│   └── js/
│       ├── api.js           # shared fetch() wrapper
│       ├── login.js
│       └── dashboard.js
└── README.md
```

## How to Run

1. Open a terminal in the `backend` folder:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Open your browser at **http://localhost:5000**
3. Sign up for a new account, then log in.
4. You'll land on the dashboard — add a few expenses to see the charts populate.
5. Click **Logout** in the top-right to end your session.

The backend also serves the frontend, so you only need **one server** and **one port** — no separate frontend dev server or CORS setup needed.

## API Overview

| Method | Endpoint                    | Description                          | Auth required |
|--------|------------------------------|---------------------------------------|----------------|
| POST   | `/api/auth/register`         | Create an account                     | No             |
| POST   | `/api/auth/login`             | Log in                                | No             |
| POST   | `/api/auth/logout`            | Log out (clears cookie)               | Yes            |
| GET    | `/api/auth/me`                | Get current logged-in user            | Yes            |
| GET    | `/api/expenses`               | List your expenses                    | Yes            |
| POST   | `/api/expenses`               | Add an expense                        | Yes            |
| PUT    | `/api/expenses/:id`           | Update an expense                     | Yes            |
| DELETE | `/api/expenses/:id`           | Delete an expense                     | Yes            |
| GET    | `/api/expenses/meta/categories` | List allowed categories            | Yes            |
| GET    | `/api/dashboard/summary`      | Totals, category & monthly breakdown  | Yes            |

## Notes & Next Steps

- **Change `JWT_SECRET`** in `backend/.env` before deploying anywhere public.
- The JSON file database is great for learning/demo purposes. For a production app,
  swap `db.js` for a real database (PostgreSQL, MySQL, MongoDB) — the routes call
  simple functions like `db.createExpense()`, so only `db.js` would need to change.
- Currency is displayed in ₹ (INR) — change the `rupee()` helper in
  `frontend/js/dashboard.js` if you'd like a different currency symbol/locale.
- Ideas to extend: expense editing UI (the PUT API already exists), CSV export,
  budget limits with alerts, date-range filters, multi-currency support.
   


   How to Run 
   folder inside-backend,frontend,README.
   Click once in that window's address bar, type cmd, press Enter — a terminal opens right there
Type dir and press Enter — confirm backend is listed
Type cd backend and press Enter — this should now work
Type npm install and press Enter
Type npm start and press Enter
Open http://localhost:5000 in your browser