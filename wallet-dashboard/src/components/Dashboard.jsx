/**
 * Dashboard Component
 *
 * Main dashboard displaying user's transactions and financial summary.
 * Fetches transactions on mount and calculates balance, income, and expenses.
 *
 * @component
 * @example
 * <Dashboard user={userData} accessToken={token} />
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from './TransactionForm';

/**
 * Formats amount in cents to South African Rand (ZAR)
 *
 * @param {number} amountInCents - Amount in cents
 * @returns {string} Formatted currency string
 *
 * @example
 * formatZAR(15075) // "R150.75"
 */
const formatZAR = (amountInCents) => {
  const amountInRand = amountInCents / 100;
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amountInRand);
};

/**
 * Dashboard component
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - Authenticated user object
 * @param {string} props.accessToken - JWT access token
 * @returns {JSX.Element} Dashboard view
 */
function Dashboard({ user, accessToken }) {
  // State management
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch transactions on component mount
   * Uses access token for authentication
   */
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        setTransactions(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load transactions');
        setLoading(false);
      });
  }, [accessToken]);

  // Calculate totals from transactions
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount_cents, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount_cents, 0);

  const balance = totalIncome - totalExpenses;

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>

      {error && <p className="error">{error}</p>}

      {/* Transaction form for adding new transactions */}
      <TransactionForm accessToken={accessToken} setTransactions={setTransactions} />

      {/* Financial summary cards */}
      <div className="balance-summary">
        <div className="balance-card">
          <h3>Balance</h3>
          <p className="balance-amount">{formatZAR(balance)}</p>
        </div>
        <div className="balance-card">
          <h3>Income</h3>
          <p className="income-amount">{formatZAR(totalIncome)}</p>
        </div>
        <div className="balance-card">
          <h3>Expenses</h3>
          <p className="expense-amount">{formatZAR(totalExpenses)}</p>
        </div>
      </div>

      {/* Transaction history list */}
      <h2>Transactions</h2>
      <div className="transactions-list">
        {transactions.map(t => (
          <div key={t.id} className="transaction-item">
            <span>{t.description}</span>
            <span className={t.type === 'income' ? 'income' : 'expense'}>
              {formatZAR(t.amount_cents)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard
