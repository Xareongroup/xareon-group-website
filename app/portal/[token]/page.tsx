import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";


interface Props {

  params: Promise<{
    token: string;
  }>;

}



export default async function CustomerPortalPage({
  params,
}: Props) {


  const { token } = await params;


  const supabase =
    await createClient();





  const {
    data: customer,
    error,
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





  if(error || !customer){

    notFound();

  }







  const {
    data: estimates,
  } =
    await supabase

      .from("estimates")

      .select(`
        id,
        estimate_number,
        status,
        total,
        created_at
      `)

      .eq(
        "customer_id",
        customer.id
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      );








  const {
    data: contracts,
  } =
    await supabase

      .from("contracts")

      .select(`
        id,
        contract_number,
        status,
        issue_date,
        created_at
      `)

      .eq(
        "customer_id",
        customer.id
      )

      .order(
        "issue_date",
        {
          ascending:false
        }
      );








  const {
    data: invoices,
  } =
    await supabase

      .from("invoices")

      .select(`
        id,
        invoice_number,
        status,
        total,
        balance_due,
        due_date
      `)

      .eq(
        "customer_id",
        customer.id
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      );








  return (

    <div className="
      mx-auto
      max-w-5xl
      space-y-8
      p-8
    ">






      {/* Customer Header */}


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

          Welcome,
          {" "}
          {customer.first_name} {customer.last_name}

        </h1>



        <p className="mt-2 text-slate-600">

          XAREON Customer Portal

        </p>




        <div className="
          mt-4
          text-sm
          text-slate-500
        ">


          <p>
            {customer.email}
          </p>


          <p>
            {customer.phone}
          </p>


          <p>
            {customer.address}
          </p>


        </div>


      </div>









      {/* Estimates */}


      <section>


        <h2 className="
          mb-4
          text-xl
          font-bold
        ">

          Estimates

        </h2>




        <div className="space-y-4">


        {
          estimates && estimates.length > 0

          ?

          estimates.map((estimate)=>(


            <div
              key={estimate.id}
              className="
                rounded-xl
                border
                bg-white
                p-5
                shadow-sm
              "
            >


              <p className="
                font-semibold
                text-lg
              ">

                {estimate.estimate_number}

              </p>




              <p className="text-sm text-slate-600">

                Status:
                {" "}

                <span className="font-semibold">

                  {estimate.status}

                </span>

              </p>




              <p>

                Total:

                {" "}

                ${Number(estimate.total ?? 0).toFixed(2)}

              </p>




              <a

                href={`/portal/${token}/estimate/${estimate.id}`}

                className="
                  mt-4
                  inline-block
                  rounded-lg
                  bg-blue-600
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-blue-700
                "

              >

                View Estimate

              </a>



            </div>


          ))

          :


          <div className="
            rounded-xl
            border
            bg-white
            p-5
            text-slate-500
          ">

            No estimates available.

          </div>


        }


        </div>


      </section>

           {/* Contracts */}


      <section>


        <h2 className="
          mb-4
          text-xl
          font-bold
        ">

          Contracts

        </h2>





        <div className="space-y-4">


        {
          contracts && contracts.length > 0

          ?

          contracts.map((contract)=>(


            <div
              key={contract.id}
              className="
                rounded-xl
                border
                bg-white
                p-5
                shadow-sm
              "
            >


              <p className="
                font-semibold
                text-lg
              ">

                {contract.contract_number}

              </p>




              <p className="text-sm text-slate-600">

                Status:
                {" "}

                <span className="font-semibold">

                  {contract.status}

                </span>

              </p>





              <p className="
                mt-1
                text-sm
                text-slate-600
              ">

                Issued:

                {" "}

                {
                  contract.issue_date

                  ?

                  new Date(
                    contract.issue_date
                  ).toLocaleDateString()

                  :

                  "-"
                }


              </p>





              <a

                href={`/portal/${token}/contract/${contract.id}`}

                target="_blank"

                className="
                  mt-4
                  inline-block
                  rounded-lg
                  bg-blue-600
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-blue-700
                "

              >

                View Contract PDF

              </a>



            </div>


          ))


          :


          <div className="
            rounded-xl
            border
            bg-white
            p-5
            text-slate-500
          ">

            No contracts available.

          </div>


        }


        </div>


      </section>









      {/* Invoices */}


      <section>


        <h2 className="
          mb-4
          text-xl
          font-bold
        ">

          Invoices

        </h2>





        <div className="space-y-4">


        {
          invoices && invoices.length > 0

          ?

          invoices.map((invoice)=>(


            <div
              key={invoice.id}
              className="
                rounded-xl
                border
                bg-white
                p-5
                shadow-sm
              "
            >



              <p className="
                font-semibold
                text-lg
              ">

                {invoice.invoice_number}

              </p>





              <p className="text-sm text-slate-600">

                Status:
                {" "}

                <span className="font-semibold">

                  {invoice.status}

                </span>

              </p>





              <p>

                Total:

                {" "}

                ${Number(invoice.total ?? 0).toFixed(2)}

              </p>





              <p>

                Balance Due:

                {" "}

                ${Number(invoice.balance_due ?? 0).toFixed(2)}

              </p>




            </div>


          ))


          :


          <div className="
            rounded-xl
            border
            bg-white
            p-5
            text-slate-500
          ">

            No invoices available.

          </div>


        }


        </div>


      </section>







    </div>

  );

} 