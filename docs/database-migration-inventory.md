# Database migration inventory

All migrations are additive history and must be applied in filename order to a backup-verified target. Do not use `20260801_initial_core_schema.sql` as a production source of truth; the production parity baseline and later corrective migrations supersede its reconstructed assumptions.

| Migration | Purpose / principal objects | Security impact | Readiness |
|---|---|---|---|
| `20260800_production_parity_baseline` | Captured core production schema: customers, documents, estimates, jobs, invoices, payments, contracts, employees | Contains historical permissive policies | Reference only; risky if reapplied blindly |
| `20260801_initial_core_schema` | Reconstructed core schema and early RLS | Includes legacy staff policies | Historical only; do not use as parity authority |
| `20260804_create_financials` | Expense categories, vendors, expenses and indexes | Enables financial RLS | Required for financial module |
| `20260805_add_rbac_primitives` | `user_roles`, permissions/functions, financial RLS | Establishes RBAC primitives | Required |
| `20260806_fix_invoice_financial_rls` | Invoice/item/payment RBAC policies | Tightens financial access | Required |
| `20260807_replace_permissive_crm_rls` | Replaces broad CRM policies | Critical RLS correction | Required; validate staging first |
| `20260808_tighten_job_photo_rbac` | Splits job photo writes | Narrows photo mutation access | Required |
| `20260809_add_customer_number_generator` | Safe customer number generator | No RLS impact | Required for customer creation |
| `20260810_add_activity_logs` | Customer activity table/index/policies | Adds audit timeline access | Required |
| `20260811_create_leads` | Leads and lead activities/indexes/RLS | Adds sales RBAC | Required for lead capture |
| `20260812_employee_management` | Employee profile fields, skills, availability | Employee RLS | Required for dispatch features |
| `20260813_scope_assigned_job_access` | Assignment-scoped jobs and photos | Critical employee/contractor isolation | Required |
| `20260814_add_document_signatures` | Signature audit records/indexes | Sensitive signing data RLS | Required for signatures |
| `20260815_create_customer_documents_bucket` | Private customer-document storage | Storage security | Required for secure documents |
| `20260816_add_automation_engine` | Tasks and automation logs/indexes/RLS | Automation role restrictions | Required for Phase 5 UI/engine |

## Production process

Before applying any migration: take a managed database backup, run `supabase migration list`, apply to staging, regenerate types, run authenticated regression tests, then obtain a migration review approval. No migration in this inventory should be applied to production automatically.
