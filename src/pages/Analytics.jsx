import { motion } from "framer-motion";
import { Charts } from "../components/Charts";
import { useFinance } from "../context/FinanceContext";
import { useCurrency } from "../hooks/useCurrency";

export default function Analytics() {
  const { transactions, budget } = useFinance();
  const { format: formatCurrency, loading } = useCurrency("INR");

  // Calculate top category
  let topCategory = null;
  if (transactions.length > 0) {
    const catMap = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + Math.abs(t.amount);
    });
    const sorted = Object.entries(catMap).sort((a,b) => b[1] - a[1]);
    if (sorted[0]) topCategory = { name: sorted[0][0], amount: sorted[0][1] };
  }

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass" style={{ padding: 20, marginBottom: 24, textAlign: "center" }}>
        <h2>📈 Spending Insights</h2>
        {topCategory && !loading && (
          <p>
            Your highest spending category is <strong>{topCategory.name}</strong> with{" "}
            {formatCurrency(topCategory.amount, budget.currency)}.
          </p>
        )}
        {loading && <p>Loading currency data...</p>}
      </div>
      <Charts />
    </motion.div>
  );
}