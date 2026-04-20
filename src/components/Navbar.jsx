import { Link } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";
import { ThemeToggle } from "./ThemeToggle";
import { FiHome, FiList, FiPlusCircle, FiPieChart, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";

export function Navbar() {
  const { budget, setBudget } = useFinance();

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="logo">Expense Tracker</div>
      <div className="nav-links">
        <Link to="/dashboard"><FiHome /> Dashboard</Link>
        <Link to="/transactions"><FiList /> Transactions</Link>
        <Link to="/transactions/new"><FiPlusCircle /> Add</Link>
        <Link to="/budget"><FiDollarSign /> Budget</Link>
        <Link to="/analytics"><FiPieChart /> Analytics</Link>
      </div>
      <div className="nav-actions">
        <ThemeToggle />
        <select
          className="currency-selector"
          value={budget.currency}
          onChange={(e) => setBudget({ ...budget, currency: e.target.value })}
        >
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
          <option value="GBP">£ GBP</option>
        </select>
      </div>
    </motion.nav>
  );
}