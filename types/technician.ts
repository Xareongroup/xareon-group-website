export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  color: string;
  active: boolean;
}

export interface ScheduledJob {
  id: string;
  technicianId: string;
  customerName: string;
  title: string;
  address: string;
  start: string;
  end: string;
  status:
    | "scheduled"
    | "en-route"
    | "in-progress"
    | "completed";
}