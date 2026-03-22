-- -- Create User Table For Tracker
-- CREATE TABLE users(
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name VARCHAR(255) NOT NULL,
--   email VARCHAR(255) NOT NULL UNIQUE,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- -- Create Transaction Table For Tracker
-- CREATE TABLE Transactions(
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
--   type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
--   category VARCHAR(255) NOT NULL CHECK (category IN ('food', 'transport', 'entertainment', 'salary', 'other')),
--   description VARCHAR(255),
--   status VARCHAR(10) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
--   currency CHAR(3) DEFAULT 'ZAR',
--   idempotency_key VARCHAR(100) UNIQUE,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   user_id UUID NOT NULL,
--   FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- -- Add password_hash to users
-- ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '';

-- -- New table for refresh tokens
-- CREATE TABLE refresh_tokens (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   token VARCHAR(500) NOT NULL UNIQUE,
--   user_id UUID NOT NULL REFERENCES users(id),
--   expires_at TIMESTAMPTZ NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- --Adding password_hash to Users

-- ALTER TABLE users ADD COLUMN password_hash VARCHAR(500) NOT NULL DEFAULT '';

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(255) NOT NULL CHECK (category IN ('food', 'transport', 'entertainment', 'salary', 'other')),
  description VARCHAR(255),
  status VARCHAR(10) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  currency CHAR(3) DEFAULT 'ZAR',
  idempotency_key VARCHAR(100) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(500) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
