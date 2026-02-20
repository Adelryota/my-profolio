import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Read env inside the function so values are always fresh
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ email, role: "admin" });

    const response = NextResponse.json({ success: true });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

