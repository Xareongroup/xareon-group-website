import { createClient } from "@supabase/supabase-js";

const stagingRef = "dlhgojerppuowenwwygu";
const url = process.env.STAGING_SUPABASE_URL;
const publishableKey = process.env.STAGING_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.STAGING_TEST_PASSWORD;

if (!url || !publishableKey || !serviceRoleKey || !password) {
  throw new Error("STAGING_SUPABASE_URL, STAGING_SUPABASE_PUBLISHABLE_KEY, STAGING_SUPABASE_SERVICE_ROLE_KEY, and STAGING_TEST_PASSWORD are required.");
}
if (new URL(url).hostname !== `${stagingRef}.supabase.co`) {
  throw new Error(`Refusing to test a non-staging project: ${new URL(url).hostname}`);
}

const admin = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
const identities = ["owner", "manager", "employee", "contractor"];
const marker = "STG-RLS-ASSIGNMENT-20260805";

function requireData(result, label) {
  if (result.error || !result.data) throw new Error(`${label}: ${result.error?.message ?? "no data returned"}`);
  return result.data;
}

async function userIdFor(email) {
  for (let page = 1; ; page += 1) {
    const listed = requireData(await admin.auth.admin.listUsers({ page, perPage: 1000 }), "list auth users");
    const user = listed.users.find((candidate) => candidate.email?.toLowerCase() === email);
    if (user) return user.id;
    if (listed.users.length < 1000) throw new Error(`Missing staging user ${email}`);
  }
}

const roleRows = {};
for (const role of identities) {
  const userId = await userIdFor(`staging.${role}@xareon.test`);
  roleRows[role] = requireData(await admin.from("user_roles").select("role, employee_id").eq("user_id", userId).single(), `load ${role} mapping`);
}

async function fixture(role) {
  const title = `${marker} ${role}`;
  const existing = await admin.from("jobs").select("id, assigned_employee_id").eq("title", title).maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) {
    if (existing.data.assigned_employee_id !== roleRows[role].employee_id) {
      throw new Error(`${role} fixture is assigned to the wrong employee.`);
    }
    return existing.data.id;
  }
  return requireData(await admin.from("jobs")
    .insert({ title, status: "Scheduled", assigned_employee_id: roleRows[role].employee_id, notes: marker })
    .select("id")
    .single(), `create ${role} assigned fixture`).id;
}

const employeeJobId = await fixture("employee");
const contractorJobId = await fixture("contractor");

async function photoFixture(jobId, label) {
  const imageUrl = `staging://rls-assignment/${label}`;
  const existing = await admin.from("job_photos").select("id").eq("job_id", jobId).eq("image_url", imageUrl).maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) return existing.data.id;
  return requireData(await admin.from("job_photos")
    .insert({ job_id: jobId, image_url: imageUrl, category: "Before", caption: marker })
    .select("id")
    .single(), `create ${label} photo fixture`).id;
}

const employeePhotoId = await photoFixture(employeeJobId, "employee");
const contractorPhotoId = await photoFixture(contractorJobId, "contractor");

async function visible(role, jobId) {
  const client = createClient(url, publishableKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const signedIn = await client.auth.signInWithPassword({ email: `staging.${role}@xareon.test`, password });
  if (signedIn.error) throw new Error(`${role} sign-in: ${signedIn.error.message}`);
  const result = await client.from("jobs").select("id").eq("id", jobId);
  await client.auth.signOut();
  if (result.error) throw new Error(`${role} job select: ${result.error.message}`);
  return result.data.length === 1;
}

async function visiblePhoto(role, photoId) {
  const client = createClient(url, publishableKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const signedIn = await client.auth.signInWithPassword({ email: `staging.${role}@xareon.test`, password });
  if (signedIn.error) throw new Error(`${role} sign-in: ${signedIn.error.message}`);
  const result = await client.from("job_photos").select("id").eq("id", photoId);
  await client.auth.signOut();
  if (result.error) throw new Error(`${role} photo select: ${result.error.message}`);
  return result.data.length === 1;
}

const checks = {
  owner: [await visible("owner", employeeJobId), await visible("owner", contractorJobId)],
  manager: [await visible("manager", employeeJobId), await visible("manager", contractorJobId)],
  employee: [await visible("employee", employeeJobId), await visible("employee", contractorJobId)],
  contractor: [await visible("contractor", employeeJobId), await visible("contractor", contractorJobId)],
};

const expected = JSON.stringify({ owner: [true, true], manager: [true, true], employee: [true, false], contractor: [false, true] });
if (JSON.stringify(checks) !== expected) throw new Error(`Assignment-scoped access failed: ${JSON.stringify(checks)}`);
const photoChecks = {
  owner: [await visiblePhoto("owner", employeePhotoId), await visiblePhoto("owner", contractorPhotoId)],
  manager: [await visiblePhoto("manager", employeePhotoId), await visiblePhoto("manager", contractorPhotoId)],
  employee: [await visiblePhoto("employee", employeePhotoId), await visiblePhoto("employee", contractorPhotoId)],
  contractor: [await visiblePhoto("contractor", employeePhotoId), await visiblePhoto("contractor", contractorPhotoId)],
};
if (JSON.stringify(photoChecks) !== expected) throw new Error(`Assignment-scoped photo access failed: ${JSON.stringify(photoChecks)}`);
console.log(JSON.stringify({ project: stagingRef, fixtures: { employeeJobId, contractorJobId, employeePhotoId, contractorPhotoId }, checks, photoChecks }, null, 2));
