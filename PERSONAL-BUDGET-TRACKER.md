# Personal Budget Tracker

> **For developers:** Check the [Technical README](README.md) for detailed API docs, security implementation details, and troubleshooting.

## What Is This?

A simple app that helps you track money coming in and money going out.

That's it. That's the whole thing.

```
┌─────────────────────────────────────────────────────┐
│                   YOUR MONEY                        │
├─────────────────────────────────────────────────────┤
│  Income (salary, freelance)  ← money comes in     │
│  Expenses (food, transport)   ← money goes out      │
│  Balance                      ← what's left         │
└─────────────────────────────────────────────────────┘
```

---

## Quick Overview

| Part | What It Does |
|------|-------------|
| **Backend** | API that handles data (Node.js + Express) |
| **Database** | Stores your info (PostgreSQL) |
| **Frontend** | The website you see (React + Vite) |

---

## The Tech Stack (In Normal Words)

**Backend:**
- Node.js — runs JavaScript on the server
- Express — makes building APIs easier
- PostgreSQL — a solid database
- JWT — keeps your login secure

**Frontend:**
- React — builds the user interface
- Vite — makes development fast
- Axios — sends requests to the backend

---

## Project Structure

```
PersonalBudgetTracker/
├── src/                          # Backend code
│   ├── app.js                    # Main server file
│   ├── db/
│   │   ├── pool.js               # Database connection
│   │   ├── database.sql          # Creates tables
│   │   └── seed.sql              # Sample data
│   ├── routes/
│   │   ├── auth.js               # Login/register logic
│   │   └── transactions.js       # Money logic
│   └── middleware/
│       └── authenticate.js       # Checks if you're logged in
│
└── wallet-dashboard/             # Frontend code
    ├── src/
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # Entry point
    │   └── components/
    │       ├── Login.jsx         # Login screen
    │       ├── Dashboard.jsx     # Main dashboard
    │       └── TransactionForm.jsx # Add transactions
    └── index.html                # HTML template
```

---

## How The App Works

### 1. You Log In
```
Login Screen → Email + Password → Backend checks → Success/Fail
```

### 2. You See Your Dashboard
```
Backend sends your transactions → Frontend shows them → You see balance
```

### 3. You Add a Transaction
```
Fill form → Submit → Backend saves → Dashboard updates
```

---

## Key Features

###  Secure Login
- Passwords are hashed (scrambled so nobody can read them)
- Two tokens: short-lived access token (15 min) + longer refresh token (7 days)
- If someone steals a token, it expires quickly

###  Money Handling
- Money stored as **cents** (integers), not decimals
- Why? Computers are bad at math like `0.1 + 0.2 = 0.3000000004`
- R150.75 = 15075 cents (no confusion)

###  No Duplicate Charges
- Uses "idempotency keys" — unique IDs for each request
- If you click "submit" twice by accident, only one transaction is created

###  Your Data Is Yours
- Each user only sees their own transactions
- Database queries check: "Does this belong to you?"

---

## API Endpoints

### Auth (Login/Register)

| Method | Endpoint | What It Does |
|--------|----------|--------------|
| POST | `/auth/register` | Create new account |
| POST | `/auth/login` | Sign in |
| POST | `/auth/refresh-token` | Get new access token |
| POST | `/auth/logout` | Sign out |

### Transactions

| Method | Endpoint | What It Does |
|--------|----------|--------------|
| GET | `/transactions` | See all your transactions |
| GET | `/transactions/:id` | See one transaction |
| POST | `/transactions` | Add new transaction |
| PATCH | `/transactions/:id/status` | Update status (pending/completed/failed) |

---

## Database Tables

### Users Table
| Column | What It Is |
|--------|------------|
| id | Unique ID |
| name | Your name |
| email | Your email (must be unique) |
| password_hash | Scrambled password |
| created_at | When you joined |

### Transactions Table
| Column | What It Is |
|--------|------------|
| id | Unique ID |
| amount_cents | Money amount in cents |
| type | `income` or `expense` |
| category | food, transport, entertainment, salary, other |
| description | Optional note |
| status | pending, completed, or failed |
| idempotency_key | Unique key to prevent duplicates |
| user_id | Links to your user account |

### Refresh Tokens Table
| Column | What It Is |
|--------|------------|
| id | Unique ID |
| token | The refresh token string |
| user_id | Links to your user account |
| expires_at | When this token expires |

---

## Setup (Step by Step)

### Prerequisites
- Node.js (version 18 or higher)
- PostgreSQL (version 14 or higher)

### Step 1: Clone the Project
```bash
git clone <repo-url>
cd PersonalBudgetTracker
```

### Step 2: Set Up the Backend

```bash
# Install backend packages
npm install

# Create .env file (copy the example)
cp .env.example .env
```

Edit `.env` with your details:
```
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=budget_tracker
JWT_ACCESS_SECRET=random_string_at_least_64_chars
JWT_REFRESH_SECRET=different_random_string_64_chars
CORS_ORIGIN=http://localhost:5173
PORT=3000
```

### Step 3: Create Database Tables

```bash
psql -U your_username -d budget_tracker -f src/db/database.sql
```

(Optional) Add sample data:
```bash
psql -U your_username -d budget_tracker -f src/db/seed.sql
```

### Step 4: Start the Backend

```bash
npm run dev
```

Should see: `Server running on port 3000`

### Step 5: Set Up the Frontend

```bash
cd wallet-dashboard
npm install
npm run dev
```

Should see: `Local: http://localhost:5173/`

---

## Using The App

### 1. Open the App
Go to `http://localhost:5173` in your browser.

### What You'll See

**Login Screen:**
![Login Page](../screenshots/LoginPage.png)

**After Login (Dashboard):**
![Dashboard](../screenshots/Dashboard.png)

### 2. Register
- Click register (or just log in if you've already registered)
- Enter your name, email, password

### 3. Add Transactions
- Fill in the form:
  - Description (what was it for?)
  - Amount (in Rands, frontend converts to cents)
  - Type (income or expense)
  - Category (food, transport, etc.)

### 4. See Your Balance
- The dashboard shows:
  - Total Income (green)
  - Total Expenses (red)
  - Current Balance (what's left)

---

## Common Problems

### "Database connection failed"
- Check your `.env` file has correct DB credentials
- Make sure PostgreSQL is running
- Check that the database exists

### "Invalid token"
- Your access token expired (lasts 15 minutes)
- Log out and log back in to get new tokens

### "CORS error"
- Backend and frontend running on different ports
- Make sure `CORS_ORIGIN` in .env matches your frontend URL

---

## Security Highlights

This app uses real-world security practices:

1. **Password Hashing** — Passwords are scrambled with bcrypt (10 rounds)
2. **JWT Tokens** — Secure session management
3. **Token Rotation** — Refresh tokens are replaced on use (prevents stolen token abuse)
4. **Parameterised Queries** — No SQL injection possible
5. **BOLA Protection** — Each user only accesses their own data

---

## What's Missing? (Planned Updates)

- [ ] Auto-refresh tokens before they expire
- [ ] Logout button on dashboard
- [ ] Rate limiting (prevents brute force attacks)
- [ ] Tests
- [ ] Docker setup

---

## Credits

Built by **Bertin Dreyer**
- GitHub: @TpKek
- License: MIT
