# XAREON CRM Phase 2 Requirements

## Project Status

- Production v1.0 is live.
- Domain: https://www.xareongroup.com
- Production deployment is stable.
- Future changes must follow: Development → Staging → Production.

---

# Priority 1 — Production Bugs

## 1. Cloudflare Turnstile Security Verification Failure

**Problem:** Website quote/contact form shows: “Security verification is unavailable. Please try again later.”

**Expected:** Turnstile validation works on the production domain.

**Investigate:**

- Production environment variables
- Turnstile site configuration
- Domain authorization
- Contact form API validation

---

## 2. Website Contact Form Does Not Create CRM Leads

**Problem:** Customer submissions from the website are not creating CRM leads.

**Expected:** Every website quote request should create:

- Lead record
- Customer/contact information
- Description
- Lead source = Website
- Attached photos
- Activity history

Also add a Lead Photos section/button in the CRM.

---

## 3. Customer Portal Email/Button Generates Invalid URL

**Problem:** Customer receives a portal link, but clicking the button opens: “undefined's server IP address could not be found”.

**Expected:** Portal links should open:

`https://www.xareongroup.com/portal/[token]`

**Investigate:**

- `NEXT_PUBLIC_SITE_URL`
- Email template URLs
- Portal token generation

---

## 4. CRM Mobile Responsiveness Issues

**Problems:**

- Text color too light
- Poor readability
- Mobile menu missing or broken
- Layout issues on phones

**Expected:** CRM should be fully usable on mobile browsers.

---

## 5. CRM Console Failed Fetch Error

**Error:** `TypeError: Failed to fetch`

Next.js 16.2.10 (Turbopack)

**Need:** Identify the failing API request and resolve it.

---

# Priority 2 — Financial System Improvements

## 6. Invoice View Error

**Problem:** Invoice View page shows: “This page couldn't load. A server error occurred.”

**Need:** Investigate invoice detail route, permissions, and database queries.

---

## 7. Payments Module Upgrade

Payments should connect:

Customer → Contract → Invoice → Payment History

**Need ability to:**

- View all invoices
- View customer information
- Add payments
- Record partial payments
- Record percentage payments
- Record full payments

**Examples:**

- 25%
- 50%
- Remaining balance
- Full invoice payment

Payment history must remain attached to the invoice and customer.

---

## 8. Expenses Module Upgrade

Create a complete expense tracking system.

**Expense categories:**

- Job Materials
- Business Purchases
- Employee Payments
- Contractor Payments
- Other

**Requirements:**

Expenses must support:

- Amount
- Date
- Receipt
- Vendor
- Category
- Linked job
- Linked employee/contractor
- Notes

Job material expenses must link to actual jobs.

Reports/dashboard should calculate:

- Revenue
- Expenses
- Profit

Contractor/employee payment records should support future 1099 reporting.

---

# Priority 3 — CRUD Improvements

## 9. Customers

Add: Archive button.

Current: View | Edit

Required: View | Edit | Archive

---

## 10. Estimates

Add: Delete button.

Required: View | Edit | Delete

---

## 11. Contracts

Add: Delete button.

Required: View | Edit | Delete

---

## 12. Invoices

Add: Delete button.

Required: View | Edit | Delete

---

# Development Rules

Before implementing any item:

1. Analyze current architecture.
2. Identify affected files/database tables.
3. Explain proposed changes.
4. Confirm no security regression.
5. Implement only the approved task.
6. Test locally.
7. Deploy to staging.
8. Validate before production.

Do not combine unrelated tasks into one deployment.
