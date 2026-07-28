export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "approve"
  | "complete"
  | "payment"
  | "email";

export interface AuditLog {
  id: string;

  userId: string;
  userName: string;

  action: AuditAction;

  resource: string;
  resourceId: string;

  description: string;

  createdAt: string;

  ipAddress?: string;

  metadata?: Record<string, unknown>;
}