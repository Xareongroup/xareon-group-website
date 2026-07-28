import { RoleDefinition } from "@/types/auth";

export const defaultRoles: RoleDefinition[] = [
  {
    role: "owner",
    permissions: [
      {
        resource: "*",
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    ],
  },

  {
    role: "admin",
    permissions: [
      {
        resource: "*",
        create: true,
        read: true,
        update: true,
        delete: false,
      },
    ],
  },

  {
    role: "manager",
    permissions: [
      {
        resource: "customers",
        create: true,
        read: true,
        update: true,
        delete: false,
      },
      {
        resource: "jobs",
        create: true,
        read: true,
        update: true,
        delete: false,
      },
      {
        resource: "invoices",
        create: true,
        read: true,
        update: true,
        delete: false,
      },
    ],
  },

  {
    role: "dispatcher",
    permissions: [
      {
        resource: "jobs",
        create: true,
        read: true,
        update: true,
        delete: false,
      },
    ],
  },

  {
    role: "technician",
    permissions: [
      {
        resource: "assigned-jobs",
        create: false,
        read: true,
        update: true,
        delete: false,
      },
    ],
  },

  {
    role: "accounting",
    permissions: [
      {
        resource: "invoices",
        create: true,
        read: true,
        update: true,
        delete: false,
      },
      {
        resource: "payments",
        create: true,
        read: true,
        update: true,
        delete: false,
      },
    ],
  },

  {
    role: "sales",
    permissions: [
      {
        resource: "customers",
        create: true,
        read: true,
        update: true,
        delete: false,
      },
      {
        resource: "estimates",
        create: true,
        read: true,
        update: true,
        delete: false,
      },
    ],
  },
];