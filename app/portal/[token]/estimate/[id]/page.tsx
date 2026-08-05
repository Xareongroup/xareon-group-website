import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";



interface Props {

  params: Promise<{
    token: string;
    id: string;
  }>;

}





export default async function PortalEstimatePage({
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
    data: estimate,
    error: estimateError,
  } =
    await supabase

      .from("estimates")

      .select(`
        id,
        estimate_number,
        status,
        issue_date,
        expiration_date,
        subtotal,
        tax,
        total,
        discount,
        terms,
        notes,
        signature_status,
        signature_token,
        signed_at,
        signed_by_name
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








  if(estimateError || !estimate){

    notFound();

  }









  /*
    Record estimate view activity

    This happens after:
    - Portal token is verified
    - Estimate belongs to customer
    - Estimate exists

  */


  await supabase

    .from("customer_activity")

    .insert({

      customer_id:
        customer.id,

      activity_type:
        "estimate_viewed",

      title:
        `Estimate #${estimate.estimate_number} Viewed`,

      description:
        `Customer viewed estimate #${estimate.estimate_number}.`,

    });









  const {
    data: items,
  } =
    await supabase

      .from("estimate_items")

      .select(`
        id,
        description,
        quantity,
        unit,
        unit_price,
        discount,
        total
      `)

      .eq(
        "estimate_id",
        estimate.id
      )

      .order(
        "sort_order"
      );








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
        ">

          XAREON GROUP Estimate

        </h1>


        <p className="mt-2 text-slate-500">

          Estimate #
          {" "}
          {estimate.estimate_number}

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

            {estimate.status}

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
        overflow-hidden
        rounded-xl
        border
        bg-white
        shadow-sm
      ">


        <div className="border-b p-5">


          <h2 className="text-xl font-bold">

            Estimate Items

          </h2>


        </div>





        <table className="w-full">


          <thead className="bg-slate-100">

            <tr>

              <th className="p-3 text-left">
                Description
              </th>

              <th className="p-3 text-center">
                Qty
              </th>

              <th className="p-3 text-center">
                Unit Price
              </th>

              <th className="p-3 text-center">
                Total
              </th>

            </tr>

          </thead>





          <tbody>


          {
            items?.map((item)=>(


              <tr
                key={item.id}
                className="border-t"
              >


                <td className="p-3">

                  {item.description}

                </td>



                <td className="p-3 text-center">

                  {item.quantity}
                  {" "}
                  {item.unit}

                </td>



                <td className="p-3 text-center">

                  ${Number(item.unit_price ?? 0).toFixed(2)}

                </td>



                <td className="p-3 text-center font-semibold">

                  ${Number(item.total ?? 0).toFixed(2)}

                </td>


              </tr>


            ))
          }


          </tbody>


        </table>


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

          Estimate Summary

        </h2>



        <div className="space-y-3">


          <div className="flex justify-between">

            <span>
              Subtotal
            </span>

            <span>
              ${Number(estimate.subtotal ?? 0).toFixed(2)}
            </span>

          </div>





          <div className="flex justify-between">

            <span>
              Tax
            </span>

            <span>
              ${Number(estimate.tax ?? 0).toFixed(2)}
            </span>

          </div>





          <div className="
            flex
            justify-between
            border-t
            pt-3
            text-lg
            font-bold
          ">

            <span>
              Total
            </span>


            <span>
              ${Number(estimate.total ?? 0).toFixed(2)}
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
          text-xl
          font-bold
          mb-3
        ">

          Terms & Notes

        </h2>



        <p className="whitespace-pre-line text-slate-600">

          {estimate.terms || "No terms provided."}

        </p>



        <p className="
          mt-4
          whitespace-pre-line
          text-slate-600
        ">

          {estimate.notes || "No additional notes."}

        </p>


      </div>









      <div className="
        rounded-xl
        border
        bg-blue-50
        p-6
      ">


        <h2 className="text-xl font-bold">

          Approval

        </h2>





        <p className="mt-2">

          Signature Status:
          {" "}

          <strong>
            {estimate.signature_status ?? "Pending"}
          </strong>

        </p>







        {
          estimate.signature_status === "Signed"

          ?


          <div className="mt-4 text-green-700">

            ✓ Signed by {estimate.signed_by_name}

          </div>



          :



          <a

            href={`/sign/estimate/${estimate.signature_token}`}

            className="
            mt-5
            inline-block
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

            Approve & Sign

          </a>


        }



      </div>






    </div>

  );


}