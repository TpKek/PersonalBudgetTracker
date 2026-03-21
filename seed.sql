-- Seed Data for Personal Budget Tracker

-- Insert 3 Users
INSERT INTO users (name, email) VALUES
  ('John Smith', 'john.smith@email.com'),
  ('Sarah Johnson', 'sarah.j@email.com'),
  ('Mike Brown', 'mike.brown@email.com');

-- Insert 12-15 Realistic Transactions per User (amounts in cents)

-- John Smith's transactions (12 transactions)
INSERT INTO Transactions (amount_cents, type, category, description, user_id) VALUES
  (450000, 'income', 'salary', 'Monthly salary - January', 1),
  (450000, 'income', 'salary', 'Monthly salary - February', 1),
  (12500, 'expense', 'food', 'Grocery shopping at Woolworths', 1),
  (8900, 'expense', 'food', 'Food delivery - Uber Eats', 1),
  (15200, 'expense', 'food', 'Restaurant dinner', 1),
  (8500, 'expense', 'transport', 'Uber rides for the week', 1),
  (4500, 'expense', 'transport', 'Car wash', 1),
  (15000, 'expense', 'entertainment', 'Movie tickets and dinner date', 1),
  (6500, 'expense', 'entertainment', 'Netflix subscription', 1),
  (3200, 'expense', 'other', 'Monthly phone bill', 1),
  (25000, 'expense', 'other', 'Medical checkup', 1),
  (12000, 'expense', 'other', 'Home insurance', 1);

-- Sarah Johnson's transactions (13 transactions)
INSERT INTO Transactions (amount_cents, type, category, description, user_id) VALUES
  (520000, 'income', 'salary', 'Monthly salary - January', 2),
  (520000, 'income', 'salary', 'Monthly salary - February', 2),
  (15000, 'income', 'other', 'Freelance project payment', 2),
  (23000, 'expense', 'food', 'Weekly groceries - Pick n Pay', 2),
  (18500, 'expense', 'food', 'Restaurant lunches - work week', 2),
  (9500, 'expense', 'food', 'Coffee and snacks', 2),
  (12000, 'expense', 'transport', 'Car fuel and toll fees', 2),
  (5500, 'expense', 'transport', 'Parking fees', 2),
  (4500, 'expense', 'other', 'Internet subscription', 2),
  (18000, 'expense', 'entertainment', 'Concert tickets', 2),
  (8500, 'expense', 'entertainment', 'Spotify and Disney+', 2),
  (32000, 'expense', 'other', 'Gym membership', 2),
  (15000, 'expense', 'other', 'Beauty salon', 2);

-- Mike Brown's transactions (12 transactions)
INSERT INTO Transactions (amount_cents, type, category, description, user_id) VALUES
  (380000, 'income', 'salary', 'Monthly salary - January', 3),
  (380000, 'income', 'salary', 'Monthly salary - February', 3),
  (25000, 'income', 'other', 'Side gig payment', 3),
  (8900, 'expense', 'food', 'Food delivery - Uber Eats', 3),
  (14500, 'expense', 'food', 'Grocery shopping', 3),
  (7200, 'expense', 'food', 'Fast food meals', 3),
  (5500, 'expense', 'transport', 'Bus pass - January', 3),
  (3800, 'expense', 'transport', 'Taxi rides', 3),
  (25000, 'expense', 'other', 'Rent payment', 3),
  (6500, 'expense', 'entertainment', 'Streaming subscriptions', 3),
  (4200, 'expense', 'other', 'Phone bill', 3),
  (9500, 'expense', 'entertainment', 'Gaming purchases', 3);
