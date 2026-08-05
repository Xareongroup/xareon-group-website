import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

import ContractSignature from "@/components/public/ContractSignature";


interface Props {

  params: Promise<{
    token: string;
  }>;

}



export default async function ContractSigningPage({

  params,

}: Props) {


  const { token } =
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

        "signature_token",

        token

      )

      .single();







  if(!contract){

    notFound();

  }







  return (

    <main className="min-h-screen bg-slate-100 p-6">


      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">





        {/* COMPANY HEADER */}


        <div className="border-b border-slate-200 pb-6">


          <h1 className="text-3xl font-bold text-slate-900">

            XAREON GROUP

          </h1>



          <p className="mt-2 text-slate-500">

            Shield of Integrity

          </p>



          <p className="text-slate-500">

            Professional Home Repair & Installation Services

          </p>


          <p className="text-slate-500">

            Greater DMV Metro Area

          </p>



        </div>







        {/* TITLE */}


        <div className="mt-8">


          <h2 className="text-3xl font-bold text-slate-900">

            Service Contract

          </h2>



          <p className="mt-2 text-slate-500">

            Contract #

            {" "}

            {contract.contract_number ?? "Pending"}

          </p>


        </div>








        {/* CUSTOMER */}


        <div className="mt-8 rounded-xl bg-slate-50 p-6">


          <h3 className="text-xl font-semibold">

            Customer Information

          </h3>



          <div className="mt-4 space-y-1 text-slate-700">


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


        </div>








        {/* SCOPE */}


        <div className="mt-8">


          <h3 className="text-xl font-semibold">

            1. Scope of Work

          </h3>



          <p className="mt-3 whitespace-pre-line text-slate-700">

            {
              contract.scope_of_work ||

              "No scope of work provided."
            }

          </p>


        </div>









        {/* PAYMENT */}


        <div className="mt-8">


          <h3 className="text-xl font-semibold">

            2. Payment Terms

          </h3>



          <p className="mt-3 whitespace-pre-line text-slate-700">

            {
              contract.payment_terms ||

              "No payment terms provided."
            }

          </p>


        </div>









        {/* WARRANTY */}


        <div className="mt-8">


          <h3 className="text-xl font-semibold">

            3. Warranty

          </h3>



          <p className="mt-3 whitespace-pre-line text-slate-700">

            {
              contract.warranty ||

              "No warranty information provided."
            }

          </p>


        </div>









        {/* NOTES */}


        <div className="mt-8">


          <h3 className="text-xl font-semibold">

            4. Additional Notes

          </h3>



          <p className="mt-3 whitespace-pre-line text-slate-700">

            {
              contract.notes ||

              "No additional notes."
            }

          </p>


        </div>









        {/* RELATED RECORDS */}


        <div className="mt-8 rounded-xl border border-slate-200 p-5">


          <h3 className="font-semibold">

            Related Records

          </h3>



          <p className="mt-3 text-slate-700">

            Estimate:

            {" "}

            {
              contract.estimate?.estimate_number ??
              "-"
            }

          </p>




          <p className="text-slate-700">

            Job:

            {" "}

            {
              contract.job?.job_number ??
              "-"
            }

          </p>


        </div>









        {/* SIGNATURE */}


        {
          contract.status !== "Signed" && (

            <ContractSignature

              contract={contract}

            />

          )

        }





        {
          contract.status === "Signed" && (

            <div className="mt-8 rounded-xl bg-green-50 p-5 text-green-700">

              This contract has already been signed.

            </div>

          )

        }





      </div>


    </main>

  );


}