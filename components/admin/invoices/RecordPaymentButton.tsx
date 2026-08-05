"use client";

import { useState } from "react";


interface Props {

  invoiceId: string;

  balanceDue: number;

}



export default function RecordPaymentButton({

  invoiceId,

  balanceDue,

}: Props) {


  const [loading, setLoading] =
    useState(false);


  const [amount, setAmount] =
    useState("");



  const [method, setMethod] =
    useState("Cash");



  const [notes, setNotes] =
    useState("");



  const [open, setOpen] =
    useState(false);





  async function savePayment(){


    if(!amount){

      alert(
        "Enter payment amount."
      );

      return;

    }




    try {


      setLoading(true);



      const response =
        await fetch(
          `/api/invoices/${invoiceId}/payment`,
          {

            method:"POST",

            headers:{
              "Content-Type":"application/json",
            },


            body:JSON.stringify({

              amount:

                Number(amount),


              method,


              notes,

            }),

          }

        );





      const result =
        await response.json();





      if(!response.ok){

        throw new Error(
          result.error ??
          "Unable to record payment."
        );

      }





      alert(
        "Payment recorded successfully."
      );



      window.location.reload();



    }

    catch(error:any){


      alert(
        error.message
      );


    }

    finally{


      setLoading(false);


    }


  }






  return (

    <div>


      <button

        type="button"

        onClick={() => setOpen(!open)}

        className="
        rounded-lg
        bg-green-600
        px-5
        py-2.5
        font-medium
        text-white
        hover:bg-green-700
        "

      >

        Record Payment

      </button>






      {
        open && (

          <div className="
          mt-4
          rounded-xl
          border
          bg-white
          p-5
          shadow-sm
          ">


            <h3 className="
            mb-4
            font-semibold
            ">

              Payment Details

            </h3>




            <input

              type="number"

              placeholder="Payment amount"

              value={amount}

              onChange={(e)=>
                setAmount(e.target.value)
              }

              className="
              mb-3
              w-full
              rounded-lg
              border
              p-3
              "

            />





            <select

              value={method}

              onChange={(e)=>
                setMethod(e.target.value)
              }

              className="
              mb-3
              w-full
              rounded-lg
              border
              p-3
              "

            >

              <option>
                Cash
              </option>

              <option>
                Check
              </option>

              <option>
                Credit Card
              </option>

              <option>
                Bank Transfer
              </option>

              <option>
                Other
              </option>


            </select>






            <textarea

              placeholder="Payment notes"

              value={notes}

              onChange={(e)=>
                setNotes(e.target.value)
              }

              className="
              mb-3
              w-full
              rounded-lg
              border
              p-3
              "

            />






            <button

              type="button"

              onClick={savePayment}

              disabled={loading}

              className="
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              font-medium
              text-white
              hover:bg-blue-700
              disabled:bg-slate-400
              "

            >

              {
                loading
                ? "Saving..."
                : "Save Payment"
              }


            </button>



          </div>

        )
      }


    </div>

  );

}