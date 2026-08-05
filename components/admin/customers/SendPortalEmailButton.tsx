"use client";

import { useState } from "react";

import {
  Mail,
} from "lucide-react";

import Button from "@/components/ui/Button";


interface Props {

  customerId: string;

}



export default function SendPortalEmailButton({
  customerId,
}: Props) {


  const [loading, setLoading] =
    useState(false);



  async function sendEmail() {


    try {

      setLoading(true);


      const response =
        await fetch(
          "/api/customers/send-portal-email",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              customerId,
            }),

          }
        );



      const result =
        await response.json();



      if(!response.ok){

        throw new Error(
          result.error ||
          "Unable to send email."
        );

      }



      alert(
        "Portal access email sent successfully."
      );


    }

    catch(error:any){

      alert(
        error.message
        ??
        "Failed to send portal email."
      );

    }


    finally {

      setLoading(false);

    }


  }





  return (

    <Button

      variant="outline"

      className="w-full justify-start"

      onClick={sendEmail}

      disabled={loading}

    >

      <Mail className="mr-2 h-4 w-4" />


      {
        loading
        ?
        "Sending..."
        :
        "Send Portal Access"
      }


    </Button>

  );

}