-- Seed Data for Personal Budget Tracker

-- Insert 3 Users
INSERT INTO users (name, email) VALUES
  ('John Smith', 'john.smith@email.com'),
  ('Sarah Johnson', 'sarah.j@email.com'),
  ('Mike Brown', 'mike.brown@email.com');

-- Insert 12-15 Realistic Transactions per User (amounts in cents)

-- John Smith's transactions (12 transactions)
INSERT INTO Transactions (amount_cents, type, category, description, created_at, user_id) VALUES
  (450000, 'income', 'salary', 'Monthly salary - January', '2026-01-15 09:00:00+02', 1),
  (450000, 'income', 'salary', 'Monthly salary - February', '2026-02-15 09:00:00+02', 1),
  (12500, 'expense', 'food', 'Grocery shopping at Woolworths', '2026-01-18 17:30:00+02', 1),
  (8900, 'expense', 'food', 'Food delivery - Uber Eats', '2026-01-20 19:00:00+02', 1),
  (15200, 'expense', 'food', 'Restaurant dinner', '2026-01-25 20:00:00+02', 1),
  (8500, 'expense', 'transport', 'Uber rides for the week', '2026-01-22 14:00:00+02', 1),
  (4500, 'expense', 'transport', 'Car wash', '2026-01-28 10:00:00+02', 1),
  (15000, 'expense', 'entertainment', 'Movie tickets and dinner date', '2026-02-01 19:30:00+02', 1),
  (6500, 'expense', 'entertainment', 'Netflix subscription', '2026-01-05 12:00:00+02', 1),
  (3200, 'expense', 'other', 'Monthly phone bill', '2026-01-10 08:00:00+02', 1),
  (25000, 'expense', 'other', 'Medical checkup', '2026-02-10 09:30:00+02', 1),
  (12000, 'expense', 'other', 'Home insurance', '2026-01-12 11:00:00+02', 1);

-- Sarah Johnson's transactions (13 transactions)
INSERT INTO Transactions (amount_cents, type, category, description, created_at, user_id) VALUES
  (520000, 'income', 'salary', 'Monthly salary - January', '2026-01-20 08:00:00+02', 2),
  (520000, 'income', 'salary', 'Monthly salary - February', '2026-02-20 08:00:00+02', 2),
  (15000, 'income', 'other', 'Freelance project payment', '2026-01-25 15:00:00+02', 2),
  (23000, 'expense', 'food', 'Weekly groceries - Pick n Pay', '2026-01-17 18:00:00+02', 2),
  (18500, 'expense', 'food', 'Restaurant lunches - work week', '2026-01-21 13:00:00+02', 2),
  (9500, 'expense', 'food', 'Coffee and snacks', '2026-01-19 09:30:00+02', 2),
  (12000, 'expense', 'transport', 'Car fuel and toll fees', '2026-01-23 16:00:00+02', 2),
  (5500, 'expense', 'transport', 'Parking fees', '2026-02-05 09:00:00+02', 2),
  (4500, 'expense', 'other', 'Internet subscription', '2026-01-08 10:00:00+02', 2),
  (18000, 'expense', 'entertainment', 'Concert tickets', '2026-02-14 20:00:00+02', 2),
  (8500, 'expense', 'entertainment', 'Spotify and Disney+', '2026-01-03 14:00:00+02', 2),
  (32000, 'expense', 'other', 'Gym membership', '2026-01-06 07:00:00+02', 2),
  (15000, 'expense', 'other', 'Beauty salon', '2026-02-08 11:00:00+02', 2);

-- Mike Brown's transactions (12 transactions)
INSERT INTO Transactions (amount_cents, type, category, description, created_at, user_id) VALUES
  (380000, 'income', 'salary', 'Monthly salary - January', '2026-01-25 09:00:00+02', 3),
  (380000, 'income', 'salary', 'Monthly salary - February', '2026-02-25 09:00:00+02', 3),
  (25000, 'income', 'other', 'Side gig payment', '2026-02-18 17:00:00+02', 3),
  (8900, 'expense', 'food', 'Food delivery - Uber Eats', '2026-01-19 20:00:00+02', 3),
  (14500, 'expense', 'food', 'Grocery shopping', '2026-01-22 16:00:00+02', 3),
  (7200, 'expense', 'food', 'Fast food meals', '2026-01-27 13:00:00+02', 3),
  (5500, 'expense', 'transport', 'Bus pass - January', '2026-01-02 08:00:00+02', 3),
  (3800, 'expense', 'transport', 'Taxi rides', '2026-02-10 18:00:00+02', 3),
  (25000, 'expense', 'other', 'Rent payment', '2026-01-01 09:00:00+02', 3),
  (6500, 'expense', 'entertainment', 'Streaming subscriptions', '2026-01-04 15:00:00+02', 3),
  (4200, 'expense', 'other', 'Phone bill', '2026-01-15 10:00:00+02', 3),
  (9500, 'expense', 'entertainment', 'Gaming purchases', '2026-02-12 19:00:00+02', 3);

-- Seed Transactions for user_id 8 (January & February 2026)

INSERT INTO Transactions (amount_cents, type, category, description, created_at, user_id) VALUES
  -- January 2026 Transactions
  (485000, 'income', 'salary', 'Monthly salary - January 2026', '2026-01-25 09:00:00+02', 8),
  (18500, 'expense', 'food', 'Weekly groceries - Pick n Pay', '2026-01-08 17:30:00+02', 8),
  (9200, 'expense', 'food', 'Uber Eats delivery', '2026-01-10 19:00:00+02', 8),
  (14500, 'expense', 'food', 'Restaurant dinner - Ocean Basket', '2026-01-18 20:00:00+02', 8),
  (6800, 'expense', 'transport', 'Fuel - Engen garage', '2026-01-12 14:00:00+02', 8),
  (4500, 'expense', 'transport', 'Gautrain ticket to Sandton', '2026-01-15 07:30:00+02', 8),
  (12500, 'expense', 'entertainment', 'Cinema outing - Nu Metro', '2026-01-24 18:00:00+02', 8),
  (5500, 'expense', 'entertainment', 'Netflix subscription', '2026-01-02 10:00:00+02', 8),
  (3500, 'expense', 'other', 'MTN airtime', '2026-01-05 09:00:00+02', 8),
  (22000, 'expense', 'other', 'Medical aid contribution', '2026-01-07 08:00:00+02', 8),

  -- February 2026 Transactions
  (485000, 'income', 'salary', 'Monthly salary - February 2026', '2026-02-25 09:00:00+02', 8),
  (15000, 'income', 'other', 'Freelance side project payment', '2026-02-14 16:00:00+02', 8),
  (21000, 'expense', 'food', 'Monthly grocery run - Woolworths', '2026-02-01 16:00:00+02', 8),
  (7800, 'expense', 'transport', 'Uber rides - work week', '2026-02-10 08:00:00+02', 8),
  (9500, 'expense', 'entertainment', 'DSTV subscription', '2026-02-03 11:00:00+02', 8);
