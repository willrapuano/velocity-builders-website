import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());

  console.log("Velocity Builders contact submission", payload);

  return NextResponse.json({ ok: true });
}
