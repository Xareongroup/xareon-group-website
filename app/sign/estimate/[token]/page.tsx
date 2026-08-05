import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EstimateSignature from "@/components/public/EstimateSignature";

interface Props {
  params: Promise<{
    token: string;
  }>;
}


export default async function EstimateSigningPage({
  params,
}: Props) {

  const { token } = await params;

  const supabase = await createClient();


  const { data: estimate } =
    await supabase
      .from("estimates")
      .select(`
        *,
        customers(
          first_name,
          last_name,
          email,
          phone,
          address
        ),
        estimate_items(
          description,
          quantity,
          unit_price,
          total
        )
      `)
      .eq(
        "signature_token",
        token
      )
      .single();



  if (!estimate) {
    notFound();
  }



  return (

    <main className="min-h-screen bg-slate-100 p-6">

      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">


        <h1 className="text-3xl font-bold">
          XAREON GROUP
        </h1>


        <p className="mt-2 text-slate-500">
          Professional Home Repair & Installation Services
        </p>



        <hr className="my-6"/>



        <h2 className="text-2xl font-semibold">
          Estimate Review
        </h2>



        <div className="mt-6 grid gap-4 md:grid-cols-2">


          <div>

            <p className="font-semibold">
              Customer
            </p>

            <p>
              {estimate.customers?.first_name}
              {" "}
              {estimate.customers?.last_name}
            </p>

          </div>



          <div>

            <p className="font-semibold">
              Estimate Status
            </p>

            <p>
              {estimate.status}
            </p>

          </div>


        </div>




        <div className="mt-8">


          <h3 className="text-xl font-semibold">
            Services
          </h3>



          <div className="mt-4 space-y-3">


          {estimate.estimate_items?.map(
            (item:any,index:number)=>(

              <div
                key={index}
                className="flex justify-between border-b pb-3"
              >

                <span>
                  {item.description}
                </span>


                <span>
                  $
                  {item.total}
                </span>


              </div>

            )
          )}


          </div>


        </div>




        <div className="mt-8 rounded-xl bg-slate-50 p-5">


          <div className="flex justify-between">

            <span>
              Subtotal
            </span>

            <span>
              ${estimate.subtotal}
            </span>

          </div>



          <div className="flex justify-between">

            <span>
              Tax
            </span>

            <span>
              ${estimate.tax}
            </span>

          </div>



          <div className="mt-3 flex justify-between text-xl font-bold">

            <span>
              Total
            </span>


            <span>
              ${estimate.total}
            </span>

          </div>


        </div>





        <div className="mt-8">

          <h3 className="font-semibold">
            Terms & Conditions
          </h3>


          <p className="mt-3 whitespace-pre-line text-slate-600">
            {estimate.terms}
          </p>


        </div>





        <EstimateSignature
  estimate={estimate}
/>



      </div>


    </main>

  );
}