"use client";

import { Estimate } from "@/types/estimate";

interface EstimateActionsProps {
  estimate: Estimate;

  loading?: boolean;

  onSave?: () => void;

  onCancel?: () => void;

  onPreview?: () => void;

  onSend?: () => void;

  onCopyLink?: () => void;
}


export default function EstimateActions({

  loading = false,

  onSave,

  onCancel,

  onPreview,

  onSend,

  onCopyLink,

}: EstimateActionsProps) {


  return (

    <div className="rounded-xl bg-white p-6 shadow">


      <h2 className="mb-6 text-2xl font-bold">
        Actions
      </h2>



      <div className="space-y-3">



        {/* SAVE */}

        <button

          type="button"

          onClick={onSave}

          disabled={loading}

          className="
          w-full rounded-lg 
          bg-blue-600 
          px-4 py-3 
          font-medium 
          text-white 
          transition
          hover:bg-blue-700
          disabled:bg-slate-400
          "

        >

          {loading
            ? "Saving..."
            : "Save Estimate"
          }

        </button>





        {/* PDF PREVIEW */}

        <button

          type="button"

          onClick={onPreview}

          className="
          w-full rounded-lg 
          border border-slate-300
          px-4 py-3
          font-medium
          hover:bg-slate-50
          "

        >

          Preview PDF

        </button>





        {/* SEND CUSTOMER */}

        <button

          type="button"

          onClick={onSend}

          className="
          w-full rounded-lg
          bg-green-600
          px-4 py-3
          font-medium
          text-white
          hover:bg-green-700
          "

        >

          Send Estimate To Customer

        </button>





        {/* COPY SIGNING LINK */}

        <button

          type="button"

          onClick={onCopyLink}

          className="
          w-full rounded-lg
          border border-blue-300
          px-4 py-3
          font-medium
          text-blue-700
          hover:bg-blue-50
          "

        >

          Copy Customer Signing Link

        </button>





        {/* CANCEL */}

        <button

          type="button"

          onClick={onCancel}

          className="
          w-full rounded-lg
          border border-red-300
          px-4 py-3
          font-medium
          text-red-600
          hover:bg-red-50
          "

        >

          Cancel

        </button>


      </div>


    </div>

  );

}