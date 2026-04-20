import { useMemo } from "react";
import { useFinance } from "../context/FinanceContext";

export function useBudget() {
  const { transactions, budget } = useFinance();

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    return transactions
      .filter((t) => {
        if (t.type !== "expense") return false;
        if (!t.date) return false;
        const parts = t.date.split("-");
        if (parts.length !== 3) return false;
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // convert to 0-index
        return year === currentYear && month === currentMonth;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactions]);

  const percentUsed = (currentMonthExpenses / budget.monthly) * 100;
  const remaining = budget.monthly - currentMonthExpenses;

  return {
    monthlyBudget: budget.monthly,
    currentSpending: currentMonthExpenses,
    remaining,
    percentUsed: Math.min(percentUsed, 100),
    isOverBudget: currentMonthExpenses > budget.monthly,
  };
}