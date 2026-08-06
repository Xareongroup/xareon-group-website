# Security review

## Findings

| Severity | Finding | Recommendation |
|---|---|---|
| High | Historical baseline migration includes `USING (true)` authenticated policies. | Confirm migrations 20260805–20260808 and 20260813 are applied in production; compare live policy inventory before launch. |
| High | Several routes use `adminSupabase`; service-role bypasses RLS by design. | Maintain a route-by-route allowlist and require explicit authorization before each privileged business mutation. Review unauthenticated PDF/email/signature routes before launch. |
| Medium | `requireApiRole` currently contains a loose `as any` for `user_roles`. | Remove after type generation/compatibility is confirmed; preserve runtime role checks meanwhile. |
| Medium | Portal access is bearer-token based without a visible expiry check. | Establish token rotation/expiry policy and incident procedure; regenerate tokens after suspected disclosure. |
| Medium | Scheduler secret is not configured in the reviewed environment. | Add only to staging for controlled validation; never expose in client configuration. |
| Low | Build warns that Next middleware convention is deprecated and Vite config has a future compatibility warning. | Schedule maintenance before or shortly after launch; neither is a direct security bypass. |

## Verified controls

- Supabase service role is isolated in a `server-only` module.
- Customer portal utility validates a minimum-length token server-side, looks up a customer, and portal data queries include `customer_id` ownership constraints.
- Signature endpoints validate document signing tokens and record signer, timestamp, IP, and user agent.
- Browser RBAC checks previously confirmed owner/manager access to automation history and employee/contractor denial.

## Required release tests

Test Owner, Manager, Employee, Contractor, and customer portal identities against staging. Verify employee/contractor cannot read unassigned jobs or financial data; verify customer A cannot access customer B resource IDs. Check RLS policies directly in the production candidate before launch.
