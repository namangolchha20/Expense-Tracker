# Expense Tracker

A modern, feature-rich expense tracking application built with React. Track your spending, set monthly budgets, visualise expenses with interactive charts, and convert amounts to multiple currencies using live exchange rates.

## ✨ Features

- **Add / Edit / Delete Expenses** – with title, amount, category, date, notes, and recurring flag.
- **Transaction List** – search by title/notes, filter by category, sort by date or amount.
- **Budget Tracking** – set a monthly budget; view spent, remaining, and a progress bar.
- **Dashboard** – at-a-glance view of total spent, remaining budget, and spending charts.
- **Analytics** – pie chart of spending by category, line/bar charts of monthly expense trends.
- **Live Currency Conversion** – switch between INR, USD, EUR, GBP using the ExchangeRate API.
- **Light / Dark Theme** – toggle between light and dark mode with CSS variables.
- **Responsive Design** – works seamlessly on desktop, tablet, and mobile.
- **Local Storage Persistence** – all transactions and budget settings are saved locally.

## 🛠️ Tech Stack

- **React 18** – UI library
- **React Router DOM** – client-side routing
- **Context API** – global state management
- **Custom Hooks** – reusable business logic (useBudget, useCurrency, useTransactions, useDebounce)
- **React Hook Form + Yup** – form handling and validation
- **Recharts** – data visualisation (pie, line, bar charts)
- **Framer Motion** – smooth animations
- **date-fns** – date manipulation
- **Axios** – API calls for exchange rates
- **React Toastify** – toast notifications
- **React Icons** – icon library

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (or download the source)
   git clone <your-repo-url>
   cd expense-tracker

2. **Install dependencies**
   npm install

3. **Start the development server**
   npm run dev

4. Open your browser and navigate to http://localhost:5173

## 🧪 Usage

### Adding an Expense
1. Click **Add** in the navigation bar.
2. Fill in the title, amount, category, date (defaults to today), and optional notes.
3. Check "Recurring expense" if applicable (e.g., subscriptions).
4. Click **Add Expense** – you'll be redirected to the transactions list.

### Editing / Deleting
- On the Transactions page, each expense card has **Edit** (✏️) and **Delete** (🗑️) buttons.
- Editing pre‑fills the form with existing data.

### Budget Tracking
- Go to the **Budget** page to set your monthly budget.
- The Dashboard shows your progress with a visual bar and remaining amount.

### Currency Conversion
- Use the dropdown in the navbar to switch between INR, USD, EUR, GBP.
- All amounts (dashboard, budget card, transactions, charts) will convert using live exchange rates.

### Theme Toggle
- Click the **Light / Dark** button in the navbar to switch themes.

## 🔄 API Integration

The app uses the free ExchangeRate API (https://www.exchangerate-api.com/) to fetch live exchange rates. Rates are cached globally and in localStorage for 24 hours to minimise API calls. If the API fails, the app falls back to INR (no conversion) – it never breaks.

## 📦 Building for Production

npm run build

The build output will be in the `dist` folder. You can deploy it to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## 🧠 Key Concepts Demonstrated

- **React Context API** – global state management without Redux.
- **Custom Hooks** – extracting and reusing stateful logic (useBudget, useCurrency, etc.).
- **Memoisation** – using useMemo to prevent expensive recalculations.
- **Debouncing** – optimised search input.
- **Form Validation** – with react-hook-form and yup.
- **Animation** – with framer-motion (list transitions, page fades).
- **Responsive CSS** – CSS Grid, Flexbox, media queries.

## 🤝 Acknowledgements

- Exchange rates provided by ExchangeRate API
- Icons from React Icons
- Charts by Recharts
- Animations by Framer Motion

## 📄 License

This project is open source and available under the MIT License.

---

Made with 💸 for the React Developer Viva.