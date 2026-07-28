export type WorkflowEvent =
  | "estimate.approved"
  | "job.completed"
  | "invoice.paid"
  | "customer.created";

export interface WorkflowRule {
  event: WorkflowEvent;
  name: string;
  description: string;
  enabled: boolean;
}

export const workflowRules: WorkflowRule[] = [
  {
    event: "estimate.approved",
    name: "Create Job",
    description:
      "Automatically create a job when an estimate is approved.",
    enabled: true,
  },
  {
    event: "job.completed",
    name: "Generate Invoice",
    description:
      "Automatically generate an invoice when a job is completed.",
    enabled: true,
  },
  {
    event: "invoice.paid",
    name: "Close Project",
    description:
      "Mark the project complete after the invoice is fully paid.",
    enabled: true,
  },
  {
    event: "customer.created",
    name: "Send Welcome Email",
    description:
      "Automatically send a welcome email to new customers.",
    enabled: false,
  },
];