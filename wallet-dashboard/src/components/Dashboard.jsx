import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user, accessToken }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/transactions', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => setTransactions(res.data.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {transactions.map(t => (
        <div key={t.id}>{t.description}</div>
      ))}
    </div>
  );
}

export default Dashboard
