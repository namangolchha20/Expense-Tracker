import { useMemo } from "react";
import { motion } from "framer-motion";
import { useFinance } from "../context/FinanceContext";
import { useCurrency } from "../hooks/useCurrency";
import { useBudget } from "../hooks/useBudget";
import { BudgetCard } from "../components/BudgetCard";
import { Charts } from "../components/Charts";

export default function Dashboard() {
  const { transactions, budget } = useFinance();
  const { format, loading: currencyLoading } = useCurrency("INR");
  const { currentSpending, remaining } = useBudget();

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactions]);

  // Even if currency is loading, we show amounts in INR (no wait)
  const fallbackFormat = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Spent</h3>
          <p className="amount expense">
            {currencyLoading
              ? fallbackFormat(totalExpenses)
              : format(totalExpenses, budget.currency)}
          </p>
        </div>
        <div className="card">
          <h3>Remaining Budget</h3>
          <p className={`amount ${remaining >= 0 ? "income" : "expense"}`}>
            {currencyLoading
              ? fallbackFormat(remaining)
              : format(remaining, budget.currency)}
          </p>
        </div>
      </div>
      <BudgetCard />
      <Charts />
    </motion.div>
  );
}