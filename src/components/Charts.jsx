import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { useFinance } from "../context/FinanceContext";
import { useCurrency } from "../hooks/useCurrency";

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export function Charts() {
  const { transactions, budget } = useFinance();
  const { format: formatCurrency, loading } = useCurrency("INR");

  const chartData = useMemo(() => {
    // Pie data: spending by category
    const categoryMap = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount);
      }
    });
    const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    // Monthly trend data (manual grouping by YYYY-MM)
    const monthlyMap = {};
    transactions.forEach((t) => {
      if (t.type === "expense" && t.date) {
        const parts = t.date.split("-");
        if (parts.length === 3) {
          const year = parts[0];
          const month = parts[1];
          const monthKey = `${year}-${month}`;
          if (!monthlyMap[monthKey]) {
            const dateObj = new Date(year, month - 1);
            monthlyMap[monthKey] = {
              month: dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
              amount: 0,
              sortKey: monthKey,
            };
          }
          monthlyMap[monthKey].amount += Math.abs(t.amount);
        }
      }
    });
    const lineData = Object.values(monthlyMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    return { pieData, lineData };
  }, [transactions]);

  const fallbackFormatter = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

  const tooltipFormatter = (value) =>
    loading ? fallbackFormatter(value) : formatCurrency(value, budget.currency);

  const hasData = chartData.pieData.length > 0 || chartData.lineData.length > 0;

  if (!hasData) {
    return <div className="empty-state">No expense data to display</div>;
  }

  return (
    <div className="charts-grid">
      {chartData.pieData.length > 0 && (
        <div className="chart-card">
          <h3>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={tooltipFormatter} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="chart-card">
        <h3>Monthly Spending Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Line type="monotone" dataKey="amount" stroke="#ef4444" name="Expense" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Monthly Expenses (Bar)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Bar dataKey="amount" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}