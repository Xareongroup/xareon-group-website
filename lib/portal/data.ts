import "server-only";

import { adminSupabase } from "@/lib/supabase/admin";
import { authenticatePortalToken } from "@/lib/portal/authenticatePortalToken";

const customerSafeEvents = new Set([
  "customer_created", "estimate_created", "estimate_sent", "estimate_viewed", "estimate_approved", "estimate_signed",
  "contract_created", "contract_sent", "contract_signed", "job_created", "job_assigned", "job_completed",
  "invoice_created", "invoice_sent", "payment_received", "document_created",
]);

const customerEventLabels: Record<string, string> = {
  customer_created: "Project request received", estimate_created: "Estimate prepared", estimate_sent: "Estimate ready for review",
  estimate_viewed: "Estimate reviewed", estimate_approved: "Estimate approved", estimate_signed: "Estimate approved",
  contract_created: "Contract prepared", contract_sent: "Contract ready for signature", contract_signed: "Contract signed",
  job_created: "Project scheduled", job_assigned: "Technician scheduled", job_completed: "Project completed",
  invoice_created: "Invoice issued", invoice_sent: "Invoice ready", payment_received: "Payment received", document_created: "Document available",
};

async function requireCustomer(token: string) {
  const customer = await authenticatePortalToken(token);
  if (!customer) return null;
  return customer;
}

export async function getPortalDashboard(token: string) {
  const customer = await requireCustomer(token);
  if (!customer) return null;
  const [estimates, contracts, invoices, jobs, documents, activity] = await Promise.all([
    adminSupabase.from("estimates").select("id, estimate_number, status, total, created_at, signature_status").eq("customer_id", customer.id).order("created_at", { ascending: false }),
    adminSupabase.from("contracts").select("id, contract_number, status, issue_date, created_at, signed_at").eq("customer_id", customer.id).order("created_at", { ascending: false }),
    adminSupabase.from("invoices").select("id, invoice_number, status, total, amount_paid, balance_due, due_date, created_at").eq("customer_id", customer.id).order("created_at", { ascending: false }),
    adminSupabase.from("jobs").select("id, job_number, title, status, scheduled_date, start_time, service_address, created_at, assigned_employee:employees(first_name,last_name)").eq("customer_id", customer.id).order("scheduled_date", { ascending: true }),
    adminSupabase.from("customer_documents").select("id, title, document_type, file_url, status, signed_date, created_at").eq("customer_id", customer.id).order("created_at", { ascending: false }),
    adminSupabase.from("activity_logs").select("id, event_type, title, description, created_at").eq("customer_id", customer.id).order("created_at", { ascending: false }).limit(12),
  ]);
  for (const result of [estimates, contracts, invoices, jobs, documents, activity]) if (result.error) throw result.error;
  const activityTimeline = (activity.data ?? []).filter((event) => customerSafeEvents.has(event.event_type)).map((event) => ({ ...event, title: customerEventLabels[event.event_type] ?? "Project update", description: null }));
  return { customer, estimates: estimates.data ?? [], contracts: contracts.data ?? [], invoices: invoices.data ?? [], jobs: jobs.data ?? [], documents: documents.data ?? [], activity: activityTimeline };
}

export async function getPortalEstimate(token: string, estimateId: string) {
  const customer = await requireCustomer(token);
  if (!customer) return null;
  const { data: estimate, error } = await adminSupabase.from("estimates").select("*").eq("id", estimateId).eq("customer_id", customer.id).maybeSingle();
  if (error) throw error;
  if (!estimate) return null;
  const { data: items, error: itemsError } = await adminSupabase.from("estimate_items").select("*").eq("estimate_id", estimate.id).order("sort_order");
  if (itemsError) throw itemsError;
  return { customer, estimate, items: items ?? [] };
}

export async function getPortalContract(token: string, contractId: string) {
  const customer = await requireCustomer(token);
  if (!customer) return null;
  const { data: contract, error } = await adminSupabase.from("contracts").select("*").eq("id", contractId).eq("customer_id", customer.id).maybeSingle();
  if (error) throw error;
  return contract ? { customer, contract } : null;
}

export async function getPortalInvoice(token: string, invoiceId: string) {
  const customer = await requireCustomer(token);
  if (!customer) return null;
  const { data: invoice, error } = await adminSupabase.from("invoices").select("*").eq("id", invoiceId).eq("customer_id", customer.id).maybeSingle();
  if (error) throw error;
  if (!invoice) return null;
  const [items, payments] = await Promise.all([
    adminSupabase.from("invoice_items").select("*").eq("invoice_id", invoice.id).order("sort_order"),
    adminSupabase.from("payments").select("id, amount, payment_method, payment_date, notes").eq("invoice_id", invoice.id).order("payment_date", { ascending: false }),
  ]);
  if (items.error) throw items.error;
  if (payments.error) throw payments.error;
  return { customer, invoice, items: items.data ?? [], payments: payments.data ?? [] };
}

export async function getPortalDocument(token: string, documentId: string) {
  const customer = await requireCustomer(token);
  if (!customer) return null;
  const { data: document, error } = await adminSupabase.from("customer_documents").select("id, file_url, title").eq("id", documentId).eq("customer_id", customer.id).maybeSingle();
  if (error) throw error;
  return document;
}
