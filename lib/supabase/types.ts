export interface Customer {
  id: string;

  first_name: string;

  last_name: string;

  email: string;

  phone: string;

  address: string;

  city: string;

  state: string;

  zip_code: string | null;

  notes: string;

  created_at: string;
}
