import { FiSearch } from "react-icons/fi";

const CATEGORIES = ["Food", "Travel", "Rent", "Shopping", "Entertainment", "Health", "Utilities", "Subscriptions"];

export function SearchBar({ filters, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="search-section">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <FiSearch size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or notes..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          className="filter-select"
          value={filters.sortBy}
          onChange={(e) => handleChange("sortBy", e.target.value)}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>
    </div>
  );
}