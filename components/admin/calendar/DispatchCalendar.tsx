"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import type {
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";

import { createClient } from "@/lib/supabase/client";



interface CalendarJob {

  id: string;

  job_number: string;

  title: string;

  status: string;

  priority: string;


  scheduled_date: string | null;

  start_time: string | null;

  end_time: string | null;



  customer?:
    | {
        first_name:string;
        last_name:string;
        phone?:string | null;
      }
    | {
        first_name:string;
        last_name:string;
        phone?:string | null;
      }[]
    | null;



  employee?:
    | {
        first_name:string;
        last_name:string;
      }
    | {
        first_name:string;
        last_name:string;
      }[]
    | null;

}





export default function DispatchCalendar(){


const router = useRouter();


const supabase = useMemo(
  ()=>createClient(),
  []
);



const [events,setEvents]=useState<EventInput[]>([]);

const [loading,setLoading]=useState(true);

const [saving,setSaving]=useState(false);





function getCustomerName(customer:any){

 if(!customer)
  return "No Customer";


 if(Array.isArray(customer)){

  if(customer.length===0)
    return "No Customer";


  return `${customer[0].first_name} ${customer[0].last_name}`;

 }


 return `${customer.first_name} ${customer.last_name}`;

}





function getEmployeeName(employee:any){

 if(!employee)
  return "Unassigned";


 if(Array.isArray(employee)){

  if(employee.length===0)
    return "Unassigned";


  return `${employee[0].first_name} ${employee[0].last_name}`;

 }


 return `${employee.first_name} ${employee.last_name}`;

}






function getEventColor(
 status:string,
 priority:string
){

 if(priority==="High")
   return "#dc2626";


 if(priority==="Low")
   return "#16a34a";



 switch(status){

 case "Completed":
   return "#16a34a";


 case "In Progress":
   return "#f59e0b";


 case "Cancelled":
   return "#dc2626";


 default:
   return "#2563eb";

 }

}






function formatDate(date:Date){

 return [

 date.getFullYear(),

 String(
  date.getMonth()+1
 ).padStart(2,"0"),

 String(
  date.getDate()
 ).padStart(2,"0")

 ].join("-");

}





function formatTime(date:Date|null){

 if(!date)
  return null;


 return [

 String(date.getHours()).padStart(2,"0"),

 String(date.getMinutes()).padStart(2,"0"),

 "00"

 ].join(":");

}







const loadJobs = useCallback(async()=>{


try{


setLoading(true);



const {data,error}=await supabase

.from("jobs")

.select(`

id,

job_number,

title,

status,

priority,

scheduled_date,

start_time,

end_time,


customer:customers(
 first_name,
 last_name,
 phone
),


employee:employees(
 first_name,
 last_name
)

`)

.not(
 "scheduled_date",
 "is",
 null
)

.order(
 "scheduled_date"
)

.order(
 "start_time"
);




if(error)
 throw error;





const jobs =
(data ?? []) as unknown as CalendarJob[];






const calendarEvents = jobs.map(job=>({



id:job.id,



title:
`${job.job_number} - ${job.title}`,




start:
job.start_time
?
`${job.scheduled_date}T${job.start_time}`
:
`${job.scheduled_date}T08:00:00`,




end:
job.end_time
?
`${job.scheduled_date}T${job.end_time}`
:
undefined,




backgroundColor:
getEventColor(
 job.status,
 job.priority
),



borderColor:
getEventColor(
 job.status,
 job.priority
),



textColor:"#ffffff",



extendedProps:{


jobNumber:
job.job_number,


jobTitle:
job.title,


customer:
getCustomerName(
 job.customer
),


employee:
getEmployeeName(
 job.employee
),


status:
job.status,


priority:
job.priority,


}



}));





setEvents(calendarEvents);



}

catch(error){

console.error(
"Calendar loading error:",
error
);

}


finally{

setLoading(false);

}


},[supabase]);








useEffect(()=>{


void loadJobs();



function refresh(){

void loadJobs();

}



window.addEventListener(
"jobScheduled",
refresh
);



return()=>{

window.removeEventListener(
"jobScheduled",
refresh
);

};


},[loadJobs]);










async function updateJob(
jobId:string,
start:Date|null,
end:Date|null
){


if(!start)
 return false;



setSaving(true);



const {error}=await supabase

.from("jobs")

.update({

scheduled_date:
formatDate(start),


start_time:
formatTime(start),


end_time:
formatTime(end)

})


.eq(
"id",
jobId
);




setSaving(false);



if(error){

console.error(error);

return false;

}



return true;


}









async function handleDrop(
info:EventDropArg
){


const success =
await updateJob(
info.event.id,
info.event.start,
info.event.end
);



if(!success)
 info.revert();



await loadJobs();


}








async function handleEventResize(
  info: any
){


const success =
await updateJob(
info.event.id,
info.event.start,
info.event.end
);



if(!success)
 info.revert();



await loadJobs();


}









if(loading){

return(

<div className="rounded-2xl border bg-white p-10">

<div className="py-20 text-center text-slate-500">

Loading dispatch calendar...

</div>

</div>

)

}









return(

<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">


<FullCalendar


plugins={[
dayGridPlugin,
timeGridPlugin,
interactionPlugin
]}



initialView="dayGridMonth"



height="750px"




headerToolbar={{

left:
"prev,next today",

center:
"title",

right:
"dayGridMonth,timeGridWeek,timeGridDay"

}}




buttonText={{

today:"Today",

month:"Month",

week:"Week",

day:"Day"

}}





events={events}



editable={!saving}




eventDrop={handleDrop}



eventResize={handleEventResize}





eventClick={(info:EventClickArg)=>{


router.push(
`/admin/jobs/${info.event.id}`
);


}}







eventContent={(info)=>(


<div className="p-1 text-xs leading-tight">


<div className="font-bold truncate">

{info.event.extendedProps.jobNumber}

</div>



<div className="truncate">

👤 {info.event.extendedProps.customer}

</div>



<div className="truncate">

🔧 {info.event.extendedProps.employee}

</div>



</div>


)}








eventDidMount={(info)=>{


const event =
info.event.extendedProps;



info.el.title = `

${event.jobTitle}


Customer:
${event.customer}


Employee:
${event.employee}


Status:
${event.status}


Priority:
${event.priority}

`;



info.el.style.cursor="pointer";

info.el.style.borderRadius="8px";

info.el.style.fontWeight="600";

info.el.style.minHeight="55px";

info.el.style.padding="2px";



}}



eventMouseEnter={(info)=>{

info.el.style.transform=
"scale(1.03)";

}}



eventMouseLeave={(info)=>{

info.el.style.transform=
"scale(1)";

}}




/>

</div>

);


}