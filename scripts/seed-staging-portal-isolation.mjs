import { createClient } from "@supabase/supabase-js";

const ref = "dlhgojerppuowenwwygu";
const url = process.env.STAGING_SUPABASE_URL;
const key = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key || new URL(url).hostname !== `${ref}.supabase.co`) throw new Error("Staging service credentials are required.");
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function fixture(label) {
  const email = `staging.portal.${label.toLowerCase()}@xareon.test`;
  const token = `staging-portal-${label.toLowerCase()}-20260805`;
  let customer = (await supabase.from("customers").select("id").eq("email", email).maybeSingle()).data;
  if (!customer) customer = (await supabase.from("customers").insert({ first_name: "Portal", last_name: label, email, status: "Active", portal_token: token }).select("id").single()).data;
  if (!customer) throw new Error(`Unable to create ${label} customer.`);
  let estimate = (await supabase.from("estimates").select("id").eq("estimate_code", `STG-PORTAL-${label}`).maybeSingle()).data;
  const signatureToken = label === "A" ? "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" : "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
  if (!estimate) estimate = (await supabase.from("estimates").insert({ customer_id: customer.id, estimate_code: `STG-PORTAL-${label}`, status: "Sent", subtotal: 100, tax: 0, total: 100, signature_token: signatureToken }).select("id").single()).data;
  let invoice = (await supabase.from("invoices").select("id").eq("invoice_number", `STG-PORTAL-${label}`).maybeSingle()).data;
  if (!invoice) invoice = (await supabase.from("invoices").insert({ customer_id: customer.id, invoice_number: `STG-PORTAL-${label}`, status: "Sent", subtotal: 100, tax: 0, total: 100, amount_paid: 0, balance_due: 100 }).select("id").single()).data;
  const fileUrl = `staging/portal/${label}.pdf`;
  await supabase.storage.from("customer-documents").upload(fileUrl, new Uint8Array([37, 80, 68, 70]), { contentType: "application/pdf", upsert: true });
  let document = (await supabase.from("customer_documents").select("id").eq("customer_id", customer.id).eq("title", `Portal ${label} document`).maybeSingle()).data;
  if (!document) document = (await supabase.from("customer_documents").insert({ customer_id: customer.id, title: `Portal ${label} document`, document_type: "Estimate", file_url: fileUrl }).select("id").single()).data;
  return { token, estimateId: estimate?.id, invoiceId: invoice?.id, documentId: document?.id };
}
console.log(JSON.stringify({ a: await fixture("A"), b: await fixture("B") }));
