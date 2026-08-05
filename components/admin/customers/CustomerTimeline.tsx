import {
  User,
  FileText,
  Hammer,
  Receipt,
  CreditCard,
  Link2,
  RefreshCw,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";


interface Props {

  customerId: string;

}



export default async function CustomerTimeline({
  customerId,
}: Props) {


  const supabase =
    await createClient();




  const {
    data: activities,
    error,
  } =
    await supabase

      .from("customer_activity")

      .select(`
        id,
        activity_type,
        title,
        description,
        created_at
      `)

      .eq(
        "customer_id",
        customerId
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      );




  if(error){

    console.error(
      "Timeline Error:",
      error
    );

  }





  function getIcon(type:string){

    switch(type){


      case "portal_created":

        return Link2;



      case "portal_regenerated":

        return RefreshCw;



      case "estimate_created":

        return FileText;



      case "estimate_signed":

        return FileText;



      case "invoice_created":

        return Receipt;



      case "payment_received":

        return CreditCard;



      case "job_created":

        return Hammer;



      default:

        return User;

    }

  }







  return (

    <div className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
    ">


      <h2 className="
        mb-6
        text-xl
        font-semibold
      ">

        Activity Timeline

      </h2>





      {
        !activities ||
        activities.length === 0

        ?

        <p className="
          text-sm
          text-slate-500
        ">

          No activity recorded yet.

        </p>


        :



        <div className="space-y-6">


          {
            activities.map((item)=>(


              <div
                key={item.id}
                className="flex gap-4"
              >



                {
                  (()=>{

                    const Icon =
                      getIcon(
                        item.activity_type
                      );


                    return (

                      <div className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-100
                        text-blue-600
                      ">

                        <Icon
                          className="h-5 w-5"
                        />

                      </div>

                    );


                  })()
                }






                <div className="
                  flex-1
                  border-b
                  border-slate-100
                  pb-6
                ">


                  <p className="
                    font-semibold
                    text-slate-900
                  ">

                    {item.title}

                  </p>




                  <p className="
                    mt-1
                    text-sm
                    text-slate-600
                  ">

                    {item.description}

                  </p>





                  <p className="
                    mt-2
                    text-xs
                    text-slate-400
                  ">


                    {
                      new Date(
                        item.created_at
                      ).toLocaleString()
                    }


                  </p>




                </div>



              </div>



            ))
          }



        </div>


      }



    </div>

  );

}