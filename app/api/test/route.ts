import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "OK",
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  return NextResponse.json({
    status: "OK",
    message: "POST is working!",
  });
}
