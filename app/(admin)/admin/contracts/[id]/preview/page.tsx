import { notFound } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";


interface Props {

  params: Promise<{
    id:string;
  }>;

}




export default async function ContractPreviewPage({

  params,

}:Props){


  const { id } =
    await params;



  const supabase =
    await createClient();





  const { data: contract } =

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
        id
      )

      .single();





  if(!contract){

    notFound();

  }







  return (

    <div className="mx-auto max-w-5xl px-6 py-8">





      {/* HEADER */}


      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-6">


        <div>


          <h1 className="text-4xl font-bold text-slate-900">

            Service Contract

          </h1>



          <p className="mt-2 text-slate-500">

            Contract #

            {" "}

            {contract.contract_number ?? "-"}

          </p>


        </div>




        <div className="flex gap-3">


          <Link

            href={`/admin/contracts/${id}`}

            className="
            rounded-lg
            border
            border-slate-300
            px-4
            py-2
            hover:bg-slate-100
            "

          >

            Back

          </Link>



        </div>


      </div>










      {/* COMPANY */}


      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


        <h2 className="text-2xl font-bold text-blue-700">

          XAREON GROUP

        </h2>


        <p className="mt-1 text-slate-600">

          Shield of Integrity

        </p>


        <p className="text-slate-600">

          Professional Home Repair & Installation Services

        </p>


        <p className="text-slate-600">

          Greater DMV Metro Area

        </p>


        <p className="text-slate-600">

          (202) 286-8497

        </p>


        <p className="text-slate-600">

          info@xareongroup.com

        </p>


      </div>









      {/* CUSTOMER */}


      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


        <h2 className="mb-4 text-xl font-semibold">

          Customer Information

        </h2>


        <p>

          {
            contract.customer?.first_name
          }

          {" "}

          {
            contract.customer?.last_name
          }

        </p>


        <p>

          {
            contract.customer?.email
          }

        </p>


        <p>

          {
            contract.customer?.phone
          }

        </p>


        <p>

          {
            contract.customer?.address
          }

        </p>


      </div>









      {/* CONTRACT SECTIONS */}


      <div className="mt-6 space-y-6">





        <Section

          title="1. Scope of Work"

          value={
            contract.scope_of_work ??
            "No scope of work provided."
          }

        />





        <Section

          title="2. Payment Terms"

          value={
            contract.payment_terms ??
            "No payment terms provided."
          }

        />





        <Section

          title="3. Warranty"

          value={
            contract.warranty ??
            "No warranty information provided."
          }

        />





        <Section

          title="4. Additional Notes"

          value={
            contract.notes ??
            "No additional notes."
          }

        />





      </div>










      {/* SIGNATURE */}


      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


        <h2 className="mb-4 text-xl font-semibold">

          Customer Approval

        </h2>


        <p>

          Status:

          {" "}

          <span className="font-semibold">

            {contract.status}

          </span>

        </p>


        <p>

          Signed By:

          {" "}

          {contract.signed_by_name ?? "Pending"}

        </p>


      </div>





    </div>

  );

}






function Section({

  title,

  value,

}:{

  title:string;

  value:string;

}){


  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">


      <h2 className="mb-3 text-xl font-semibold">

        {title}

      </h2>


      <p className="whitespace-pre-line text-slate-700">

        {value}

      </p>


    </div>

  );


}