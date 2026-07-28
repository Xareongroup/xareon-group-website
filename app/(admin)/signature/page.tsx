import SignaturePad from "@/components/signatures/SignaturePad";

export default function SignaturesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Digital Signature
        </h1>

        <p className="text-slate-600">
          Capture customer or technician signatures.
        </p>
      </div>

      <SignaturePad />
    </div>
  );
}