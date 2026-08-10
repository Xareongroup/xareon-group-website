"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import MobileRecordCard from "@/components/admin/MobileRecordCard";
import type { ExpenseFormValues } from "@/types/financial";
import ExpenseReceiptButton from "@/components/admin/financials/ExpenseReceiptButton";

type View =
  | "dashboard"
  | "expenses"
  | "categories"
  | "vendors"
  | "reports"
  | "expense-form"
  | "expense-detail";
type Expense = Tables<"expenses"> & {
  category?: Pick<Tables<"expense_categories">, "name" | "group_name"> | null;
  vendor?: Pick<Tables<"vendors">, "name"> | null;
  job?: Pick<Tables<"jobs">, "job_number" | "title"> | null;
};
type Category = Tables<"expense_categories"> & {
  company?: string | null;
  email?: string | null;
  phone?: string | null;
};
type Vendor = Tables<"vendors"> & { group_name?: string };
type Invoice = Pick<
  Tables<"invoices">,
  | "id"
  | "total"
  | "amount_paid"
  | "balance_due"
  | "status"
  | "issue_date"
  | "job_id"
>;
type Job = Pick<
  Tables<"jobs">,
  "id" | "job_number" | "title" | "status" | "scheduled_date" | "completed_date"
>;
type Customer = Pick<Tables<"customers">, "id" | "first_name" | "last_name" | "email">;
type Employee = Pick<Tables<"employees">, "id" | "first_name" | "last_name" | "role">;
const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value || 0,
  );
const initialExpense: ExpenseFormValues = {
  date: new Date().toISOString().slice(0, 10),
  category_id: "",
  vendor_id: "",
  customer_id: "",
  job_id: "",
  employee_id: "",
  description: "",
  amount: "",
  payment_method: "Cash",
  status: "Paid",
  receipt_url: "",
  notes: "",
};

export default function FinancialsClient({
  view,
  expenseId,
}: {
  view: View;
  expenseId?: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(initialExpense);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [period, setPeriod] = useState("monthly");
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    group_name: "Other",
  });
  const [vendorForm, setVendorForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    category: "",
    notes: "",
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<{
    type: "expense" | "vendor" | "category";
    id: string;
    name: string;
  } | null>(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [
      expenseResult,
      categoryResult,
      vendorResult,
      jobResult,
      invoiceResult,
      customerResult,
      employeeResult,
    ] = await Promise.all([
      supabase
        .from("expenses")
        .select(
          "*, category:expense_categories(name,group_name), vendor:vendors(name), job:jobs(job_number,title)",
        )
        .order("date", { ascending: false }),
      supabase
        .from("expense_categories")
        .select("*")
        .order("group_name")
        .order("name"),
      supabase.from("vendors").select("*").order("name"),
      supabase
        .from("jobs")
        .select("id,job_number,title,status,scheduled_date,completed_date")
        .order("created_at", { ascending: false }),
      supabase
        .from("invoices")
        .select("id,total,amount_paid,balance_due,status,issue_date,job_id"),
      supabase.from("customers").select("id,first_name,last_name,email").order("first_name"),
      supabase.from("employees").select("id,first_name,last_name,role").order("first_name"),
    ]);
    const firstError = [
      expenseResult.error,
      categoryResult.error,
      vendorResult.error,
      jobResult.error,
      invoiceResult.error,
      customerResult.error,
      employeeResult.error,
    ].find(Boolean);
    if (firstError) setError(firstError.message);
    setExpenses((expenseResult.data ?? []) as Expense[]);
    setCategories(categoryResult.data ?? []);
    setVendors(vendorResult.data ?? []);
    setJobs(jobResult.data ?? []);
    setInvoices(invoiceResult.data ?? []);
    setCustomers(customerResult.data ?? []);
    setEmployees(employeeResult.data ?? []);
    setLoading(false);
  }, [supabase]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    const item = expenses.find((expense) => expense.id === expenseId);
    if (item)
      setForm({
        date: item.date,
        category_id: item.category_id ?? "",
        vendor_id: item.vendor_id ?? "",
        customer_id: item.customer_id ?? "",
        job_id: item.job_id ?? "",
        employee_id: item.employee_id ?? "",
        description: item.description,
        amount: String(item.amount),
        payment_method:
          item.payment_method as ExpenseFormValues["payment_method"],
        status: item.status as ExpenseFormValues["status"],
        receipt_url: item.receipt_url ?? "",
        notes: item.notes ?? "",
      });
  }, [expenseId, expenses]);

  async function saveExpense(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      date: form.date,
      category_id: form.category_id || null,
      vendor_id: form.vendor_id || null,
      customer_id: form.customer_id || null,
      job_id: form.job_id || null,
      employee_id: form.employee_id || null,
      description: form.description,
      amount: Number(form.amount),
      payment_method: form.payment_method,
      status: form.status,
      receipt_url: form.receipt_url || null,
      notes: form.notes || null,
    };
    const result = await fetch(
      expenseId ? `/api/financials/expenses/${expenseId}` : "/api/financials/expenses",
      {
        method: expenseId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    setSaving(false);
    const resultBody = await result.json() as { expense?: { id: string }; error?: string };
    if (!result.ok) return setError(resultBody.error ?? "Unable to save the expense.");
    const savedExpenseId = expenseId ?? resultBody.expense?.id;
    if (receiptFile && savedExpenseId) {
      setSaving(true);
      const receiptData = new FormData();
      receiptData.append("file", receiptFile);
      const receiptResult = await fetch(`/api/financials/expenses/${savedExpenseId}/receipt`, { method: "POST", body: receiptData });
      const receiptBody = await receiptResult.json() as { error?: string };
      setSaving(false);
      if (!receiptResult.ok) return setError(receiptBody.error ?? "Expense saved, but the receipt could not be uploaded.");
    }
    window.location.assign("/admin/financials/expenses");
  }
  async function saveCategory(event: React.FormEvent) {
    event.preventDefault();
    const value = editingCategory
      ? await supabase
          .from("expense_categories")
          .update(categoryForm)
          .eq("id", editingCategory.id)
      : await supabase.from("expense_categories").insert(categoryForm);
    if (value.error) setError(value.error.message);
    else {
      setCategoryForm({ name: "", group_name: "Other" });
      setEditingCategory(null);
      void load();
    }
  }
  async function saveVendor(event: React.FormEvent) {
    event.preventDefault();
    const result = await supabase
      .from("vendors")
      .insert({
        ...vendorForm,
        company: vendorForm.company || null,
        email: vendorForm.email || null,
        phone: vendorForm.phone || null,
        category: vendorForm.category || null,
        notes: vendorForm.notes || null,
      });
    if (result.error) setError(result.error.message);
    else {
      setVendorForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        category: "",
        notes: "",
      });
      void load();
    }
  }
  async function requestDelete(
    type: "expense" | "vendor" | "category",
    id: string,
    name: string,
  ) {
    if (type === "category") {
      const { count, error: countError } = await supabase
        .from("expenses")
        .select("id", { count: "exact", head: true })
        .eq("category_id", id);
      if (countError) return setError(countError.message);
      if (count) {
        setDeleteMessage(
          "This category is currently assigned to expenses. Reassign expenses before deleting.",
        );
        return;
      }
    }
    setDeleting({ type, id, name });
  }
  async function confirmDelete() {
    if (!deleting) return;
    setSaving(true);
    const deleteError = deleting.type === "expense"
      ? await fetch(`/api/financials/expenses/${deleting.id}`, { method: "DELETE" }).then(async (response) => response.ok ? null : new Error(((await response.json()) as { error?: string }).error ?? "Unable to delete the expense."))
      : (await supabase
          .from(deleting.type === "vendor" ? "vendors" : "expense_categories")
          .delete()
          .eq("id", deleting.id)).error;
    setSaving(false);
    if (deleteError) setError(deleteError.message);
    else {
      setDeleting(null);
      void load();
    }
  }

  const filteredExpenses = expenses.filter((item) =>
    `${item.expense_number} ${item.description} ${item.vendor?.name ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const dateStart = useMemo(() => {
    const now = new Date();
    if (period === "today") return now.toISOString().slice(0, 10);
    if (period === "weekly") {
      now.setDate(now.getDate() - 7);
      return now.toISOString().slice(0, 10);
    }
    if (period === "quarterly") {
      now.setMonth(now.getMonth() - 3);
      return now.toISOString().slice(0, 10);
    }
    if (period === "annually") {
      now.setFullYear(now.getFullYear() - 1);
      return now.toISOString().slice(0, 10);
    }
    if (period === "ytd") return `${now.getFullYear()}-01-01`;
    now.setMonth(now.getMonth() - 1);
    return now.toISOString().slice(0, 10);
  }, [period]);
  const periodExpenses = expenses.filter((item) => item.date >= dateStart);
  const periodInvoices = invoices.filter(
    (item) => !item.issue_date || item.issue_date >= dateStart,
  );
  const revenue = periodInvoices.reduce(
    (sum, item) => sum + Number(item.total ?? 0),
    0,
  );
  const paidRevenue = periodInvoices.reduce(
    (sum, item) => sum + Number(item.amount_paid ?? 0),
    0,
  );
  const outstanding = periodInvoices.reduce(
    (sum, item) => sum + Number(item.balance_due ?? 0),
    0,
  );
  const totalExpenses = periodExpenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );
  const profit = revenue - totalExpenses;

  if (loading)
    return <div className="p-8 text-slate-500">Loading financial data…</div>;
  if (view === "expense-form")
    return (
      <ExpenseForm
        form={form}
        setForm={setForm}
        categories={categories}
        vendors={vendors}
        jobs={jobs}
        customers={customers}
        employees={employees}
        receiptFile={receiptFile}
        setReceiptFile={setReceiptFile}
        saving={saving}
        error={error}
        onSave={saveExpense}
      />
    );
  if (view === "expense-detail") {
    const item = expenses.find((expense) => expense.id === expenseId);
    if (!item) return <div className="p-8">Expense not found.</div>;
    return (
      <ExpenseDetail
        item={item}
        onDelete={() =>
          void requestDelete("expense", item.id, item.expense_number)
        }
      />
    );
  }
  if (view === "categories" || view === "vendors") {
    const isCategory = view === "categories";
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <h1 className="text-3xl font-bold">
          {isCategory ? "Expense Categories" : "Vendors / Payees"}
        </h1>
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form
            onSubmit={isCategory ? saveCategory : saveVendor}
            className="space-y-3 rounded-2xl border bg-white p-6 shadow-sm"
          >
            {isCategory ? (
              <>
                <Field
                  label="Name"
                  value={categoryForm.name}
                  onChange={(name) =>
                    setCategoryForm({ ...categoryForm, name })
                  }
                />
                <Field
                  label="Group"
                  value={categoryForm.group_name}
                  onChange={(group_name) =>
                    setCategoryForm({ ...categoryForm, group_name })
                  }
                />
              </>
            ) : (
              <>
                <Field
                  label="Name"
                  value={vendorForm.name}
                  onChange={(name) => setVendorForm({ ...vendorForm, name })}
                />
                <Field
                  label="Company"
                  value={vendorForm.company}
                  onChange={(company) =>
                    setVendorForm({ ...vendorForm, company })
                  }
                />
                <Field
                  label="Email"
                  value={vendorForm.email}
                  onChange={(email) => setVendorForm({ ...vendorForm, email })}
                />
                <Field
                  label="Phone"
                  value={vendorForm.phone}
                  onChange={(phone) => setVendorForm({ ...vendorForm, phone })}
                />
              </>
            )}
            <button className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white">
              {editingCategory
                ? "Save Category"
                : `Add ${isCategory ? "Category" : "Vendor"}`}
            </button>
          </form>
          <div className="space-y-3 md:hidden">
            {(isCategory ? categories : vendors).map((row) => (
              <MobileRecordCard
                key={row.id}
                title={row.name}
                fields={isCategory ? [{ label: "Group", value: row.group_name }] : [{ label: "Company", value: row.company ?? "Not provided" }, { label: "Contact", value: row.email ?? row.phone ?? "Not provided" }]}
                actions={<>{!isCategory ? <Link href={`/admin/financials/vendors/${row.id}`} className="inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white">View</Link> : null}{isCategory ? <button type="button" onClick={() => { const category = row as Category; setEditingCategory(category); setCategoryForm({ name: category.name, group_name: category.group_name }); }} className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700">Edit</button> : <Link href={`/admin/financials/vendors/${row.id}/edit`} className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700">Edit</Link>}<button type="button" onClick={() => void requestDelete(isCategory ? "category" : "vendor", row.id, row.name)} className="min-h-11 rounded-lg border border-red-200 px-4 text-sm font-medium text-red-700">Delete</button></>}
              />
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-2xl border bg-white shadow-sm md:block">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="p-4">Name</th>
                  <th>Group / Company</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(isCategory ? categories : vendors).map((row) => (
                  <tr className="border-t" key={row.id}>
                    <td className="p-4 font-medium">
                      {isCategory ? (
                        row.name
                      ) : (
                        <Link
                          className="text-blue-700 hover:underline"
                          href={`/admin/financials/vendors/${row.id}`}
                        >
                          {row.name}
                        </Link>
                      )}
                    </td>
                    <td>
                      {isCategory ? row.group_name : (row.company ?? "—")}
                    </td>
                    <td>
                      {isCategory ? "—" : (row.email ?? row.phone ?? "—")}
                    </td>
                    <td className="space-x-2">
                      {isCategory ? (
                        <button
                          onClick={() => {
                            const category = row as Category;
                            setEditingCategory(category);
                            setCategoryForm({
                              name: category.name,
                              group_name: category.group_name,
                            });
                          }}
                          className="text-blue-700"
                        >
                          Edit
                        </button>
                      ) : (
                        <Link
                          className="text-blue-700"
                          href={`/admin/financials/vendors/${row.id}/edit`}
                        >
                          Edit
                        </Link>
                      )}
                      <button
                        onClick={() =>
                          void requestDelete(
                            isCategory ? "category" : "vendor",
                            row.id,
                            row.name,
                          )
                        }
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </div>
    );
  }
  if (view === "dashboard" || view === "reports")
    return (
      <FinancialReport
        period={period}
        setPeriod={setPeriod}
        revenue={revenue}
        paidRevenue={paidRevenue}
        outstanding={outstanding}
        expenses={totalExpenses}
        profit={profit}
        invoices={periodInvoices}
        jobs={jobs}
        expenseRows={periodExpenses}
      />
    );
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-slate-500">
            Track costs, receipts, vendors, and project spending.
          </p>
        </div>
        <Link
          href="/admin/financials/expenses/new"
          className="rounded-xl bg-blue-600 px-4 py-3 font-medium text-white"
        >
          New Expense
        </Link>
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search expenses"
        className="w-full max-w-md rounded-xl border p-3"
      />
      <div className="space-y-3 md:hidden">
        {filteredExpenses.map((item) => (
          <MobileRecordCard
            key={item.id}
            title={item.expense_number}
            subtitle={item.description}
            badge={<span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{item.status}</span>}
            fields={[{ label: "Date", value: item.date }, { label: "Amount", value: currency(Number(item.amount)) }, { label: "Category", value: item.category?.name ?? "Uncategorized" }, { label: "Vendor", value: item.vendor?.name ?? "Not provided" }]}
            actions={<><Link href={`/admin/financials/expenses/${item.id}`} className="inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white">View</Link><Link href={`/admin/financials/expenses/${item.id}/edit`} className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700">Edit</Link><button type="button" onClick={() => void requestDelete("expense", item.id, item.expense_number)} className="min-h-11 rounded-lg border border-red-200 px-4 text-sm font-medium text-red-700">Delete</button></>}
          />
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-2xl border bg-white shadow-sm md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-4">Expense</th>
              <th>Date</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4 font-medium">
                  {item.expense_number}
                  <div className="text-slate-500">{item.description}</div>
                </td>
                <td>{item.date}</td>
                <td>{item.category?.name ?? "—"}</td>
                <td>{item.vendor?.name ?? "—"}</td>
                <td>{currency(Number(item.amount))}</td>
                <td>{item.status}</td>
                <td className="space-x-2">
                  <Link
                    className="text-blue-700"
                    href={`/admin/financials/expenses/${item.id}`}
                  >
                    View
                  </Link>
                  <Link
                    className="text-blue-700"
                    href={`/admin/financials/expenses/${item.id}/edit`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() =>
                      void requestDelete(
                        "expense",
                        item.id,
                        item.expense_number,
                      )
                    }
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete ${deleting?.type ?? "record"}`}
        description={
          deleting?.type === "vendor"
            ? "Are you sure you want to delete this vendor?"
            : `Are you sure you want to delete this ${deleting?.type ?? "record"}?`
        }
        confirmText="Delete"
        loading={saving}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
      <ConfirmDialog
        open={Boolean(deleteMessage)}
        title="Category in use"
        description={deleteMessage}
        confirmText="OK"
        confirmVariant="primary"
        onConfirm={() => setDeleteMessage("")}
        onCancel={() => setDeleteMessage("")}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        required={label === "Name"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border p-3"
      />
    </label>
  );
}
function ExpenseForm({
  form,
  setForm,
  categories,
  vendors,
  jobs,
  customers,
  employees,
  receiptFile,
  setReceiptFile,
  saving,
  error,
  onSave,
}: {
  form: ExpenseFormValues;
  setForm: React.Dispatch<React.SetStateAction<ExpenseFormValues>>;
  categories: Category[];
  vendors: Vendor[];
  jobs: Job[];
  customers: Customer[];
  employees: Employee[];
  receiptFile: File | null;
  setReceiptFile: (file: File | null) => void;
  saving: boolean;
  error: string;
  onSave: (event: React.FormEvent) => Promise<void>;
}) {
  const [expenseType, setExpenseType] = useState("");
  const availableCategories = categories.filter((category) =>
    expenseType === "Job Materials" ? category.group_name === "Materials"
      : expenseType === "Employee/Contractor Payments" ? category.group_name === "Labor"
        : expenseType === "Business Purchases" ? !["Materials", "Labor"].includes(category.group_name)
          : true,
  );
  const input = (
    label: string,
    key: keyof ExpenseFormValues,
    type = "text",
  ) => (
    <label className="block text-sm font-medium">
      {label}
      <input
        required={key === "description" || key === "amount"}
        type={type}
        value={form[key]}
        onChange={(event) => setForm({ ...form, [key]: event.target.value })}
        className="mt-2 w-full rounded-xl border p-3"
      />
    </label>
  );
  return (
    <form onSubmit={onSave} className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <h1 className="text-3xl font-bold">
        {form.description ? "Edit Expense" : "New Expense"}
      </h1>
      <div className="grid gap-5 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2">
        <label>
          Expense type
          <select
            value={expenseType}
            required
            onChange={(event) => {
              setExpenseType(event.target.value);
              const group = event.target.value === "Job Materials" ? "Materials" : event.target.value === "Employee/Contractor Payments" ? "Labor" : "";
              if (group && !categories.some((category) => category.id === form.category_id && category.group_name === group)) setForm({ ...form, category_id: "" });
            }}
            className="mt-2 w-full rounded-xl border p-3"
          >
            <option value="">Select type</option>
            <option>Job Materials</option>
            <option>Business Purchases</option>
            <option>Employee/Contractor Payments</option>
          </select>
          <span className="mt-1 block text-xs text-slate-500">Classification is derived from the selected category.</span>
        </label>
        {input("Description", "description")}
        {input("Amount", "amount", "number")}
        {input("Date", "date", "date")}
        <label>
          Category
          <select
            value={form.category_id}
            required
            onChange={(event) =>
              setForm({ ...form, category_id: event.target.value })
            }
            className="mt-2 w-full rounded-xl border p-3"
          >
            <option value="">Select category</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Vendor
          <select
            value={form.vendor_id}
            onChange={(event) =>
              setForm({ ...form, vendor_id: event.target.value })
            }
            className="mt-2 w-full rounded-xl border p-3"
          >
            <option value="">None</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Job
          <select
            value={form.job_id}
            onChange={(event) =>
              setForm({ ...form, job_id: event.target.value })
            }
            className="mt-2 w-full rounded-xl border p-3"
          >
            <option value="">None</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.job_number ?? job.title ?? "Job"}
              </option>
            ))}
          </select>
        </label>
        <label>
          Customer
          <select value={form.customer_id} onChange={(event) => setForm({ ...form, customer_id: event.target.value })} className="mt-2 w-full rounded-xl border p-3">
            <option value="">None</option>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{`${customer.first_name} ${customer.last_name}`}{customer.email ? ` — ${customer.email}` : ""}</option>)}
          </select>
        </label>
        <label>
          Employee / contractor
          <select value={form.employee_id} onChange={(event) => setForm({ ...form, employee_id: event.target.value })} className="mt-2 w-full rounded-xl border p-3">
            <option value="">None</option>
            {employees.map((employee) => <option key={employee.id} value={employee.id}>{`${employee.first_name} ${employee.last_name}`}{employee.role ? ` — ${employee.role}` : ""}</option>)}
          </select>
        </label>
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) =>
              setForm({
                ...form,
                status: event.target.value as ExpenseFormValues["status"],
              })
            }
            className="mt-2 w-full rounded-xl border p-3"
          >
            {["Paid", "Pending", "Reimbursed"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Payment method
          <select
            value={form.payment_method}
            onChange={(event) =>
              setForm({
                ...form,
                payment_method: event.target
                  .value as ExpenseFormValues["payment_method"],
              })
            }
            className="mt-2 w-full rounded-xl border p-3"
          >
            {["Cash", "Credit Card", "Bank Transfer", "Check"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="md:col-span-2">
          Notes
          <textarea
            value={form.notes}
            onChange={(event) =>
              setForm({ ...form, notes: event.target.value })
            }
            className="mt-2 w-full rounded-xl border p-3"
            rows={4}
          />
        </label>
        <label className="md:col-span-2">
          Receipt upload
          <input type="file" accept="image/*,application/pdf" onChange={(event) => setReceiptFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border p-3" />
          <span className="mt-1 block text-xs text-slate-500">Images and PDFs up to 10 MB are stored in the private expense-receipts bucket.</span>
          {receiptFile && <span className="mt-1 block text-sm text-slate-600">Selected: {receiptFile.name}</span>}
        </label>
        {error && <p className="text-red-600 md:col-span-2">{error}</p>}
        <button
          disabled={saving}
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white"
        >
          {saving ? "Saving…" : "Save Expense"}
        </button>
      </div>
    </form>
  );
}
function ExpenseDetail({
  item,
  onDelete,
}: {
  item: Expense;
  onDelete: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">{item.expense_number}</h1>
          <p className="text-slate-500">{item.description}</p>
        </div>
        <div className="space-x-3">
          <Link
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
            href={`/admin/financials/expenses/${item.id}/edit`}
          >
            Edit
          </Link>
          <button
            onClick={onDelete}
            className="rounded-xl border border-red-200 px-4 py-2 text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="grid gap-4 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2">
        <p>
          <b>Amount:</b> {currency(Number(item.amount))}
        </p>
        <p>
          <b>Date:</b> {item.date}
        </p>
        <p>
          <b>Vendor:</b> {item.vendor?.name ?? "—"}
        </p>
        <p>
          <b>Category:</b> {item.category?.name ?? "—"}
        </p>
        <p>
          <b>Status:</b> {item.status}
        </p>
        <p>
          <b>Receipt:</b>{" "}
          <ExpenseReceiptButton expenseId={item.id} hasReceipt={Boolean(item.receipt_url)} />
        </p>
        <p className="md:col-span-2">
          <b>Notes:</b> {item.notes ?? "—"}
        </p>
      </div>
    </div>
  );
}
function FinancialReport({
  period,
  setPeriod,
  revenue,
  paidRevenue,
  outstanding,
  expenses,
  profit,
  invoices,
  jobs,
  expenseRows,
}: {
  period: string;
  setPeriod: (value: string) => void;
  revenue: number;
  paidRevenue: number;
  outstanding: number;
  expenses: number;
  profit: number;
  invoices: Invoice[];
  jobs: Job[];
  expenseRows: Expense[];
}) {
  const margin = revenue ? (profit / revenue) * 100 : 0;
  const completed = jobs.filter((job) => job.status === "Completed").length;
  const scheduled = jobs.filter((job) => job.status === "Scheduled").length;
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-slate-500">
            Operational performance for the selected period.
          </p>
        </div>
        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          className="rounded-xl border p-3"
        >
          {[
            ["today", "Today"],
            ["weekly", "Weekly"],
            ["monthly", "Monthly"],
            ["quarterly", "Quarterly"],
            ["annually", "Annually"],
            ["ytd", "Year To Date"],
          ].map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Revenue", revenue],
          ["Paid Revenue", paidRevenue],
          ["Outstanding", outstanding],
          ["Total Expenses", expenses],
          ["Gross Profit", profit],
          ["Profit Margin", margin],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">
              {String(label).includes("Margin")
                ? `${Number(value).toFixed(1)}%`
                : currency(Number(value))}
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Invoices & Payments</h2>
          <p className="mt-3">
            Paid:{" "}
            {invoices.filter((invoice) => invoice.status === "Paid").length} ·
            Sent:{" "}
            {invoices.filter((invoice) => invoice.status === "Sent").length} ·
            Draft:{" "}
            {invoices.filter((invoice) => invoice.status === "Draft").length} ·
            Overdue:{" "}
            {invoices.filter((invoice) => invoice.status === "Overdue").length}
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Jobs</h2>
          <p className="mt-3">
            Total: {jobs.length} · Completed: {completed} · Scheduled:{" "}
            {scheduled} · Revenue per job:{" "}
            {currency(jobs.length ? revenue / jobs.length : 0)}
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="font-semibold">
            Expense categories and vendor spending
          </h2>
          {expenseRows.length === 0 ? (
            <p className="mt-3 text-slate-500">No expenses in this period.</p>
          ) : (
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {expenseRows.slice(0, 10).map((expense) => (
                <li key={expense.id}>
                  {expense.category?.name ?? "Uncategorized"} ·{" "}
                  {expense.vendor?.name ?? "No vendor"}:{" "}
                  {currency(Number(expense.amount))}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
