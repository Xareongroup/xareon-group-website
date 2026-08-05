"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

import { createClient } from "@/lib/supabase/client";

interface Props {
  estimate: any;
}

export default function EstimateSignature({
  estimate,
}: Props) {

  const supabase = createClient();

  const signatureRef =
    useRef<SignatureCanvas>(null);


  const [name, setName] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");



  async function approveEstimate() {

    if (!name.trim()) {

      setMessage(
        "Please enter your full name."
      );

      return;
    }



    if (
      signatureRef.current?.isEmpty()
    ) {

      setMessage(
        "Please provide your signature."
      );

      return;
    }



    try {

      setSaving(true);

      setMessage(
        "Submitting approval..."
      );



      const signature =
        signatureRef.current
          ?.getTrimmedCanvas()
          .toDataURL(
            "image/png"
          );



      // Get customer IP address

      let ipAddress = null;


      try {

        const ipResponse =
          await fetch(
            "https://api.ipify.org?format=json"
          );


        const ipData =
          await ipResponse.json();


        ipAddress =
          ipData.ip;


      } catch {

        console.log(
          "Unable to get IP address."
        );

      }





      const { error } =
        await supabase
          .from("estimates")
          .update({

            // Estimate workflow status

            status:
              "Signed",


            // Signature workflow status

            signature_status:
              "Signed",



            signed_at:
              new Date()
                .toISOString(),



            signed_by_name:
              name.trim(),



            signed_signature:
              signature,



            signed_ip:
              ipAddress,


          })

          .eq(
            "id",
            estimate.id
          );





      if (error) {

        throw error;

      }





      // Generate signed PDF

const pdfResponse =
  await fetch(
    `/api/estimates/${estimate.id}/signed-pdf`,
    {
      method: "POST",
    }
  );


const pdfResult =
  await pdfResponse.json();



if (!pdfResponse.ok) {

  throw new Error(
    pdfResult.error ??
    "Failed generating signed PDF."
  );

}



setMessage(
  "Estimate approved and signed PDF created successfully!"
);



    } catch(error) {


      console.error(
        "SIGNATURE ERROR:",
        error
      );


      setMessage(
        "Unable to approve estimate."
      );


    } finally {


      setSaving(false);


    }

  }





  function clearSignature() {

    signatureRef.current?.clear();

  }






  return (

    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">


      <h3 className="mb-4 text-xl font-semibold">
        Customer Approval
      </h3>




      <p className="mb-5 text-sm text-slate-600">

        By signing below, you agree to approve this estimate and authorize XAREON GROUP to proceed with the work described.

      </p>





      <label className="mb-2 block text-sm font-medium">

        Full Name

      </label>


      <input

        className="
        mb-5
        w-full
        rounded-lg
        border
        border-slate-300
        p-3
        "

        placeholder="Enter your full name"

        value={name}

        onChange={(e)=>
          setName(
            e.target.value
          )
        }

      />






      <label className="mb-2 block text-sm font-medium">

        Signature

      </label>




      <div className="overflow-hidden rounded-lg border border-slate-300 bg-white">

        <SignatureCanvas

          ref={signatureRef}

          canvasProps={{
            className:
              "w-full h-48"
          }}

        />


      </div>





      <button

        type="button"

        onClick={clearSignature}

        className="
        mt-3
        rounded-lg
        border
        border-slate-300
        px-4
        py-2
        text-sm
        hover:bg-slate-50
        "

      >

        Clear Signature

      </button>






      <button

        type="button"

        onClick={approveEstimate}

        disabled={saving}

        className="
        mt-5
        w-full
        rounded-lg
        bg-green-600
        px-4
        py-3
        font-semibold
        text-white
        transition
        hover:bg-green-700
        disabled:cursor-not-allowed
        disabled:bg-slate-400
        "

      >

        {
          saving
          ? "Submitting..."
          : "Approve & Sign Estimate"
        }


      </button>






      {
        message && (

          <p className="mt-4 text-sm text-slate-600">

            {message}

          </p>

        )
      }





    </div>

  );

}