"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


interface Props {
  estimateId: string;
  signed: boolean;
}


export default function CreateContractButton({
  estimateId,
  signed,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);



  async function createContract() {

    try {

      setLoading(true);


      const response =
        await fetch(
          "/api/contracts/create-from-estimate",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              estimateId,
            }),

          }
        );



      const result =
        await response.json();



      if(!response.ok){

        throw new Error(
          result.error ??
          "Unable to create contract."
        );

      }



      router.push(
        `/admin/contracts/${result.contractId}`
      );


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





  if(!signed)
    return null;



  return (

    <button

      type="button"

      onClick={createContract}

      disabled={loading}

      className="
      rounded-lg
      bg-green-600
      px-4
      py-2
      font-medium
      text-white
      transition
      hover:bg-green-700
      disabled:bg-slate-400
      "

    >

      {
        loading
        ? "Creating..."
        : "Create Contract"
      }

    </button>

  );

}