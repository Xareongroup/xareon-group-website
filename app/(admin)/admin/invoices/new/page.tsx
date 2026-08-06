"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import { Invoice } from "@/types/invoice";

import { defaultInvoice } from "@/lib/invoices/defaults";

import InvoiceHeader from "@/components/admin/invoices/InvoiceHeader";
import InvoiceItems from "@/components/admin/invoices/InvoiceItems";
import InvoiceSummary from "@/components/admin/invoices/InvoiceSummary";


const supabase = createClient();


interface Customer {
  id: string;
  first_name: string;
  last_name: string;
}


interface Estimate {
  id: string;
  estimate_number: number;
}


interface Job {
  id: string;
  job_number: string | null;
}



export default function NewInvoicePage() {


  const router = useRouter();


  const [loading, setLoading] =
    useState(true);


  const [saving, setSaving] =
    useState(false);



  const [invoice, setInvoice] =
    useState<Invoice>(defaultInvoice);



  const [customers, setCustomers] =
    useState<Customer[]>([]);



  const [estimates, setEstimates] =
    useState<Estimate[]>([]);



  const [jobs, setJobs] =
    useState<Job[]>([]);




  useEffect(() => {

    loadData();

  }, []);

  // A job is the authoritative link between the customer and its approved
  // estimate. Selecting it hydrates the draft invoice from that estimate.
  useEffect(() => {
    if (!invoice.jobId) return;

    async function loadJobEstimate() {
      const { data: job, error: jobError } = await supabase
        .from("jobs")
        .select("customer_id,estimate_id")
        .eq("id", invoice.jobId)
        .single();
      if (jobError || !job) {
        alert("Unable to load the selected job.");
        return;
      }

      if (!job.estimate_id) {
        setInvoice((previous) => ({ ...previous, customerId: job.customer_id ?? "", estimateId: "" }));
        return;
      }

      const [{ data: estimate, error: estimateError }, { data: estimateItems, error: itemsError }] = await Promise.all([
        supabase.from("estimates").select("id,customer_id,subtotal,tax_rate,tax,discount,total").eq("id", job.estimate_id).single(),
        supabase.from("estimate_items").select("id,description,quantity,unit,unit_price,discount,taxable,total").eq("estimate_id", job.estimate_id).order("sort_order"),
      ]);
      if (estimateError || itemsError || !estimate) {
        alert("Unable to load the estimate for this job.");
        return;
      }

      setInvoice((previous) => ({
        ...previous,
        customerId: estimate.customer_id,
        estimateId: estimate.id,
        items: (estimateItems ?? []).map((item) => ({
          id: item.id,
          description: item.description,
          quantity: Number(item.quantity ?? 0),
          unit: item.unit ?? "",
          unitPrice: Number(item.unit_price ?? 0),
          discount: Number(item.discount ?? 0),
          taxable: item.taxable ?? false,
          total: Number(item.total ?? 0),
        })),
        subtotal: Number(estimate.subtotal ?? 0),
        taxRate: Number(estimate.tax_rate ?? 0),
        tax: Number(estimate.tax ?? 0),
        discount: Number(estimate.discount ?? 0),
        total: Number(estimate.total ?? 0),
        balanceDue: Number(estimate.total ?? 0),
      }));
    }

    void loadJobEstimate();
  }, [invoice.jobId]);





  async function loadData() {


    try {


      setLoading(true);



      // Invoices use the production generate_invoice_number() function, not
      // the legacy generic sequences table. It preserves INV-YYYY-#####.
      const { data: invoiceNumber, error: invoiceNumberError } =
        await supabase.rpc("generate_invoice_number");

      if (invoiceNumberError || !invoiceNumber) {
        throw invoiceNumberError ?? new Error("Unable to generate invoice number.");
      }





      const [
        customersResult,
        estimatesResult,
        jobsResult,
      ] = await Promise.all([



        supabase
          .from("customers")
          .select(`
            id,
            first_name,
            last_name
          `)
          .order(
            "first_name"
          ),





        supabase
          .from("estimates")
          .select(`
            id,
            estimate_number
          `)
          .order(
            "created_at",
            {
              ascending:false,
            }
          ),





        supabase
          .from("jobs")
          .select(`
            id,
            job_number
          `)
          .order(
            "created_at",
            {
              ascending:false,
            }
          ),



      ]);





      if(customersResult.error)
        throw customersResult.error;



      if(estimatesResult.error)
        throw estimatesResult.error;



      if(jobsResult.error)
        throw jobsResult.error;





      setCustomers(
        customersResult.data ?? []
      );



      setEstimates(
        estimatesResult.data ?? []
      );



      setJobs(
        jobsResult.data ?? []
      );





      setInvoice((prev)=>({

        ...prev,

        invoiceNumber,

      }));



    } catch(error) {


      console.error(
        "Failed loading invoice data:",
        JSON.stringify(
          error,
          null,
          2
        )
      );


      alert(
        "Unable to load invoice data."
      );


    } finally {


      setLoading(false);


    }


  }







  async function saveInvoice() {


    try {


      setSaving(true);




      const {
        data: invoiceRecord,
        error: invoiceError,
      } =
        await supabase

          .from("invoices")

          .insert({

            customer_id:
              invoice.customerId || null,


            estimate_id:
              invoice.estimateId || null,


            job_id:
              invoice.jobId || null,


            invoice_number:
              invoice.invoiceNumber,


            subtotal:
              invoice.subtotal,


            tax:
              invoice.tax,


            total:
              invoice.total,


            balance_due:
              invoice.balanceDue,


            status:
              invoice.status,


            issue_date:
              invoice.issueDate,


            due_date:
              invoice.dueDate,


          })

          .select("id")

          .single();





      if(invoiceError)
        throw invoiceError;





      if(invoice.items.length > 0) {


        const items =
          invoice.items.map(
            (item,index)=>({


              invoice_id:
                invoiceRecord.id,


              description:
                item.description,


              quantity:
                item.quantity,


              unit:
                item.unit,


              unit_price:
                item.unitPrice,


              discount:
                item.discount,


              taxable:
                item.taxable,


              total:
                item.total,


              sort_order:
                index + 1,


            })
          );





        const {
          error: itemsError,
        } =
          await supabase

            .from("invoice_items")

            .insert(items);





        if(itemsError)
          throw itemsError;


      }






      alert(
        "Invoice created successfully."
      );



      router.push(
        "/admin/invoices"
      );




    } catch(error) {


      console.error(
        "Invoice creation error:",
        error
      );


      alert(
        "Unable to create invoice."
      );



    } finally {


      setSaving(false);


    }


  }







  if(loading) {


    return (

      <div className="
        flex
        min-h-[60vh]
        items-center
        justify-center
      ">

        <div className="text-center">

          <div className="
            text-lg
            font-semibold
            text-slate-700
          ">

            Loading invoice...

          </div>


          <p className="
            mt-2
            text-slate-500
          ">

            Please wait while we prepare the form.

          </p>


        </div>


      </div>

    );


  }







  return (

    <div className="
      mx-auto
      max-w-7xl
      space-y-6
      p-6
    ">



      <div className="
        flex
        items-center
        justify-between
      ">


        <div>


          <h1 className="
            text-3xl
            font-bold
            text-slate-900
          ">

            New Invoice

          </h1>



          <p className="
            mt-1
            text-slate-500
          ">

            Create a professional invoice for your customer.

          </p>


        </div>





        <div className="
          flex
          gap-3
        ">


          <button

            type="button"

            onClick={() =>
              router.push(
                "/admin/invoices"
              )
            }

            className="
              rounded-lg
              border
              border-slate-300
              bg-white
              px-5
              py-2.5
              font-medium
              text-slate-700
              hover:bg-slate-50
            "

          >

            Cancel

          </button>





          <button

            type="button"

            onClick={saveInvoice}

            disabled={saving}

            className="
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              font-medium
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "

          >

            {
              saving
              ?
              "Saving..."
              :
              "Save Invoice"
            }


          </button>



        </div>


      </div>







      <InvoiceHeader

        invoice={invoice}

        setInvoice={setInvoice}

        customers={customers}

        estimates={estimates}

        jobs={jobs.map((job) => ({
          ...job,
          job_number: job.job_number ?? "Unnumbered job",
        }))}

      />





      <InvoiceItems

        invoice={invoice}

        setInvoice={setInvoice}

      />





      <InvoiceSummary

        invoice={invoice}

        setInvoice={setInvoice}

      />




    </div>

  );


}
