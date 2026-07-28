export type UserRole =
  | "owner"
  | "admin"
  | "manager"
  | "dispatcher"
  | "technician"
  | "accounting"
  | "sales";

export interface Permission {
  resource: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface RoleDefinition {
  role: UserRole;
  permissions: Permission[];
}