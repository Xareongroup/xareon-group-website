"use client";

import {
  ExternalLink,
  Copy,
} from "lucide-react";

import Button from "@/components/ui/Button";


interface Props {

  portalToken: string;

}



export default function CustomerPortalButtons({
  portalToken,
}: Props) {


  function copyPortalLink(){

    const link =
      `${window.location.origin}/portal/${portalToken}`;


    navigator.clipboard.writeText(link);


    alert(
      "Customer portal link copied."
    );

  }





  return (

    <div className="space-y-3">


      <a

        href={`/portal/${portalToken}`}

        target="_blank"

      >

        <Button

          variant="outline"

          className="w-full justify-start"

        >

          <ExternalLink className="mr-2 h-4 w-4" />

          Open Customer Portal

        </Button>


      </a>





      <Button

        variant="secondary"

        className="w-full justify-start"

        onClick={copyPortalLink}

      >

        <Copy className="mr-2 h-4 w-4" />

        Copy Portal Link

      </Button>



    </div>

  );

}