"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  ScrollText,
  Receipt,
  Download,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { createClient } from "@/lib/supabase/client";


interface Props {
  customerId: string;
}


interface Document {
  id: string;
  document_type: string;
  title: string;
  file_url: string;
  status: string;
  signed_date: string | null;
  created_at: string;
}



export default function CustomerDocuments({
  customerId,
}: Props) {


  const supabase = createClient();


  const [documents,setDocuments] =
    useState<Document[]>([]);


  const [loading,setLoading] =
    useState(true);



  async function loadDocuments(){

    const {
      data,
      error,
    } =
    await supabase
      .from("customer_documents")
      .select("*")
      .eq(
        "customer_id",
        customerId
      )
      .order(
        "created_at",
        {
          ascending:false,
        }
      );


    if(error){

      console.error(
        "Documents error:",
        error
      );

      return;
    }


    setDocuments(
      data ?? []
    );

    setLoading(false);

  }





  useEffect(()=>{

    void loadDocuments();

  },[customerId]);





  function getIcon(type:string){

    switch(type){

      case "estimate":
        return (
          <FileText className="h-5 w-5 text-blue-600"/>
        );


      case "contract":
        return (
          <ScrollText className="h-5 w-5 text-purple-600"/>
        );


      case "invoice":
        return (
          <Receipt className="h-5 w-5 text-green-600"/>
        );


      default:
        return (
          <FileText className="h-5 w-5 text-slate-500"/>
        );

    }

  }





  return (

    <Card
      title="Customer Documents"
      description="Signed estimates, contracts, invoices, and receipts."
    >


      {
        loading ? (

          <p className="text-sm text-slate-500">
            Loading documents...
          </p>

        ) : documents.length === 0 ? (

          <div className="rounded-xl border-2 border-dashed border-slate-200 py-10 text-center">

            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-400"/>

            <p className="text-sm text-slate-500">
              No documents available yet.
            </p>

          </div>


        ) : (

          <div className="space-y-3">


            {
              documents.map((doc)=>(

                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                >


                  <div className="flex items-center gap-3">

                    {getIcon(doc.document_type)}


                    <div>

                      <p className="font-semibold text-slate-900">
                        {doc.title}
                      </p>


                      <div className="flex gap-2 mt-1">

                        <Badge variant="secondary">
                          {doc.document_type}
                        </Badge>


                        <Badge variant="success">
                          {doc.status}
                        </Badge>

                      </div>


                    </div>


                  </div>



                  <a
                    href={doc.file_url}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >

                    <Download className="h-4 w-4"/>

                    View

                  </a>



                </div>

              ))
            }


          </div>

        )

      }


    </Card>

  );

}