import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTransactions } from "../hooks/useTransactions";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

// Helper to get local date in YYYY-MM-DD
const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Ensure a date string is in YYYY-MM-DD format
const ensureDateFormat = (dateStr) => {
  if (!dateStr) return getLocalDate();
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed)) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return getLocalDate();
};

const schema = yup.object({
  title: yup.string().required("Title is required"),
  amount: yup.number().positive("Amount must be positive").required("Amount required"),
  category: yup.string().required("Select a category"),
  date: yup.date().required("Date required").max(new Date(), "Date cannot be in future"),
  notes: yup.string(),
  recurring: yup.boolean(),
});

const CATEGORIES = ["Food", "Travel", "Rent", "Shopping", "Entertainment", "Health", "Utilities", "Subscriptions"];

export default function AddTransaction() {
  const { createTransaction, editTransaction } = useTransactions();
  const navigate = useNavigate();
  const { state } = useLocation();
  const editTx = state?.editTransaction;

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      recurring: false,
      date: getLocalDate(),
    }
  });

  useEffect(() => {
    if (editTx) {
      setValue("title", editTx.title);
      setValue("amount", Math.abs(editTx.amount));
      setValue("category", editTx.category);
      setValue("date", ensureDateFormat(editTx.date));
      setValue("notes", editTx.notes || "");
      setValue("recurring", editTx.recurring || false);
    }
  }, [editTx, setValue]);

  const onSubmit = (data) => {
    try {
      const transactionData = {
        ...data,
        type: "expense",
        amount: -Math.abs(data.amount),
        // Ensure date is stored as YYYY-MM-DD string
        date: data.date, // already in YYYY-MM-DD from input
      };
      if (editTx) {
        editTransaction(editTx.id, transactionData);
        toast.success("Transaction updated");
      } else {
        createTransaction(transactionData);
        toast.success("Transaction added");
      }
      navigate("/transactions");
    } catch (err) {
      console.error("Error adding transaction:", err);
      toast.error("Failed to add transaction");
    }
  };

  return (
    <div className="container glass" style={{ padding: 24, maxWidth: 600, margin: "auto" }}>
      <h2>{editTx ? "Edit Expense" : "Add New Expense"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Title</label>
          <input {...register("title")} placeholder="e.g., Groceries" />
          {errors.title && <p style={{ color: "#f87171", fontSize: 12 }}>{errors.title.message}</p>}
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input type="number" step="0.01" {...register("amount")} />
          {errors.amount && <p style={{ color: "#f87171", fontSize: 12 }}>{errors.amount.message}</p>}
        </div>

        <div className="form-group">
          <label>Category</label>
          <select {...register("category")}>
            <option value="">Select</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {errors.category && <p style={{ color: "#f87171", fontSize: 12 }}>{errors.category.message}</p>}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" {...register("date")} />
          {errors.date && <p style={{ color: "#f87171", fontSize: 12 }}>{errors.date.message}</p>}
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea {...register("notes")} rows={2} placeholder="Any extra details..." />
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" {...register("recurring")} /> 🔁 Recurring expense (e.g., subscription)
          </label>
        </div>

        <button type="submit">{editTx ? "Update" : "Add"} Expense</button>
        <button type="button" className="secondary" style={{ marginLeft: 12 }} onClick={() => navigate("/transactions")}>Cancel</button>
      </form>
    </div>
  );
}