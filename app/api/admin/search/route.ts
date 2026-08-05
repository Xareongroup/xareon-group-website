import { NextRequest, NextResponse } from "next/server";

import { globalSearch } from "@/lib/search/globalSearch";
import { requireApiRole } from "@/lib/auth/requireApiRole";

export async function GET(
  request: NextRequest
) {
  const authorization = await requireApiRole([
    "owner", "admin", "manager", "dispatcher", "technician", "accounting", "sales", "employee", "contractor",
  ]);
  if ("response" in authorization) return authorization.response;

  const query =
    request.nextUrl.searchParams.get("q") ?? "";

  try {
    const results =
      await globalSearch(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Search failed.",
      },
      {
        status: 500,
      }
    );
  }
}
