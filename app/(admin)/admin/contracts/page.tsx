"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

import PageHeader from "@/components/admin/PageHeader";
import StatsCard from "@/components/admin/StatsCard";
import SearchBar from "@/components/admin/SearchBar";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import DataTable from "@/components/admin/DataTable";

import {
  FileSignature,
  FileText,
  PenSquare,
  Clock,
} from "lucide-react";


interface Contract {

  id: string;

  contract_number: string | null;

  status: string;

  created_at: string;

  signed_at: string | null;


  customer: {

    first_name: string;

    last_name: string;

  } | null;


  estimate: {

    estimate_number: string;

  } | null;


  job: {

    job_number: string;

  } | null;

}




export default function ContractsPage() {


  const supabase = createClient();



  const [contracts, setContracts] =
    useState<Contract[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");



  const [search, setSearch] =
    useState("");



  const [statusFilter, setStatusFilter] =
    useState("All");





  async function loadContracts() {


    setLoading(true);



    const { data, error } =

      await supabase

        .from("contracts")

        .select(`

          id,

          contract_number,

          status,

          created_at,

          signed_at,


          customer:customers(

            first_name,

            last_name

          ),


          estimate:estimates(

            estimate_number

          ),


          job:jobs(

            job_number

          )

        `)


        .order(
          "created_at",
          {
            ascending:false,
          }
        );





    if(error){


      console.error(
        "LOAD CONTRACTS ERROR:",
        error
      );


      setError(
        error.message
      );


      setLoading(false);


      return;

    }






    const formatted: Contract[] =

      (data ?? []).map((contract:any)=>(

        {

          ...contract,


          customer:

            Array.isArray(contract.customer)

            ? contract.customer[0] ?? null

            : contract.customer,



          estimate:

            Array.isArray(contract.estimate)

            ? contract.estimate[0] ?? null

            : contract.estimate,



          job:

            Array.isArray(contract.job)

            ? contract.job[0] ?? null

            : contract.job,


        }

      ));





    setContracts(formatted);


    setLoading(false);


  }







  useEffect(()=>{

    void loadContracts();

  },[]);








  const filteredContracts =

    useMemo(()=>{


      return contracts.filter((contract)=>{


        const searchText =
          search.toLowerCase();



        const matchesSearch =


          contract.contract_number

            ?.toLowerCase()

            .includes(searchText)



          ||

          `${contract.customer?.first_name ?? ""} ${contract.customer?.last_name ?? ""}`

            .toLowerCase()

            .includes(searchText);





        const matchesStatus =


          statusFilter === "All"

          ||

          contract.status === statusFilter;





        return (

          matchesSearch

          &&

          matchesStatus

        );


      });


    },[
      contracts,
      search,
      statusFilter
    ]);







  const totalContracts =
    contracts.length;



  const draftContracts =
    contracts.filter(
      (contract)=>
        contract.status === "Draft"
    ).length;



  const sentContracts =
    contracts.filter(
      (contract)=>
        contract.status === "Sent"
    ).length;



  const signedContracts =
    contracts.filter(
      (contract)=>
        contract.status === "Signed"
    ).length;








return (

<div className="mx-auto max-w-7xl px-6 py-8">





<PageHeader

title="Contracts"

description="Manage customer contracts and digital agreements."

buttonText="New Contract"

buttonHref="/admin/contracts/new"

/>






<div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">



<StatsCard

title="Total Contracts"

value={totalContracts}

color="blue"

icon={
<FileSignature className="h-8 w-8 text-blue-600"/>
}

/>




<StatsCard

title="Draft"

value={draftContracts}

color="orange"

icon={
<FileText className="h-8 w-8 text-orange-600"/>
}

/>




<StatsCard

title="Sent"

value={sentContracts}

color="blue"

icon={
<Clock className="h-8 w-8 text-blue-600"/>
}

/>




<StatsCard

title="Signed"

value={signedContracts}

color="green"

icon={
<PenSquare className="h-8 w-8 text-green-600"/>
}

/>



</div>







<SearchBar

search={search}

onSearchChange={setSearch}

placeholder="Search contract number or customer..."

status={statusFilter}

onStatusChange={setStatusFilter}

statusOptions={[
"All",
"Draft",
"Sent",
"Signed",
"Cancelled",
"Expired",
]}

/>







<DataTable

loading={loading}

error={error}

isEmpty={filteredContracts.length===0}

emptyState={

<EmptyState

icon={
<FileSignature className="mx-auto h-16 w-16 text-slate-400"/>
}

title="No Contracts Found"

description="Create your first contract to get started."

buttonText="Create Contract"

buttonHref="/admin/contracts/new"

/>

}



headers={

<tr>


<th className="px-6 py-3 text-left">
Contract #
</th>


<th className="px-6 py-3 text-left">
Customer
</th>


<th className="px-6 py-3 text-left">
Status
</th>


<th className="px-6 py-3 text-left">
Estimate
</th>


<th className="px-6 py-3 text-left">
Job
</th>


<th className="px-6 py-3 text-left">
Signed
</th>


<th className="px-6 py-3 text-center">
Actions
</th>


</tr>

}


>





{
filteredContracts.map((contract)=>(


<tr

key={contract.id}

className="border-t border-slate-100 hover:bg-slate-50"

>



<td className="px-6 py-4 font-semibold">

{contract.contract_number ?? "Pending"}

</td>





<td className="px-6 py-4">

{
contract.customer

?

`${contract.customer.first_name} ${contract.customer.last_name}`

:

"Unknown Customer"
}

</td>






<td className="px-6 py-4">

<StatusBadge

status={contract.status}

/>

</td>







<td className="px-6 py-4">

{
contract.estimate?.estimate_number ?? "-"
}

</td>






<td className="px-6 py-4">

{
contract.job?.job_number ?? "-"
}

</td>






<td className="px-6 py-4">

{
contract.signed_at

?

new Date(
contract.signed_at
).toLocaleDateString()

:

"-"
}

</td>







<td className="px-6 py-4">


<div className="flex justify-center gap-2">



<Link

href={`/admin/contracts/${contract.id}`}

className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-100"

>

View

</Link>





<Link

href={`/admin/contracts/${contract.id}/edit`}

className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-100"

>

Edit

</Link>




</div>


</td>






</tr>


))

}






</DataTable>





</div>

);


}