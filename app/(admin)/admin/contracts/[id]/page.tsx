"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

import StatusBadge from "@/components/admin/StatusBadge";
import SendContractButton from "@/components/admin/contracts/SendContractButton";


interface Contract {

  id: string;

  contract_number: string | null;

  status: string | null;

  terms: string | null;

  notes: string | null;

  issue_date: string | null;

  created_at: string | null;

sent_at: string | null;

sent_to: string | null;

signed_at: string | null;

signed_by_name: string | null;


  customer: {

    first_name: string;

    last_name: string;

    email?: string | null;

    phone?: string | null;

    address?: string | null;

  } | null;


  estimate: {

    estimate_number: number;

    total: number;

  } | null;


  job: {

    job_number: string | null;

  } | null;

}



export default function ContractDetailsPage() {


  const params = useParams();
  const contractId = typeof params.id === "string" ? params.id : "";


  const supabase = createClient();



  const [loading, setLoading] =
    useState(true);


  const [pdfLoading, setPdfLoading] =
    useState(false);


  const [contract, setContract] =
    useState<Contract | null>(null);





  async function loadContract() {


    const { data, error } =
      await supabase

        .from("contracts")

        .select(`

          *,

          customer:customers(
            first_name,
            last_name,
            email,
            phone,
            address
          ),

          estimate:estimates(
            estimate_number,
            total
          ),

          job:jobs(
            job_number
          )

        `)

        .eq(
          "id",
          contractId
        )

        .single();




    if (!error && data) {


      setContract({

        ...data,


        customer:
          Array.isArray(data.customer)
            ? data.customer[0] ?? null
            : data.customer,


        estimate:
          Array.isArray(data.estimate)
            ? data.estimate[0] ?? null
            : data.estimate,


        job:
          Array.isArray(data.job)
            ? data.job[0] ?? null
            : data.job,

      });



    }


    setLoading(false);

  }





  async function generatePDF() {

    try {

      if (!contract) return;


      setPdfLoading(true);


      const response =
        await fetch(
          `/api/contracts/${contract.id}/pdf`,
          {
            method: "POST",
          }
        );


      const data =
        await response.json();



      if (!response.ok) {

        throw new Error(
          data.error ??
          "Unable to generate PDF."
        );

      }



      window.open(
        data.url,
        "_blank"
      );


    }
    catch(error:any){

      console.error(
        "PDF ERROR:",
        error
      );


      alert(
        error.message ??
        "PDF generation failed."
      );

    }
    finally {

      setPdfLoading(false);

    }

  }





  useEffect(() => {

    void loadContract();

  }, []);






  if (loading) {

    return (

      <div className="flex h-64 items-center justify-center">

        <div className="text-slate-500">
          Loading contract...
        </div>

      </div>

    );

  }






  if (!contract) {

    return (

      <div className="flex h-64 items-center justify-center">

        <div className="text-red-600">
          Contract not found.
        </div>

      </div>

    );

  }






  return (

    <div className="mx-auto max-w-7xl px-6 py-8">



      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


        <div>


          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">

            CONTRACT

          </p>


          <h1 className="mt-2 text-4xl font-bold text-slate-900">

            Contract Agreement

          </h1>


          <p className="mt-2 text-slate-500">

            Contract #
            {" "}
            {contract.contract_number ?? "Pending"}

          </p>


        </div>





        <div className="flex flex-wrap items-center gap-3">


          <StatusBadge
            status={contract.status ?? "Draft"}
          />



          <Link

            href={`/admin/contracts/${contract.id}/edit`}

            className="
            rounded-xl
            border
            border-slate-300
            px-5
            py-3
            font-medium
            transition
            hover:bg-slate-100
            "

          >

            Edit Contract

          </Link>


          <Link

  href={`/admin/contracts/${contract.id}/preview`}

  className="
  rounded-xl
  bg-blue-600
  px-5
  py-3
  font-medium
  text-white
  transition
  hover:bg-blue-700
  "

>

  Preview

</Link>





          <button

            onClick={generatePDF}

            disabled={pdfLoading}

            className="
            rounded-xl
            border
            border-slate-300
            px-5
            py-3
            font-medium
            transition
            hover:bg-slate-100
            disabled:opacity-50
            "

          >

            {
              pdfLoading
              ? "Generating PDF..."
              : "Download PDF"
            }

                    </button>


          <SendContractButton
            contractId={contract.id}
          />


        </div>


      </div>





      <div className="grid gap-8 lg:grid-cols-3">



        <div className="space-y-6">


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


            <h2 className="mb-4 text-lg font-semibold">
              Customer
            </h2>



            <p className="font-medium text-slate-900">

              {
                contract.customer
                ?
                `${contract.customer.first_name} ${contract.customer.last_name}`
                :
                "No Customer"
              }

            </p>



            <p className="mt-2 text-sm text-slate-600">
              {contract.customer?.email ?? "-"}
            </p>


            <p className="text-sm text-slate-600">
              {contract.customer?.phone ?? "-"}
            </p>


            <p className="text-sm text-slate-600">
              {contract.customer?.address ?? "-"}
            </p>


          </div>





          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


            <h2 className="mb-4 text-lg font-semibold">
              Related Records
            </h2>



            <div className="space-y-4">


              <div>

                <p className="text-sm text-slate-500">
                  Estimate
                </p>


                <p className="font-medium">

                  {contract.estimate?.estimate_number ?? "-"}

                </p>


              </div>





              <div>

                <p className="text-sm text-slate-500">
                  Job
                </p>


                <p className="font-medium">

                  {contract.job?.job_number ?? "-"}

                </p>


              </div>


            </div>


          </div>


        </div>







        <div className="space-y-6 lg:col-span-2">


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Contract Terms
            </h2>


            <div className="whitespace-pre-wrap text-slate-700">

              {
                contract.terms ||
                "No contract terms have been added."
              }

            </div>


          </div>






          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Internal Notes
            </h2>


            <div className="whitespace-pre-wrap text-slate-700">

              {
                contract.notes ||
                "No internal notes."
              }

            </div>


          </div>






          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Contract Timeline
            </h2>


            <div className="grid gap-6 md:grid-cols-4">


              <div>

                <p className="text-sm text-slate-500">
                  Created
                </p>

                <p className="mt-1 font-medium">

                  {
                    contract.created_at
                      ? new Date(contract.created_at).toLocaleDateString()
                      : "—"
                  }

                </p>

              </div>


<div>

  <p className="text-sm text-slate-500">
    Sent
  </p>

  <p className="mt-1 font-medium">

    {
      contract.sent_at
      ?
      new Date(
        contract.sent_at
      ).toLocaleDateString()
      :
      "Not Sent"
    }

  </p>

</div>


              <div>

                <p className="text-sm text-slate-500">
                  Signed
                </p>

                <p className="mt-1 font-medium">

                  {
                    contract.signed_at
                    ?
                    new Date(
                      contract.signed_at
                    ).toLocaleDateString()
                    :
                    "Not Signed"
                  }

                </p>


              </div>






              <div>

                <p className="text-sm text-slate-500">
                  Signed By
                </p>


                <p className="mt-1 font-medium">

                  {
                    contract.signed_by_name ||
                    "Pending"
                  }

                </p>


              </div>


            </div>


          </div>




        </div>



      </div>



    </div>

  );

}
