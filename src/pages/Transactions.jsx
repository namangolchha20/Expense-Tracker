import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFinance } from "../context/FinanceContext";
import { TransactionCard } from "../components/TransactionCard";
import { SearchBar } from "../components/SearchBar";
import { useDebounce } from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
  const { transactions } = useFinance();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sortBy: "date-desc",
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          (t.notes && t.notes.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    switch (filters.sortBy) {
      case "date-asc":
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "date-desc":
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "amount-asc":
        result.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
        break;
      case "amount-desc":
        result.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        break;
      default:
        break;
    }

    return result;
  }, [transactions, debouncedSearch, filters.category, filters.sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleEdit = (transaction) => {
    navigate("/transactions/new", { state: { editTransaction: transaction } });
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SearchBar filters={filters} onFilterChange={handleFilterChange} />

      <div className="transaction-list">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="empty-state"
            >
              💸 No expenses found
              <br />
              <button
                onClick={() => navigate("/transactions/new")}
                style={{ marginTop: "1rem" }}
              >
                + Add your first expense
              </button>
            </motion.div>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onEdit={handleEdit}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}