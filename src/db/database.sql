-- Create User Table For Tracker
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Transaction Table For Tracker
CREATE TABLE Transactions(
  id SERIAL PRIMARY KEY,
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(255) NOT NULL CHECK (category IN ('food', 'transport', 'entertainment', 'salary', 'other')),
  description VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
