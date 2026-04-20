import { forwardRef } from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiRepeat } from "react-icons/fi";
import { useFinance } from "../context/FinanceContext";
import { useCurrency } from "../hooks/useCurrency";

const formatLocalDate = (dateInput) => {
  if (!dateInput) return "Invalid date";
  
  let dateStr;
  if (dateInput instanceof Date) {
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, '0');
    const day = String(dateInput.getDate()).padStart(2, '0');
    dateStr = `${year}-${month}-${day}`;
  } else {
    dateStr = String(dateInput);
  }
  
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    if (year && month && day) {
      const date = new Date(year, month - 1, day);
      if (!isNaN(date)) {
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }
  }
  
  const parsed = new Date(dateStr);
  if (!isNaN(parsed)) {
    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return "Invalid date";
};

const TransactionCard = forwardRef(({ transaction, onEdit }, ref) => {
  const { deleteTransaction, budget } = useFinance();
  const { format: formatCurrency } = useCurrency("INR");

  const formattedDate = formatLocalDate(transaction.date);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="transaction-item"
    >
      <div className="transaction-info">
        <strong>{transaction.title}</strong>
        <span className="category-badge">{transaction.category}</span>
        <span>{formattedDate}</span>
        {transaction.recurring && <FiRepeat className="recurring-icon" />}
        {transaction.notes && (
          <small style={{ opacity: 0.7 }}>📝 {transaction.notes}</small>
        )}
      </div>
      <div>
        <span className="amount expense">
          - {formatCurrency(Math.abs(transaction.amount), budget.currency)}
        </span>
        <div className="transaction-actions">
          <button className="icon-btn" onClick={() => onEdit(transaction)}>
            <FiEdit2 />
          </button>
          <button className="icon-btn" onClick={() => deleteTransaction(transaction.id)}>
            <FiTrash2 />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export { TransactionCard };