import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.STAGING_SUPABASE_URL,
  process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY
);

const { data: users, error: listError } =
  await supabase.auth.admin.listUsers();

if (listError) {
  throw listError;
}

const user = users.users.find(
  (u) => u.email === "staging.owner@xareon.test"
);

if (!user) {
  throw new Error("Owner user not found");
}

const { error } = await supabase.auth.admin.updateUserById(
  user.id,
  {
    password: process.env.STAGING_TEST_PASSWORD,
    email_confirm: true,
  }
);

if (error) {
  throw error;
}

console.log("Password reset successfully");
console.log("User:", user.email);