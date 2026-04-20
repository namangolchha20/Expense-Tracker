import { useFinance } from "../context/FinanceContext";
import { v4 as uuidv4 } from "uuid";

// Helper to ensure date is YYYY-MM-DD
const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed)) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // fallback to today
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function useTransactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();

  const createTransaction = (data) => {
    const newTx = {
      id: uuidv4(),
      ...data,
      amount: data.type === "expense" ? -Math.abs(data.amount) : Math.abs(data.amount),
      date: normalizeDate(data.date),
    };
    addTransaction(newTx);
    return newTx;
  };

  const editTransaction = (id, data) => {
    const updated = {
      ...data,
      amount: data.type === "expense" ? -Math.abs(data.amount) : Math.abs(data.amount),
      date: normalizeDate(data.date),
    };
    updateTransaction(id, updated);
  };

  return { transactions, createTransaction, editTransaction, deleteTransaction };
}