import { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from './TransactionForm';

const formatZAR = (amountInCents) => {
  const amountInRand = amountInCents / 100;
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amountInRand);
};

function Dashboard({ user, accessToken }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/transactions', {
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

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount_cents, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount_cents, 0);

  const balance = totalIncome - totalExpenses;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>

      {error && <p className="error">{error}</p>}

      <TransactionForm accessToken={accessToken} setTransactions={setTransactions} />

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
