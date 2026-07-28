import { NextRequest, NextResponse } from "next/server";

import { globalSearch } from "@/lib/search/globalSearch";

export async function GET(
  request: NextRequest
) {
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