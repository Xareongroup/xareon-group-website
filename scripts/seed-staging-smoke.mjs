import { createClient } from "@supabase/supabase-js";

const stagingRef = "dlhgojerppuowenwwygu";
const marker = "STG-SMOKE-20260805";
const url = process.env.STAGING_SUPABASE_URL;
const serviceRoleKey = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.STAGING_TEST_PASSWORD;

if (!url || !serviceRoleKey || !password) {
  throw new Error("STAGING_SUPABASE_URL, STAGING_SUPABASE_SERVICE_ROLE_KEY, and STAGING_TEST_PASSWORD are required.");
}

if (new URL(url).hostname !== `${stagingRef}.supabase.co`) {
  throw new Error(`Refusing to seed a non-staging project: ${new URL(url).hostname}`);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const users = [
  ["owner", "staging.owner@xareon.test", "Staging", "Owner"],
  ["manager", "staging.manager@xareon.test", "Staging", "Manager"],
  ["employee", "staging.employee@xareon.test", "Staging", "Employee"],
  ["contractor", "staging.contractor@xareon.test", "Staging", "Contractor"],
];

function requireData(result, label) {
  if (result.error || !result.data) throw new Error(`${label}: ${result.error?.message ?? "no data returned"}`);
  return result.data;
}

async function findOrCreateUser(role, email) {
  const { data: listed, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;
  let user = listed.users.find((candidate) => candidate.email === email);
  if (!user) {
    user = requireData(await supabase.auth.admin.createUser({ email, password, email_confirm: true }), `create ${role} user`).user;
  } else {
    requireData(await supabase.auth.admin.updateUserById(user.id, { password, email_confirm: true }), `reset ${role} password`);
  }
  return user;
}

const userIds = {};
for (const [role, email, firstName, lastName] of users) {
  const user = await findOrCreateUser(role, email);
  userIds[role] = user.id;
  let employee = (await supabase.from("employees").select("id").eq("email", email).maybeSingle()).data;
  if (!employee) employee = requireData(await supabase
    .from("employees")
    .insert({ email, first_name: firstName, last_name: lastName, role: role === "contractor" ? "Contractor" : role, status: "Active" })
    .select("id")
    .single(), `create ${role} employee`);
  requireData(await supabase
    .from("user_roles")
    .upsert({ user_id: user.id, role, employee_id: employee.id }, { onConflict: "user_id" })
    .select("user_id")
    .single(), `assign ${role} role`);
}

let customer = (await supabase.from("customers").select("id, portal_token").eq("email", "staging.smoke.customer@xareon.test").maybeSingle()).data;
if (!customer) customer = requireData(await supabase
  .from("customers")
  .insert({
    first_name: "Staging",
    last_name: "Smoke Customer",
    email: "staging.smoke.customer@xareon.test",
    phone: "555-0100",
    status: "Active",
    notes: marker,
    portal_token: "staging-smoke-20260805",
  })
  .select("id, portal_token")
  .single(), "upsert smoke customer");

let estimate = (await supabase.from("estimates").select("id, estimate_number").eq("estimate_code", marker).maybeSingle()).data;
if (!estimate) {
  estimate = requireData(await supabase
    .from("estimates")
    .insert({ customer_id: customer.id, estimate_code: marker, issue_date: "2026-08-05", status: "Approved", subtotal: 1000, tax: 0, total: 1000, notes: marker })
    .select("id, estimate_number")
    .single(), "create smoke estimate");
}

let job = (await supabase.from("jobs").select("id").eq("notes", marker).maybeSingle()).data;
if (!job) {
  job = requireData(await supabase
    .from("jobs")
    .insert({ customer_id: customer.id, estimate_id: estimate.id, assigned_employee_id: userIds.employee ? (await supabase.from("user_roles").select("employee_id").eq("user_id", userIds.employee).single()).data?.employee_id : null, title: "Staging smoke job", status: "Scheduled", scheduled_date: "2026-08-06", notes: marker })
    .select("id")
    .single(), "create smoke job");
}

let invoice = (await supabase.from("invoices").select("id").eq("payment_notes", marker).maybeSingle()).data;
if (!invoice) {
  invoice = requireData(await supabase
    .from("invoices")
    .insert({ customer_id: customer.id, estimate_id: estimate.id, job_id: job.id, invoice_number: marker, issue_date: "2026-08-05", due_date: "2026-08-20", status: "Sent", subtotal: 1000, tax: 0, total: 1000, amount_paid: 0, balance_due: 1000, payment_notes: marker })
    .select("id")
    .single(), "create smoke invoice");
}

const existingPayment = await supabase.from("payments").select("id").eq("reference_number", marker).maybeSingle();
if (existingPayment.error) throw existingPayment.error;
if (!existingPayment.data) requireData(await supabase
  .from("payments")
  .insert({ invoice_id: invoice.id, amount: 100, payment_method: "Check", payment_date: "2026-08-05", reference_number: marker, notes: marker })
  .select("id")
  .single(), "create smoke payment");

let vendor = (await supabase.from("vendors").select("id").eq("name", "Staging Smoke Vendor").maybeSingle()).data;
if (!vendor) vendor = requireData(await supabase
  .from("vendors")
  .insert({ name: "Staging Smoke Vendor", company: "Xareon Staging", notes: marker })
  .select("id")
  .single(), "create smoke vendor");
const category = requireData(await supabase.from("expense_categories").select("id").eq("name", "Miscellaneous").single(), "load Miscellaneous category");
const existingExpense = await supabase.from("expenses").select("id").eq("expense_number", marker).maybeSingle();
if (existingExpense.error) throw existingExpense.error;
if (!existingExpense.data) requireData(await supabase
  .from("expenses")
  .insert({ expense_number: marker, date: "2026-08-05", category_id: category.id, vendor_id: vendor.id, customer_id: customer.id, job_id: job.id, description: "Staging smoke expense", amount: 250, payment_method: "Credit Card", status: "Paid", notes: marker })
  .select("id")
  .single(), "create smoke expense");

console.log(JSON.stringify({ marker, customerId: customer.id, estimateNumber: estimate.estimate_number, jobId: job.id, invoiceId: invoice.id, vendorId: vendor.id }));
