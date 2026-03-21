# Personal Budget Tracker

A simple PostgreSQL-based personal budget tracking application.

## Setup

1. Create the database:
```sql
psql -U your_user -d your_database -f database.sql
```

2. Seed the database with sample data:
```sql
psql -U your_user -d your_database -f seed.sql
```

## Database Schema

- **users** - User accounts
- **Transactions** - Income and expense records

## Categories

- food
- transport
- entertainment
- salary
- other
