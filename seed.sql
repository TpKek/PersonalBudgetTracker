-- Seed Data for Personal Budget Tracker

-- Insert 3 Users
INSERT INTO users (name, email) VALUES
  ('John Smith', 'john.smith@email.com'),
  ('Sarah Johnson', 'sarah.j@email.com'),
  ('Mike Brown', 'mike.brown@email.com');

-- Insert 15 Realistic Transactions (amounts in cents)

-- John Smith's transactions (5 transactions)
INSERT INTO Transactions (amount_cents, type, category, description, user_id) VALUES
  (450000, 'income', 'salary', 'Monthly salary - January', 1),
  (12500, 'expense', 'food', 'Grocery shopping at Woolworths', 1),
  (8500, 'expense', 'transport', 'Uber rides for the week', 1),
  (15000, 'expense', 'entertainment', 'Movie tickets and dinner date', 1),
  (3200, 'expense', 'other', 'Monthly phone bill', 1);

-- Sarah Johnson's transactions (5 transactions)
INSERT INTO Transactions (amount_cents, type, category, description, user_id) VALUES
  (520000, 'income', 'salary', 'Monthly salary - January', 2),
  (23000, 'expense', 'food', 'Weekly groceries - Pick n Pay', 2),
  (12000, 'expense', 'transport', 'Car fuel and toll fees', 2),
  (4500, 'expense', 'other', 'Internet subscription', 2),
  (18000, 'expense', 'entertainment', 'Concert tickets', 2);

-- Mike Brown's transactions (5 transactions)
INSERT INTO Transactions (amount_cents, type, category, description, user_id) VALUES
  (380000, 'income', 'salary', 'Monthly salary - January', 3),
  (8900, 'expense', 'food', 'Food delivery - Uber Eats', 3),
  (5500, 'expense', 'transport', 'Bus pass - January', 3),
  (25000, 'expense', 'other', 'Rent payment', 3),
  (6500, 'expense', 'entertainment', 'Streaming subscriptions', 3);
