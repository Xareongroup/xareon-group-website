"use client";

import { useState } from "react";

import {
  RefreshCw,
} from "lucide-react";

import Button from "@/components/ui/Button";



interface Props {

  customerId: string;

}



export default function RegeneratePortalButton({
  customerId,
}: Props) {


  const [loading, setLoading] =
    useState(false);



  async function regeneratePortal(){


    const confirmed =
      window.confirm(
        "Are you sure you want to generate a new portal link? The old link will stop working."
      );


    if(!confirmed){

      return;

    }





    try {


      setLoading(true);




      const response =
        await fetch(
          "/api/customers/regenerate-portal",
          {

            method:"POST",

            headers:{
              "Content-Type":"application/json",
            },

            body:JSON.stringify({
              customerId,
            }),

          }
        );





      const result =
        await response.json();





      if(!response.ok){

        throw new Error(
          result.error ||
          "Unable to regenerate portal."
        );

      }




      alert(
        "Customer portal link regenerated successfully."
      );



      window.location.reload();



    }


    catch(error:any){


      alert(
        error.message ??
        "Failed to regenerate portal."
      );


    }


    finally{


      setLoading(false);


    }


  }






  return (

    <Button

      variant="outline"

      className="w-full justify-start"

      onClick={regeneratePortal}

      disabled={loading}

    >

      <RefreshCw
        className="
        mr-2
        h-4
        w-4
        "
      />


      {
        loading
        ?
        "Regenerating..."
        :
        "Regenerate Portal Link"
      }


    </Button>

  );


}