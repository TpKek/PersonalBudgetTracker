import React, {useState} from "react";
import axios from "axios";

function TransactionForm({accessToken, setTransactions}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transaction = {
      description,
      amount_cents: parseFloat(amount) * 100,
      type,
      category
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/transactions",
        transaction,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        }
      );

      setTransactions(prevTransactions => [response.data.data, ...prevTransactions]);
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("");
    } catch (error) {
      console.error("Failed to add transaction:", error);
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
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
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
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  )
}

export default TransactionForm;
