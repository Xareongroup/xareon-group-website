import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Estimates API is under construction.",
  });
}