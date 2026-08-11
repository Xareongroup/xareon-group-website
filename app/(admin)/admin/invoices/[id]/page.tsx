import { notFound } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import {
  mapInvoiceToPdf,
  mapInvoiceItemsToPdf,
} from "@/lib/invoices/pdfMapper";

import {
  checkInvoiceOverdue,
} from "@/lib/invoices/checkOverdue";

import InvoiceDownloadButton
  from "@/components/admin/invoices/pdf/InvoiceDownloadButton";

import EmailInvoiceButton
  from "@/components/admin/invoices/EmailInvoiceButton";

import RecordPaymentButton
  from "@/components/admin/invoices/RecordPaymentButton";

import PrintInvoiceButton
  from "@/components/admin/invoices/PrintInvoiceButton";


interface Props {
  params: Promise<{
    id: string;
  }>;
}



export default async function InvoicePage({
  params,
}: Props) {

  const { id } = await params;


  const supabase =
    await createClient();




  const {
    data: invoice,
    error,
  } = await supabase

    .from("invoices")

    .select(`
      *,
      customers (
        id,
        first_name,
        last_name,
        email,
        phone
      )
    `)

    .eq(
      "id",
      id
    )

    .single();





  if (error || !invoice) {

    notFound();

  }







  const {
    data: items,

  } = await supabase

    .from("invoice_items")

    .select("*")

    .eq(
      "invoice_id",
      invoice.id
    )

    .order(
      "sort_order"
    );








  const {
    data: payments,

  } = await supabase

      .from("payments")

    .select("*")

    .eq(
      "invoice_id",
      invoice.id
    )

    .order(
      "payment_date",
      {
        ascending:false,
      }
    );







  const overdue = checkInvoiceOverdue(invoice.due_date ?? null, invoice.status ?? "Draft");







  const pdfInvoice =
    mapInvoiceToPdf(
      invoice
    );



  const pdfItems =
    mapInvoiceItemsToPdf(
      items ?? []
    );








  return (

    <div className="mx-auto max-w-5xl space-y-8 p-8">



      <div className="flex items-center justify-between">



        <div>


          <h1 className="text-4xl font-bold">
            Invoice
          </h1>



          <p className="mt-2 text-slate-500">
            {invoice.invoice_number}
          </p>


        </div>





        <div className="rounded-lg border bg-white px-6 py-4 text-right shadow-sm">


          <div className="text-xl font-bold">
            XAREON Group
          </div>


          <div className="text-sm text-slate-500">
            Professional Home Repair &
            Installation Services
          </div>


        </div>



      </div>








      <div className="grid gap-6 md:grid-cols-2">



        <div className="rounded-xl border bg-white p-6 shadow-sm">


          <h2 className="mb-4 text-lg font-bold">
            Bill To
          </h2>



          <div className="space-y-2">


            <div className="font-semibold text-slate-900">

              {invoice.customers
                ? `${invoice.customers.first_name ?? ""} ${invoice.customers.last_name ?? ""}`.trim()
                : "No Customer"}

            </div>



            {
              invoice.customers?.email && (

                <div className="text-slate-600">

                  {invoice.customers.email}

                </div>

              )
            }





            {
              invoice.customers?.phone && (

                <div className="text-slate-600">

                  {invoice.customers.phone}

                </div>

              )
            }


          </div>


        </div>








        <div className="rounded-xl border bg-white p-6 shadow-sm">


          <h2 className="mb-4 text-lg font-bold">
            Invoice Details
          </h2>



          <div className="space-y-3">



            <div className="flex justify-between">


              <span className="text-slate-500">
                Status
              </span>



              <span className="font-semibold">

                {
                  overdue
                  ?
                  "Overdue"
                  :
                  invoice.status
                }

              </span>


            </div>





            <div className="flex justify-between">

              <span className="text-slate-500">
                Issue Date
              </span>


              <span>
                {invoice.issue_date}
              </span>


            </div>





            <div className="flex justify-between">

              <span className="text-slate-500">
                Due Date
              </span>


              <span>
                {invoice.due_date}
              </span>


            </div>




            {
              invoice.estimate_id && (

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Estimate
                  </span>


                  <span>
                    {invoice.estimate_id}
                  </span>


                </div>

              )
            }





            {
              invoice.job_id && (

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Job
                  </span>


                  <span>
                    {invoice.job_id}
                  </span>


                </div>

              )
            }



          </div>


        </div>



      </div>






      <div className="rounded-xl border bg-white shadow-sm">


        <div className="border-b px-6 py-4">


          <h2 className="text-xl font-bold">
            Invoice Items
          </h2>


        </div>

                <div className="overflow-x-auto">


          <table className="w-full">


            <thead className="bg-slate-100">


              <tr>


                <th className="px-4 py-3 text-left">
                  Description
                </th>


                <th className="px-4 py-3 text-center">
                  Qty
                </th>


                <th className="px-4 py-3 text-center">
                  Unit
                </th>


                <th className="px-4 py-3 text-right">
                  Unit Price
                </th>


                <th className="px-4 py-3 text-right">
                  Discount
                </th>


                <th className="px-4 py-3 text-right">
                  Total
                </th>


              </tr>


            </thead>





            <tbody>


              {
                items?.map((item) => (


                  <tr

                    key={item.id}

                    className="border-b"

                  >


                    <td className="px-4 py-3">
                      {item.description}
                    </td>


                    <td className="px-4 py-3 text-center">
                      {item.quantity}
                    </td>


                    <td className="px-4 py-3 text-center">
                      {item.unit}
                    </td>


                    <td className="px-4 py-3 text-right">
                      ${Number(item.unit_price).toFixed(2)}
                    </td>


                    <td className="px-4 py-3 text-right">
                      ${Number(item.discount).toFixed(2)}
                    </td>


                    <td className="px-4 py-3 text-right font-semibold">
                      ${Number(item.total).toFixed(2)}
                    </td>


                  </tr>


                ))
              }


            </tbody>


          </table>


        </div>


      </div>








      <div className="grid gap-6 md:grid-cols-2">



        <div className="rounded-xl border bg-white p-6 shadow-sm">


          <h2 className="mb-4 text-lg font-bold">
            Notes
          </h2>



          <p className="whitespace-pre-line text-slate-600">

            {invoice.payment_notes || "No payment notes provided."}

          </p>


        </div>








        <div className="rounded-xl border bg-white p-6 shadow-sm">


          <h2 className="mb-4 text-lg font-bold">
            Totals
          </h2>



          <div className="space-y-3">



            <div className="flex justify-between">

              <span>
                Subtotal
              </span>

              <span>
                ${Number(invoice.subtotal).toFixed(2)}
              </span>

            </div>





            <div className="flex justify-between">

              <span>
                Tax
              </span>

              <span>
                ${Number(invoice.tax).toFixed(2)}
              </span>

            </div>





            <div className="flex justify-between">

              <span>
                Total
              </span>

              <span className="font-semibold">
                ${Number(invoice.total).toFixed(2)}
              </span>

            </div>





            <div className="flex justify-between border-t pt-3 text-lg font-bold text-blue-700">

              <span>
                Balance Due
              </span>


              <span>
                ${Number(invoice.balance_due).toFixed(2)}
              </span>


            </div>








            <div className="mt-6 border-t pt-5">


              <h3 className="mb-4 font-semibold text-slate-900">
                Payment Status
              </h3>



              <div className="space-y-3">



                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Status
                  </span>


                  <span className="font-semibold">

                    {
                      overdue
                      ?
                      "Overdue"
                      :
                      invoice.status
                    }

                  </span>


                </div>





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








            <div className="mt-6">


              <RecordPaymentButton

                invoiceId={invoice.id}

                balanceDue={
                  Number(invoice.balance_due ?? 0)
                }

              />


            </div>







            <div className="mt-6 rounded-xl border bg-slate-50 p-5">


              <h3 className="mb-4 font-semibold text-slate-900">
                Payment History
              </h3>




              {
                payments && payments.length > 0

                ?

                <div className="space-y-4">


                  {
                    payments.map((payment:any)=>(


                      <div

                        key={payment.id}

                        className="rounded-lg border bg-white p-4"

                      >


                        <div className="flex justify-between">


                          <span className="font-semibold">

                            ${Number(payment.amount).toFixed(2)}

                          </span>



                          <span className="text-sm text-slate-500">

                            {
                              new Date(
                                payment.payment_date
                              ).toLocaleDateString()
                            }

                          </span>


                        </div>





                        <p className="mt-2 text-sm text-slate-600">

                          Method:
                          {" "}
                          {payment.payment_method ?? "-"}

                        </p>





                        {
                          payment.notes && (

                            <p className="mt-1 text-sm text-slate-600">

                              Notes:
                              {" "}
                              {payment.notes}

                            </p>

                          )
                        }


                      </div>


                    ))
                  }


                </div>


                :

                <p className="text-sm text-slate-500">

                  No payments recorded yet.

                </p>


              }


            </div>






          </div>


        </div>


      </div>









      <div className="flex flex-wrap gap-3">



        <EmailInvoiceButton

          invoiceId={invoice.id}

        />





        <Link
          href={`/admin/invoices/${invoice.id}/edit`}

          className="
          rounded-lg
          bg-blue-600
          px-5
          py-2.5
          font-medium
          text-white
          transition
          hover:bg-blue-700
          "

        >

          Edit Invoice

        </Link>





        <Link

          href={`/admin/invoices/${invoice.id}/preview`}

          className="
          rounded-lg
          border
          border-blue-600
          px-5
          py-2.5
          font-medium
          text-blue-600
          transition
          hover:bg-blue-50
          "

        >

          Preview

        </Link>





        <PrintInvoiceButton
          className="
          rounded-lg
          border
          border-slate-300
          bg-white
          px-5
          py-2.5
          font-medium
          transition
          hover:bg-slate-50
          "
        />





        <InvoiceDownloadButton

          invoice={pdfInvoice}

          items={pdfItems}

        />



      </div>





    </div>


  );


}
