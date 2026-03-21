import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  console.log("Admin login request:", password);

  if (password === process.env.ADMIN_PASS) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
