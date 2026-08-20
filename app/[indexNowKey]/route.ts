import { createIndexNowVerificationResponse } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ indexNowKey: string }> },
) {
  const { indexNowKey } = await params;
  return createIndexNowVerificationResponse(indexNowKey);
}
