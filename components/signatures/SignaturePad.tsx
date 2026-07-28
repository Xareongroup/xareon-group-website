"use client";

import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import Button from "@/components/ui/Button";

export default function SignaturePad() {
  const sigRef = useRef<SignatureCanvas>(null);

  function clearSignature() {
    sigRef.current?.clear();
  }

  function saveSignature() {
    const image = sigRef.current
      ?.getTrimmedCanvas()
      .toDataURL("image/png");

    console.log(image);
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{
            width: 700,
            height: 250,
            className: "w-full bg-white",
          }}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={saveSignature}>
          Save Signature
        </Button>

        <Button
          variant="secondary"
          onClick={clearSignature}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}