import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { buildCustomerPortalUrl } from "@/lib/portal/buildCustomerPortalUrl";

import { Resend } from "resend";


const resend =
  new Resend(
    process.env.RESEND_API_KEY
  );



export async function POST(
  request: Request
) {


  try {


    const {
      customerId,
    } = await request.json();




    if(!customerId){

      return NextResponse.json(
        {
          error:
          "Customer ID is required."
        },
        {
          status:400
        }
      );

    }






    const supabase =
      await createClient();






    const {
      data: customer,
      error,
    } =
      await supabase

        .from("customers")

        .select(`
          id,
          first_name,
          last_name,
          email,
          portal_token
        `)

        .eq(
          "id",
          customerId
        )

        .single();







    if(error || !customer){

      return NextResponse.json(
        {
          error:
          "Customer not found."
        },
        {
          status:404
        }
      );

    }








    if(!customer.email){

      return NextResponse.json(
        {
          error:
          "Customer does not have an email address."
        },
        {
          status:400
        }
      );

    }








    const portalUrl = buildCustomerPortalUrl(
      process.env.NEXT_PUBLIC_SITE_URL,
      customer.portal_token
    );

    if (!portalUrl.ok) {
      console.error("Customer portal email link configuration failed:", {
        reason: portalUrl.reason,
        customerId: customer.id,
      });
      const error = portalUrl.reason === "missing_portal_token"
        ? "A secure portal link is not available for this customer. Generate a new portal link before sending email."
        : "Portal access email is not configured. Please contact XAREON GROUP.";
      return NextResponse.json({ error }, { status: 503 });
    }

    const portalLink = portalUrl.url;









    await resend.emails.send({

      from:
      "XAREON Group <info@xareongroup.com>",


      to:
      customer.email,



      subject:
      "Your XAREON Customer Portal Access",



      html:
      `

      <div style="font-family:Arial,sans-serif">

        <h2>
          XAREON Customer Portal
        </h2>


        <p>
          Hello ${customer.first_name} ${customer.last_name},
        </p>


        <p>
          You can now access your customer portal.
        </p>


        <p>
          From your portal you can view:
        </p>


        <ul>
          <li>Estimates</li>
          <li>Contracts</li>
          <li>Invoices</li>
          <li>Payments</li>
        </ul>



        <p>

          <a

          href="${portalLink}"

          style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:8px;
          "

          >
            Open Customer Portal
          </a>

        </p>



        <p>
          Thank you,
          <br/>
          XAREON Group
          <br/>
          Shield of Integrity
        </p>


      </div>

      `

    });








    await supabase

      .from("customer_activity")

      .insert({

        customer_id:
          customer.id,

        activity_type:
          "portal_email_sent",

        title:
          "Portal Access Email Sent",

        description:
          "Customer portal access email was sent.",

      });









    return NextResponse.json({

      success:true

    });




  }


  catch(error){



    console.error(
      error
    );



    return NextResponse.json(

      {
        error:
        "Unable to send the portal access email. Please try again."
      },

      {
        status:500
      }

    );


  }


}
