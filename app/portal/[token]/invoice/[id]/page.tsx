import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";


interface Props {

  params: Promise<{
    token: string;
    id: string;
  }>;

}



export default async function PortalInvoicePage({
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
    data: invoice,
    error: invoiceError,
  } =
    await supabase

      .from("invoices")

      .select(`
        id,
        invoice_number,
        status,
        issue_date,
        due_date,
        subtotal,
        tax,
        total,
        amount_paid,
        balance_due,
        payment_method,
        payment_date,
        notes:payment_notes
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





  if(invoiceError || !invoice){

    notFound();

  }









  const {
    data: items,
  } =
    await supabase

      .from("invoice_items")

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
        "invoice_id",
        invoice.id
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
          text-slate-900
        ">

          XAREON GROUP Invoice

        </h1>




        <p className="mt-2 text-slate-500">

          Invoice #

          {" "}

          {invoice.invoice_number}

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

            {invoice.status}

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

            Invoice Items

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

          Invoice Summary

        </h2>




        <div className="space-y-3">



          <div className="flex justify-between">

            <span>
              Subtotal
            </span>


            <span>

              ${Number(invoice.subtotal ?? 0).toFixed(2)}

            </span>


          </div>





          <div className="flex justify-between">

            <span>
              Tax
            </span>


            <span>

              ${Number(invoice.tax ?? 0).toFixed(2)}

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

              ${Number(invoice.total ?? 0).toFixed(2)}

            </span>


          </div>





          <div className="
            flex
            justify-between
            text-lg
            font-bold
            text-blue-700
          ">


            <span>
              Balance Due
            </span>


            <span>

              ${Number(invoice.balance_due ?? 0).toFixed(2)}

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

          Payment Information

        </h2>




        <div className="space-y-3">


          <div className="flex justify-between">

            <span className="text-slate-500">

              Amount Paid

            </span>


            <span>

              ${Number(invoice.amount_paid ?? 0).toFixed(2)}

            </span>


          </div>





          <div className="flex justify-between">

            <span className="text-slate-500">

              Payment Method

            </span>


            <span>

              {invoice.payment_method ?? "-"}

            </span>


          </div>





          <div className="flex justify-between">

            <span className="text-slate-500">

              Payment Date

            </span>


            <span>

              {
                invoice.payment_date
                ?
                new Date(
                  invoice.payment_date
                ).toLocaleDateString()
                :
                "-"
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
          mb-3
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
            invoice.notes
            ||
            "No notes provided."
          }

        </p>


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

            href={`/api/invoices/${invoice.id}/pdf`}

            target="_blank"

            className="
              rounded-lg
              bg-blue-600
              px-6
              py-3
              font-semibold
              text-white
              hover:bg-blue-700
            "

          >

            Download Invoice PDF

          </a>






        </div>


      </div>






    </div>

  );

} 
