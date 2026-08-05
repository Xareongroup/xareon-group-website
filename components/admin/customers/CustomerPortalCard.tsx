"use client";

import {
  ExternalLink,
  Copy,
  Mail,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

import { useState } from "react";

import Button from "@/components/ui/Button";



interface Props {

  portalToken: string;

  portalCreatedAt?: string | null;

  customerId: string;

}



export default function CustomerPortalCard({

  portalToken,

  portalCreatedAt,

  customerId,

}: Props) {



  const [loadingEmail, setLoadingEmail] =
    useState(false);


  const [loadingRegenerate, setLoadingRegenerate] =
    useState(false);





  function copyPortalLink(){


    const link =
      `${window.location.origin}/portal/${portalToken}`;



    navigator.clipboard.writeText(link);



    alert(
      "Portal link copied."
    );


  }







  async function sendPortalEmail(){


    try {


      setLoadingEmail(true);



      const response =
        await fetch(
          "/api/customers/send-portal-email",
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
          "Failed to send email."
        );

      }



      alert(
        "Portal access email sent successfully."
      );



    }

    catch(error:any){


      alert(
        error.message ??
        "Unable to send email."
      );


    }


    finally{

      setLoadingEmail(false);

    }


  }








  async function regeneratePortal(){



    const confirmRegenerate =
      window.confirm(
        "Generate a new portal link? The old link will stop working."
      );



    if(!confirmRegenerate){

      return;

    }





    try{


      setLoadingRegenerate(true);





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
          "Failed to regenerate portal."
        );

      }




      alert(
        "Portal link regenerated successfully."
      );



      window.location.reload();



    }


    catch(error:any){


      alert(
        error.message ??
        "Unable to regenerate portal."
      );


    }


    finally{


      setLoadingRegenerate(false);


    }


  }







  return (

    <div className="
      rounded-xl
      border
      bg-white
      p-6
      shadow-sm
    ">



      <div className="
        flex
        items-center
        justify-between
      ">


        <div>


          <h2 className="
            text-xl
            font-bold
            text-slate-900
          ">

            Customer Portal

          </h2>




          <div className="
            mt-2
            flex
            items-center
            gap-2
            text-sm
            text-green-600
          ">


            <CheckCircle
              className="h-4 w-4"
            />


            Active Portal


          </div>


        </div>


      </div>








      <div className="
        mt-6
        space-y-3
        text-sm
      ">


        <div>


          <p className="text-slate-500">

            Portal Created

          </p>


          <p className="font-medium">

            {
              portalCreatedAt
              ?
              new Date(
                portalCreatedAt
              ).toLocaleDateString()
              :
              "-"
            }

          </p>


        </div>






        <div>


          <p className="text-slate-500">

            Portal Link

          </p>



          <p className="
            break-all
            rounded-lg
            bg-slate-50
            p-3
            text-xs
            text-slate-700
          ">


            /portal/{portalToken}


          </p>



        </div>



      </div>








      <div className="
        mt-6
        grid
        gap-3
      ">



        <a

          href={`/portal/${portalToken}`}

          target="_blank"

        >


          <Button

            variant="outline"

            className="w-full justify-start"

          >


            <ExternalLink

              className="mr-2 h-4 w-4"

            />


            Open Portal


          </Button>


        </a>







        <Button

          variant="secondary"

          className="w-full justify-start"

          onClick={copyPortalLink}

        >


          <Copy

            className="mr-2 h-4 w-4"

          />


          Copy Portal Link


        </Button>








        <Button

          variant="outline"

          className="w-full justify-start"

          onClick={sendPortalEmail}

          disabled={loadingEmail}

        >


          <Mail

            className="mr-2 h-4 w-4"

          />


          {
            loadingEmail
            ?
            "Sending..."
            :
            "Send Portal Access"
          }


        </Button>








        <Button

          variant="outline"

          className="w-full justify-start"

          onClick={regeneratePortal}

          disabled={loadingRegenerate}

        >


          <RefreshCw

            className="mr-2 h-4 w-4"

          />


          {
            loadingRegenerate
            ?
            "Regenerating..."
            :
            "Regenerate Link"
          }


        </Button>





      </div>




    </div>

  );


}