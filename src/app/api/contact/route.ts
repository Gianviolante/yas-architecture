import { NextRequest, NextResponse } from "next/server";

// TODO: integra Resend (free tier) per invio email
export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Contact form submission:", body);
  return NextResponse.json({ success: true });
}
