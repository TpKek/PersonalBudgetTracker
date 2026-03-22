/**
 * Transaction Form Component
 *
 * Form for adding new income or expense transactions.
 * Includes validation and idempotency key generation to prevent duplicates.
 *
 * @component
 * @example
 * <TransactionForm accessToken={token} setTransactions={setTransactions} />
 */

import React, {useState} from "react";
import axios from "axios";

/**
 * Transaction form component
 *
 * @param {Object} props - Component props
 * @param {string} props.accessToken - JWT access token for authentication
 * @param {Function} props.setTransactions - Callback to update transactions list
 * @returns {JSX.Element} Transaction form
 */
function TransactionForm({accessToken, setTransactions}) {
  // Form fields
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");

  // UI state
  const [error, setError] = useState("");

  /**
   * Handle form submission
   * Validates input, converts amount to cents, generates idempotency key,
   * and sends transaction to API
   *
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Validate category selection
    if (!category) {
      setError('Please select a category');
      return;
    }

    // Prepare transaction data
    // Convert from Rand to cents (multiply by 100)
    const transaction = {
      description,
      amount_cents: Math.round(amountNum * 100),
      type,
      category
    }

    // Generate idempotency key to prevent duplicate transactions
    // This is especially important for network failures during submission
    const idempotencyKey = crypto.randomUUID();

    try {
      // Send transaction to API
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

      // Update transactions list with new transaction
      setTransactions(prevTransactions => [response.data.data, ...prevTransactions]);

      // Reset form fields
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
