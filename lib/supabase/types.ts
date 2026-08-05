export interface Customer {
  id: string;

  first_name: string;

  last_name: string;

  email: string | null;

  phone: string | null;

  address: string | null;

  city: string | null;

  state: string | null;

  zip_code: string | null;

  notes: string | null;

  created_at: string | null;
}
