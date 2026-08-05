"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { getNextDocumentNumber } from "@/lib/documentNumbers";

import ContractForm, {
  ContractFormValues,
  CustomerOption,
  EstimateOption,
  JobOption,
} from "@/components/admin/ContractForm";


export default function NewContractPage() {


  const router = useRouter();

  const supabase = createClient();



  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");



  const [customers, setCustomers] =
    useState<CustomerOption[]>([]);


  const [estimates, setEstimates] =
    useState<EstimateOption[]>([]);


  const [jobs, setJobs] =
    useState<JobOption[]>([]);





  const initialValues: ContractFormValues = {


    title: "",

    customer_id: "",

    estimate_id: "",

    job_id: "",

    status: "Draft",

    scope_of_work: "",

    payment_terms: "",

    warranty: "",

    terms: "",

    notes: "",


  };






  async function loadData() {


    const [

      customersResult,

      estimatesResult,

      jobsResult,

    ] = await Promise.all([


      supabase

        .from("customers")

        .select(
          "id, first_name, last_name"
        )

        .order(
          "first_name"
        ),



      supabase

        .from("estimates")

        .select(
          "id, estimate_number"
        )

        .order(
          "estimate_number"
        ),




      supabase

        .from("jobs")

        .select(
          "id, job_number"
        )

        .order(
          "job_number"
        ),


    ]);




    if(customersResult.data)

      setCustomers(
        customersResult.data
      );




    if(estimatesResult.data)

      setEstimates(
        estimatesResult.data
      );




    if(jobsResult.data)

      setJobs(
        jobsResult.data
      );


  }






  useEffect(() => {

    void loadData();

  }, []);








  async function handleSubmit(
    values: ContractFormValues
  ) {

    console.log(
  "SUBMIT CONTRACT VALUES:",
  values
);


    setLoading(true);

    setError("");



    try {



      const contractNumber =
        await getNextDocumentNumber(
          supabase,
          "contract"
        );





      const { error } =
        await supabase

          .from("contracts")

          .insert({


            contract_number:
              contractNumber,

            title:
              values.title || null,



            customer_id:
              values.customer_id || null,



            estimate_id:
              values.estimate_id || null,



            job_id:
              values.job_id || null,



            status:
              values.status,

            scope_of_work:
              values.scope_of_work,

            payment_terms:
              values.payment_terms,

            warranty:
              values.warranty,



            terms:
              values.terms,



            notes:
              values.notes,



            signature_token:
              crypto.randomUUID(),


          });





      if(error) {

  console.error(
    "INSERT CONTRACT ERROR:",
    error
  );

  throw error;

}


console.log(
  "CONTRACT CREATED SUCCESSFULLY"
);






      router.push(
        "/admin/contracts"
      );


      router.refresh();




    }
    catch(err:any){



      console.error(
        "CREATE CONTRACT ERROR:",
        err
      );



      setError(

        err?.message ||

        err?.details ||

        err?.hint ||

        "Unable to create contract."

      );



    }
    finally {


      setLoading(false);


    }


  }







  return (

    <ContractForm


      title="New Contract"


      description="Create a professional customer contract."


      submitText="Create Contract"



      customers={customers}


      estimates={estimates}


      jobs={jobs}



      initialValues={initialValues}



      loading={loading}


      error={error}



      onSubmit={handleSubmit}


    />

  );


}
