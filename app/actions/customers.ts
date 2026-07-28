"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


export async function getCustomers(
  search?: string,
  status: string = "Active"
) {
  const supabase = await createClient();


  let query = supabase
    .from("customers")
    .select("*")
    .order("created_at", {
      ascending: false,
    });



  // Filter by customer status
  // Active = default
  // Archived = archived customers only
  // All = show everything
  if (status !== "All") {
    query = query.eq(
      "status",
      status
    );
  }



  // Search by name, email, or phone
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }



  const { data, error } = await query;



  if (error) {
    throw new Error(error.message);
  }



  return data ?? [];
}





export async function updateCustomer(
  id: string,
  data: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
  }
) {
  const supabase = await createClient();



  const { error } = await supabase
    .from("customers")
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
    })
    .eq("id", id);



  if (error) {
    throw new Error(error.message);
  }



  revalidatePath(`/admin/customers/${id}`);
  revalidatePath("/admin/customers");



  return {
    success: true,
  };
}





export async function archiveCustomer(
  id: string
) {
  const supabase = await createClient();



  const { error } = await supabase
    .from("customers")
    .update({
      status: "Archived",
    })
    .eq("id", id);



  if (error) {
    throw new Error(error.message);
  }



  revalidatePath(`/admin/customers/${id}`);
  revalidatePath("/admin/customers");



  return {
    success: true,
  };
}
export async function restoreCustomer(
  id: string
) {
  const supabase = await createClient();


  const { error } = await supabase
    .from("customers")
    .update({
      status: "Active",
    })
    .eq("id", id);


  if (error) {
    throw new Error(error.message);
  }


  revalidatePath(`/admin/customers/${id}`);
  revalidatePath("/admin/customers");


  return {
    success: true,
  };
}