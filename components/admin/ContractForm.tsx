"use client";

import { useState } from "react";

const contractTemplates = {
  "General Home Repair Agreement": `Scope of Work\nThe Contractor will perform the scope of work described in the related job and accepted estimate.\n\nPayment Terms\nA 25% deposit is due before work begins, 50% after material delivery, and the remaining 25% upon completion.\n\nCustomer Responsibilities\nThe Customer will provide safe access to the work area and timely approvals.\n\nCancellation Policy\nCancellation after materials are ordered may require reimbursement of non-refundable costs.\n\nWarranty Information\nWorkmanship is warranted for one year, excluding normal wear, misuse, and manufacturer defects.\n\nChange Orders\nWork outside the accepted scope requires written approval before it begins.\n\nScheduling Policy\nScheduled dates are subject to weather, material availability, and safe site access.`,
  "Installation Agreement": `Scope of Work\nThe Contractor will install the equipment or materials described in the related job and accepted estimate.\n\nPayment Terms\nA 25% deposit is due before work begins, 50% after material delivery, and the remaining 25% upon completion.\n\nCustomer Responsibilities\nThe Customer confirms that required approvals, utilities, and access are available.\n\nWarranty Information\nWorkmanship is warranted for one year. Manufacturer warranties remain subject to their individual terms.\n\nChange Orders\nAny changed installation requirements require written approval.\n\nScheduling Policy\nInstallation dates may change for safety, weather, or material availability.`,
  "Smart Home Installation Agreement": `Scope of Work\nThe Contractor will install and configure the smart-home equipment listed in the related job and accepted estimate.\n\nPayment Terms\nA 25% deposit is due before work begins, 50% after equipment delivery, and the remaining 25% upon completion.\n\nCustomer Responsibilities\nThe Customer is responsible for providing network access, account credentials where required, and compatible equipment.\n\nWarranty Information\nWorkmanship is warranted for one year. Product warranties are provided by the manufacturer.\n\nChange Orders\nAdditional devices, wiring, or configuration are subject to written approval.\n\nScheduling Policy\nAppointments require safe access to the installation location.`,
  "Furniture Assembly Agreement": `Scope of Work\nThe Contractor will assemble the furniture and fixtures identified in the related job and accepted estimate.\n\nPayment Terms\nPayment is due according to the accepted estimate and any approved change orders.\n\nCustomer Responsibilities\nThe Customer will provide all components, assembly instructions, and adequate workspace.\n\nWarranty Information\nWorkmanship is warranted for 30 days. Product defects remain the responsibility of the manufacturer or retailer.\n\nCancellation Policy\nLate cancellations may be subject to a service charge.\n\nChange Orders\nAdditional assembly or installation work requires written approval.`,
} as const;


export interface CustomerOption {
  id: string;
  first_name: string;
  last_name: string;
  address?: string | null;
}


export interface EstimateOption {
  id: string;
  estimate_number: number;
}


export interface JobOption {
  id: string;
  job_number: string | null;
  customer_id?: string | null;
  estimate_id?: string | null;
  title?: string | null;
  description?: string | null;
}


export interface ContractFormValues {

  customer_id: string;

  estimate_id: string;

  job_id: string;

  status: string;

  terms: string;

  notes: string;

}



interface ContractFormProps {

  title: string;

  description: string;

  submitText: string;


  customers: CustomerOption[];

  estimates: EstimateOption[];

  jobs: JobOption[];


  initialValues: ContractFormValues;


  loading?: boolean;

  error?: string;


  onSubmit: (
    values: ContractFormValues
  ) => Promise<void>;

}





export default function ContractForm({

  title,

  description,

  submitText,


  customers,

  estimates,

  jobs,


  initialValues,


  loading = false,

  error = "",


  onSubmit,


}: ContractFormProps) {



  const [values,setValues] =
    useState(initialValues);




  function update<K extends keyof ContractFormValues>(

    key: K,

    value: ContractFormValues[K]

  ){

    setValues((previous)=>({

      ...previous,

      [key]: value,

    }));

  }

  function selectJob(jobId: string) {
    const job = jobs.find((item) => item.id === jobId);
    setValues((previous) => {
      const scope = job?.description?.trim() || job?.title?.trim() || "";
      const generatedTerms = scope ? `Scope of Work:\n${scope}\n\nTerms & Payment Conditions\nCustomer agrees to a 25% deposit before starting, 50% after material delivery, and 25% after completion.` : previous.terms;
      return { ...previous, job_id: jobId, customer_id: job?.customer_id ?? previous.customer_id, estimate_id: job?.estimate_id ?? previous.estimate_id, terms: previous.terms.trim() ? previous.terms : generatedTerms };
    });
  }





  async function handleSubmit(

    event: React.FormEvent<HTMLFormElement>

  ){

    event.preventDefault();

    await onSubmit(values);

  }





return (

<div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">


{/* HEADER */}

<div className="border-b border-slate-200 pb-6">


<h1 className="text-4xl font-bold text-slate-900">

{title}

</h1>


<p className="mt-2 text-slate-500">

{description}

</p>


</div>





<form

onSubmit={handleSubmit}

className="mt-8 space-y-8"

>





{/* CONTRACT STATUS */}

<section className="space-y-6">


<div>

<h2 className="text-xl font-semibold text-slate-900">

Contract Information

</h2>


<p className="mt-1 text-sm text-slate-500">

Basic agreement information.

</p>

</div>




<div className="max-w-md">


<label className="mb-2 block text-sm font-medium">

Status

</label>



<select

value={values.status}

onChange={(e)=>

update(
"status",
e.target.value
)

}

className="w-full rounded-xl border border-slate-300 px-4 py-3"

>


<option value="Draft">
Draft
</option>


<option value="Sent">
Sent
</option>


<option value="Signed">
Signed
</option>


<option value="Cancelled">
Cancelled
</option>


<option value="Expired">
Expired
</option>



</select>


</div>


</section>







{/* RELATED RECORDS */}


<section className="space-y-6">


<div>

<h2 className="text-xl font-semibold">

Related Records

</h2>


<p className="mt-1 text-sm text-slate-500">

Connect this contract with the customer, estimate, and job.

</p>


</div>





<div className="grid gap-6 md:grid-cols-3">



{/* CUSTOMER */}

<div>

<label className="mb-2 block text-sm font-medium">

Customer

</label>


<select

value={values.customer_id}

onChange={(e)=>

update(
"customer_id",
e.target.value
)

}

className="w-full rounded-xl border border-slate-300 px-4 py-3"

>


<option value="">
Select Customer
</option>


{customers.map((customer)=>(


<option

key={customer.id}

value={customer.id}

>

{customer.first_name} {customer.last_name}

</option>


))}



</select>

</div>





{/* ESTIMATE */}

<div>

<label className="mb-2 block text-sm font-medium">

Estimate

</label>


<select

value={values.estimate_id}

onChange={(e)=>

update(
"estimate_id",
e.target.value
)

}

className="w-full rounded-xl border border-slate-300 px-4 py-3"

>


<option value="">
Select Estimate
</option>



{estimates.map((estimate)=>(

<option

key={estimate.id}

value={estimate.id}

>

{estimate.estimate_number}

</option>


))}


</select>


</div>







{/* JOB */}

<div>

<label className="mb-2 block text-sm font-medium">

Job

</label>


<select

value={values.job_id}

onChange={(e)=> selectJob(e.target.value)}

className="w-full rounded-xl border border-slate-300 px-4 py-3"

>


<option value="">
Select Job
</option>


{jobs.map((job)=>(


<option

key={job.id}

value={job.id}

>

{job.job_number}

</option>


))}



</select>


</div>



</div>


</section>







{/* TERMS */}


<section className="space-y-6">


<div>


<h2 className="text-xl font-semibold">

Contract Terms

</h2>


<p className="mt-1 text-sm text-slate-500">

These terms will appear on the customer contract.

</p>


</div>

<div>
<label className="mb-2 block text-sm font-medium">Professional Template</label>
<select
defaultValue=""
onChange={(event) => {
  const template = contractTemplates[event.target.value as keyof typeof contractTemplates];
  if (template) update("terms", template);
}}
className="w-full rounded-xl border border-slate-300 px-4 py-3"
>
<option value="">Choose a template (optional)</option>
{Object.keys(contractTemplates).map((name) => <option key={name} value={name}>{name}</option>)}
</select>
</div>

<textarea

rows={10}

value={values.terms}

onChange={(e)=>

update(
"terms",
e.target.value
)

}

placeholder="
Example:

Customer agrees to the scope of work described in the estimate.

Payment schedule:
50% deposit before work begins.
Remaining balance due upon completion.

Additional work outside the agreement requires approval.

"

className="w-full rounded-xl border border-slate-300 px-4 py-3"

/>


</section>








{/* NOTES */}


<section>


<h2 className="mb-3 text-xl font-semibold">

Internal Notes

</h2>


<textarea

rows={5}

value={values.notes}

onChange={(e)=>

update(
"notes",
e.target.value
)

}

placeholder="Internal notes visible only to staff..."

className="w-full rounded-xl border border-slate-300 px-4 py-3"

/>


</section>







{error && (

<div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

{error}

</div>

)}




<div className="flex justify-end border-t pt-8">


<button

type="submit"

disabled={loading}

className="
rounded-xl
bg-blue-600
px-8
py-3
font-medium
text-white
hover:bg-blue-700
disabled:opacity-60
"

>


{
loading
?
"Saving Contract..."
:
submitText
}


</button>


</div>





</form>


</div>


);


}
