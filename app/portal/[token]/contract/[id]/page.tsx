import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";


interface Props {

  params: Promise<{
    token: string;
    id: string;
  }>;

}



export default async function PortalContractPage({
  params,
}: Props) {


  const {
    token,
    id,
  } = await params;



  const supabase =
    await createClient();







  const {
    data: customer,
    error: customerError,
  } =
    await supabase

      .from("customers")

      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        address
      `)

      .eq(
        "portal_token",
        token
      )

      .single();





  if(customerError || !customer){

    notFound();

  }









  const {
    data: contract,
    error: contractError,
  } =
    await supabase

      .from("contracts")

      .select(`
        id,
        contract_number,
        status,
        terms,
        notes,
        issue_date,
        created_at,
        signed_at,
        signed_by_name,
        signature_status,
        signature_token
      `)

      .eq(
        "id",
        id
      )

      .eq(
        "customer_id",
        customer.id
      )

      .single();





  if(contractError || !contract){

    notFound();

  }









  return (

    <div className="
      mx-auto
      max-w-5xl
      space-y-8
      p-8
    ">





      <a
        href={`/portal/${token}`}
        className="
          text-sm
          font-medium
          text-blue-600
          hover:underline
        "
      >

        ← Back to Customer Portal

      </a>








      <div className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
      ">


        <h1 className="
          text-3xl
          font-bold
          text-slate-900
        ">

          XAREON GROUP Service Contract

        </h1>




        <p className="mt-2 text-slate-500">

          Contract #

          {" "}

          {contract.contract_number}

        </p>





        <div className="mt-4">

          <span className="
            rounded-full
            bg-blue-100
            px-3
            py-1
            text-sm
            font-semibold
            text-blue-700
          ">

            {contract.status}

          </span>


        </div>


      </div>









      <div className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
      ">


        <h2 className="
          mb-4
          text-xl
          font-bold
        ">

          Customer Information

        </h2>



        <p className="font-semibold">

          {customer.first_name}

          {" "}

          {customer.last_name}

        </p>



        <p className="text-slate-600">

          {customer.email}

        </p>



        <p className="text-slate-600">

          {customer.phone}

        </p>



        <p className="text-slate-600">

          {customer.address}

        </p>


      </div>









      <div className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
      ">


        <h2 className="
          mb-4
          text-xl
          font-bold
        ">

          Contract Information

        </h2>



        <div className="space-y-3">



          <div className="flex justify-between">

            <span className="text-slate-500">

              Issue Date

            </span>


            <span>

              {
                contract.issue_date
                ?
                new Date(
                  contract.issue_date
                ).toLocaleDateString()
                :
                "-"
              }

            </span>


          </div>





          <div className="flex justify-between">

            <span className="text-slate-500">

              Created

            </span>


            <span>

              {
                new Date(
                  contract.created_at
                ).toLocaleDateString()
              }

            </span>


          </div>


        </div>


      </div>

      




      <div className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
      ">


        <h2 className="
          mb-4
          text-xl
          font-bold
        ">

          Contract Terms

        </h2>



        <p className="
          whitespace-pre-line
          text-slate-600
        ">

          {
            contract.terms
            ||
            "No contract terms provided."
          }

        </p>


      </div>









      <div className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
      ">


        <h2 className="
          mb-4
          text-xl
          font-bold
        ">

          Notes

        </h2>



        <p className="
          whitespace-pre-line
          text-slate-600
        ">

          {
            contract.notes
            ||
            "No notes available."
          }

        </p>


      </div>









      <div className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
      ">


        <h2 className="
          mb-4
          text-xl
          font-bold
        ">

          Signature Status

        </h2>




        <p>

          Status:

          {" "}

          <span className="font-semibold">

            {
              contract.signature_status
              ??
              contract.status
            }

          </span>


        </p>





        {
          contract.signed_at

          ?

          <div className="mt-3 text-green-700">

            Signed by:

            {" "}

            {contract.signed_by_name ?? "Customer"}


            <br />

            Date:

            {" "}

            {
              new Date(
                contract.signed_at
              ).toLocaleDateString()
            }


          </div>


          :

          null

        }


      </div>









      <div className="
        rounded-xl
        border
        bg-blue-50
        p-6
      ">


        <h2 className="
          text-xl
          font-bold
        ">

          Actions

        </h2>




        <div className="mt-5 flex flex-wrap gap-3">





          <a

            href={`/api/contracts/${contract.id}/pdf`}

            target="_blank"

            className="
              rounded-lg
              bg-blue-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "

          >

            Download Contract PDF

          </a>








          {
            !contract.signed_at && contract.signature_token

            ?

            <a

              href={`/sign/contract/${contract.signature_token}`}

              className="
                rounded-lg
                border
                border-blue-600
                px-6
                py-3
                font-semibold
                text-blue-600
                transition
                hover:bg-blue-100
              "

            >

              Sign Contract

            </a>


            :

            null

          }





        </div>


      </div>






    </div>

  );


}