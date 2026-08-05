"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import { Estimate } from "@/types/estimate";
import { defaultEstimate } from "@/lib/estimates/defaults";

import EstimateHeader from "./EstimateHeader";
import EstimateItems from "./EstimateItems";
import EstimateTotals from "./EstimateTotals";
import EstimateNotes from "./EstimateNotes";
import EstimateTerms from "./EstimateTerms";
import EstimateActions from "./EstimateActions";


interface Customer {
  id: string;
  first_name: string;
  last_name: string;
}



interface EstimateFormProps {
  estimate?: Estimate;
  items?: any[];
  isEditing?: boolean;
}



export default function EstimateForm({
  estimate: initialEstimate,
  items = [],
  isEditing = false,
}: EstimateFormProps) {


  const router = useRouter();

  const supabase = createClient();


  const [loading, setLoading] =
    useState(false);



  const [customers, setCustomers] =
    useState<Customer[]>([]);



  const [estimate, setEstimate] =
    useState<Estimate>(
      initialEstimate
        ? {
            ...initialEstimate,
            items,
          }
        :
          {
            ...defaultEstimate,
          }
    );





  useEffect(() => {

    loadCustomers();

  }, []);





  async function loadCustomers() {

    const {
      data,
    } =
      await supabase
        .from("customers")
        .select(
          "id, first_name, last_name"
        )
        .order(
          "first_name"
        );


    setCustomers(
      data ?? []
    );

  }







  async function saveEstimate() {


    try {


      setLoading(true);



      let estimateId =
        estimate.id;




      if (isEditing) {


        const {
          error
        } =
          await supabase
            .from("estimates")
            .update({

              customer_id:
                estimate.customerId,

              status:
                estimate.status,

              issue_date:
                estimate.issueDate,

              expiration_date:
                estimate.expirationDate,

              subtotal:
                estimate.subtotal,

              tax_rate:
                estimate.taxRate,

              tax:
                estimate.tax,

              discount:
                estimate.discount,

              total:
                estimate.total,

              notes:
                estimate.notes,

              terms:
                estimate.terms,

            })
            .eq(
              "id",
              estimate.id
            );


        if(error)
          throw error;



      }
      else {


        const {
          data,
          error
        } =
          await supabase
            .from("estimates")
            .insert({

              customer_id:
                estimate.customerId,

              status:
                estimate.status,

              issue_date:
                estimate.issueDate,

              expiration_date:
                estimate.expirationDate,

              subtotal:
                estimate.subtotal,

              tax_rate:
                estimate.taxRate,

              tax:
                estimate.tax,

              discount:
                estimate.discount,

              total:
                estimate.total,

              notes:
                estimate.notes,

              terms:
                estimate.terms,

            })
            .select()
            .single();



        if(error)
          throw error;



        estimateId =
          data.id;

      }





      if(!estimateId)
        throw new Error(
          "Estimate ID missing."
        );






      if(isEditing){

        await supabase
          .from("estimate_items")
          .delete()
          .eq(
            "estimate_id",
            estimateId
          );

      }







      if(estimate.items.length > 0){


        const estimateItems =
          estimate.items.map(
            (
              item,
              index
            ) => ({

              estimate_id:
                estimateId,

              description:
                item.description,

              quantity:
                item.quantity,

              unit:
                item.unit,

              unit_price:
                item.unitPrice,

              discount:
                item.discount,

              taxable:
                item.taxable,

              total:
                item.total,

              sort_order:
                index,

            })
          );



        const {
          error
        } =
          await supabase
            .from("estimate_items")
            .insert(
              estimateItems
            );



        if(error)
          throw error;


      }






      router.push(
        `/admin/estimates/${estimateId}`
      );

      router.refresh();





    }
    catch(error:any){


      console.error(
        "SAVE ERROR:",
        error
      );


      alert(
        error.message ??
        "Unable to save estimate."
      );


    }
    finally{

      setLoading(false);

    }

  }









  function previewEstimate(){


    if(!estimate.id){

      alert(
        "Please save the estimate first."
      );

      return;

    }



    router.push(
      `/admin/estimates/${estimate.id}/preview`
    );

  }









  async function sendEstimate(){


    try{


      if(!estimate.id){

        alert(
          "Please save the estimate first."
        );

        return;

      }





      const response =
        await fetch(
          `/api/estimates/${estimate.id}/send`,
          {
            method:
              "POST",
          }
        );



      const result =
        await response.json();





      if(!response.ok){

        throw new Error(
          result.error ||
          "Failed sending estimate."
        );

      }






      await navigator.clipboard.writeText(
        result.signingLink
      );





      alert(
        "Customer signing link created and copied:\n\n" +
        result.signingLink
      );





      router.refresh();



    }
    catch(error:any){


      console.error(
        "SEND ESTIMATE ERROR:",
        error
      );


      alert(
        error.message ??
        "Unable to send estimate."
      );


    }

  }








  function cancel(){

    router.push(
      "/admin/estimates"
    );

  }








  return (

    <div className="space-y-8">


      <EstimateHeader

        estimate={estimate}

        setEstimate={setEstimate}

        customers={customers}

      />



      <EstimateItems

        estimate={estimate}

        setEstimate={setEstimate}

      />



      <EstimateTotals

        estimate={estimate}

        setEstimate={setEstimate}

      />



      <EstimateNotes

        estimate={estimate}

        setEstimate={setEstimate}

      />



      <EstimateTerms

        estimate={estimate}

        setEstimate={setEstimate}

      />





      <EstimateActions

        estimate={estimate}

        loading={loading}

        onSave={saveEstimate}

        onPreview={previewEstimate}

        onSend={sendEstimate}

        onCancel={cancel}

      />



    </div>

  );

}