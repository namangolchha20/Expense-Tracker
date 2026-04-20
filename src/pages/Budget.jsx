import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { BudgetCard } from "../components/BudgetCard";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Budget() {
  const { budget, setBudget } = useFinance();
  const [monthly, setMonthly] = useState(budget.monthly);

  const handleSave = () => {
    setBudget({ ...budget, monthly });
    toast.success("Budget updated");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
      <div className="glass" style={{ padding: 24, marginBottom: 24 }}>
        <h2>✏️ Set Monthly Budget</h2>
        <div className="form-group">
          <label>Monthly Limit (₹)</label>
          <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} />
        </div>
        <button onClick={handleSave}>Save Budget</button>
      </div>
      <BudgetCard />
    </motion.div>
  );
}