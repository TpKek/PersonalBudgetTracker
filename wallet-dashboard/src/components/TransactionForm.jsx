import React, {useState} from "react";
import axios from "axios";

function TransactionForm({accessToken, setTransactions}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    const transaction = {
      description,
      amount_cents: Math.round(amountNum * 100),
      type,
      category
    }

    // Generate idempotency key to prevent duplicate transactions
    const idempotencyKey = crypto.randomUUID();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/transactions`,
        transaction,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "Idempotency-Key": idempotencyKey
          }
        }
      );

      setTransactions(prevTransactions => [response.data.data, ...prevTransactions]);
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("");
    } catch {
      // Error handling done via error state
      setError('Failed to add transaction');
    }
  }

  return(
    <div className="transaction-form-container">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError('');
          }}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="entertainment">Entertainment</option>
          <option value="salary">Salary</option>
          <option value="other">Other</option>
        </select>
        {error && <p className="error">{error}</p>}
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  )
}

export default TransactionForm;

