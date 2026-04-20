import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

const CATEGORIES = ["Food", "Travel", "Rent", "Shopping", "Entertainment", "Health", "Utilities", "Subscriptions"];

export function Filters({ onFilterChange }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const debouncedSearch = useDebounce(search, 300);

  const applyFilters = () => {
    onFilterChange({ search: debouncedSearch, category, type, sortBy });
  };

  return (
    <div className="transaction-filters glass">
      <input
        className="search-input"
        placeholder="🔍 Search title or notes..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); applyFilters(); }}
      />
      <select className="filter-select" value={category} onChange={(e) => { setCategory(e.target.value); applyFilters(); }}>
        <option value="">All Categories</option>
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select>
      <select className="filter-select" value={type} onChange={(e) => { setType(e.target.value); applyFilters(); }}>
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select className="filter-select" value={sortBy} onChange={(e) => { setSortBy(e.target.value); applyFilters(); }}>
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="amount-desc">Highest amount</option>
        <option value="amount-asc">Lowest amount</option>
        <option value="category">By Category</option>
      </select>
    </div>
  );
}