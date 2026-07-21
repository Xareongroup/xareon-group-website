import { Estimate } from "@/types/estimate";

export const defaultEstimate: Estimate = {
  customerId: "",

  estimateNumber: "",

  issueDate: new Date().toISOString().split("T")[0],

  expirationDate: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0],

  status: "Draft",

  items: [],

  subtotal: 0,

  taxRate: 6,

  tax: 0,

  discount: 0,

  total: 0,

  notes: "",

  terms: `Thank you for choosing XAREON Group.

• This estimate is valid for 30 days.
• Payment is due upon project completion unless otherwise agreed.
• Additional work outside the scope of this estimate may require a revised estimate.
• Material prices are subject to availability and market conditions.`,

};