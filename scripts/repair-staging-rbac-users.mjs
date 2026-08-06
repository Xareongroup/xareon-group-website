import { createClient } from "@supabase/supabase-js";

const stagingRef = "dlhgojerppuowenwwygu";
const url = process.env.STAGING_SUPABASE_URL;
const serviceRoleKey = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.STAGING_TEST_PASSWORD;

if (!url || !serviceRoleKey || !password) {
  throw new Error("STAGING_SUPABASE_URL, STAGING_SUPABASE_SERVICE_ROLE_KEY, and STAGING_TEST_PASSWORD are required.");
}
if (new URL(url).hostname !== `${stagingRef}.supabase.co`) {
  throw new Error(`Refusing to repair a non-staging project: ${new URL(url).hostname}`);
}

const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
const identities = [
  { role: "owner", email: "staging.owner@xareon.test", firstName: "Staging", lastName: "Owner", employeeRole: "Owner" },
  { role: "manager", email: "staging.manager@xareon.test", firstName: "Staging", lastName: "Manager", employeeRole: "Manager" },
  { role: "employee", email: "staging.employee@xareon.test", firstName: "Staging", lastName: "Employee", employeeRole: "Technician" },
  { role: "contractor", email: "staging.contractor@xareon.test", firstName: "Staging", lastName: "Contractor", employeeRole: "Contractor" },
];

function requireData(result, label) {
  if (result.error || !result.data) throw new Error(`${label}: ${result.error?.message ?? "no data returned"}`);
  return result.data;
}

async function findUser(email) {
  for (let page = 1; ; page += 1) {
    const listed = requireData(await supabase.auth.admin.listUsers({ page, perPage: 1000 }), "list auth users");
    const user = listed.users.find((candidate) => candidate.email?.toLowerCase() === email);
    if (user) return user;
    if (listed.users.length < 1000) return null;
  }
}

const results = [];
for (const identity of identities) {
  let user = await findUser(identity.email);
  if (user) {
    user = requireData(await supabase.auth.admin.updateUserById(user.id, { password, email_confirm: true }), `reset ${identity.role} password`).user;
  } else {
    user = requireData(await supabase.auth.admin.createUser({ email: identity.email, password, email_confirm: true }), `create ${identity.role} user`).user;
  }

  const employees = requireData(await supabase.from("employees").select("id").eq("email", identity.email), `load ${identity.role} employee`);
  if (employees.length > 1) throw new Error(`${identity.role} has ${employees.length} employee records; refusing to create or choose a duplicate.`);
  const employee = employees[0] ?? requireData(await supabase
    .from("employees")
    .insert({ email: identity.email, first_name: identity.firstName, last_name: identity.lastName, role: identity.employeeRole, status: "Active" })
    .select("id")
    .single(), `create ${identity.role} employee`);

  requireData(await supabase
    .from("user_roles")
    .upsert({ user_id: user.id, role: identity.role, employee_id: employee.id }, { onConflict: "user_id" })
    .select("user_id, role, employee_id")
    .single(), `assign ${identity.role} role`);

  const verifiedUser = await findUser(identity.email);
  const verifiedRole = requireData(await supabase.from("user_roles").select("role, employee_id").eq("user_id", user.id).single(), `verify ${identity.role} role`);
  if (!verifiedUser?.email_confirmed_at || verifiedRole.role !== identity.role || verifiedRole.employee_id !== employee.id) {
    throw new Error(`${identity.role} verification failed.`);
  }
  results.push({ role: identity.role, email: identity.email, emailConfirmed: true, employeeId: employee.id });
}

console.log(JSON.stringify({ project: stagingRef, repaired: results }, null, 2));
