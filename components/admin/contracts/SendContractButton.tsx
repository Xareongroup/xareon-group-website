"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


interface Props {
  contractId: string;
}


export default function SendContractButton({
  contractId,
}: Props) {


  const router = useRouter();


  const [loading, setLoading] =
    useState(false);



  async function sendContract() {


    try {


      setLoading(true);



      const response =
        await fetch(
          `/api/contracts/${contractId}/send`,
          {
            method: "POST",
          }
        );



      const result =
        await response.json();



      if (!response.ok) {

        throw new Error(
          result.error ??
          "Unable to send contract."
        );

      }



      alert(
        "Contract sent successfully."
      );

      window.location.reload();



      router.refresh();



    } catch(error:any) {


      alert(
        error.message
      );


    } finally {


      setLoading(false);


    }


  }





  return (

    <button

      type="button"

      onClick={sendContract}

      disabled={loading}

      className="
      rounded-xl
      bg-blue-600
      px-5
      py-3
      font-medium
      text-white
      transition
      hover:bg-blue-700
      disabled:bg-slate-400
      "

    >

      {
        loading
        ? "Sending..."
        : "Email Contract"
      }

    </button>

  );

}