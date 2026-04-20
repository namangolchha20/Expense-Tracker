import { useBudget } from "../hooks/useBudget";
import { useCurrency } from "../hooks/useCurrency";
import { useFinance } from "../context/FinanceContext";

export function BudgetCard() {
  const { currentSpending, monthlyBudget, percentUsed, remaining, isOverBudget } = useBudget();
  const { budget } = useFinance();
  const { format, loading } = useCurrency("INR");

  const fallbackFormat = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  return (
    <div className="budget-container">
      <h3>📆 Monthly Budget</h3>
      <div>Spent: {loading ? fallbackFormat(currentSpending) : format(currentSpending, budget.currency)}</div>
      <div>Budget: {loading ? fallbackFormat(monthlyBudget) : format(monthlyBudget, budget.currency)}</div>
      <div>Remaining: {loading ? fallbackFormat(remaining) : format(remaining, budget.currency)}</div>
      <div className="progress-bar">
        <div
          className={`progress-fill ${isOverBudget ? "over-budget" : ""}`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>
      <p>{percentUsed.toFixed(0)}% used</p>
      {isOverBudget && (
        <p className="danger" style={{ color: "var(--danger)" }}>
          ⚠️ Over budget! Consider reducing expenses.
        </p>
      )}
    </div>
  );
}