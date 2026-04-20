import { createContext, useContext, useEffect, useState } from "react";

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

const STORAGE_KEY = "finance_transactions";
const BUDGET_KEY = "finance_budget";

const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  let parsed;
  if (dateStr instanceof Date) {
    parsed = dateStr;
  } else {
    parsed = new Date(dateStr);
  }
  if (!isNaN(parsed)) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let data = stored ? JSON.parse(stored) : [];
    // Normalize dates on initial load
    return data.map(t => ({
      ...t,
      date: normalizeDate(t.date)
    }));
  });

  const [budget, setBudget] = useState(() => {
    const stored = localStorage.getItem(BUDGET_KEY);
    return stored ? JSON.parse(stored) : { monthly: 50000, currency: "INR" };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  }, [budget]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const updateTransaction = (id, updated) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...updated, id } : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budget,
        setBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}