-- PostgreSQL Queries

SELECT * FROM users;

-- Query for total income and expenses for each user

SELECT
    u.id,
    u.name,
    SUM(CASE WHEN t.type = 'income' THEN t.amount_cents ELSE 0 END) AS total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount_cents ELSE 0 END) AS total_expense
FROM
    users u
LEFT JOIN
    Transactions t ON u.id = t.user_id
GROUP BY
    u.id, u.name;

-- Expenses breakdown per user by category

SELECT
    u.id,
    u.name,
    t.category,
    SUM(t.amount_cents) AS total_expense
FROM
    users u
LEFT JOIN
    Transactions t ON u.id = t.user_id
WHERE
    t.type = 'expense'
GROUP BY
    u.id, u.name, t.category
ORDER BY
    u.id, t.category;

-- Top 5 largest transactions per user

SELECT
    u.id,
    u.name,
    t.id AS transaction_id,
    t.amount_cents,
    t.description,
    t.created_at
FROM
    users u
JOIN
    Transactions t ON u.id = t.user_id
WHERE
    t.type = 'expense'
ORDER BY
    u.id,
    t.amount_cents DESC;

-- Monthly spending total for the last 3 months per user

SELECT
    u.id,
    u.name,
    DATE_TRUNC('month', t.created_at) AS month,
    SUM(t.amount_cents) AS monthly_total
FROM
    users u
JOIN
    Transactions t ON u.id = t.user_id
WHERE
    t.type = 'expense'
    AND t.created_at >= CURRENT_DATE - INTERVAL '3 months'
GROUP BY
    u.id, u.name, DATE_TRUNC('month', t.created_at)
ORDER BY
    u.id,
    month DESC;

-- Full transaction history for a specific user, ordered by date

SELECT
    t.id,
    t.amount_cents,
    t.type,
    t.category,
    t.description,
    t.created_at
FROM
    Transactions t
WHERE
    t.user_id = 1
ORDER BY
    t.created_at DESC;
