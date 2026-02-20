import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Read env inside the function so values are always fresh
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim();
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH?.trim();

    const { email, password } = await request.json();

    // Log diagnostic info (safely)
    console.log("Login Attempt:", {
      providedEmail: email,
      isEmailMatch: email === ADMIN_EMAIL,
      envEmailLength: ADMIN_EMAIL?.length || 0,
      envHashLength: ADMIN_PASSWORD_HASH?.length || 0,
      hasEnvEmail: !!ADMIN_EMAIL,
      hasEnvHash: !!ADMIN_PASSWORD_HASH,
    });

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
      console.error("Login Error: Missing environment variables");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    if (email !== ADMIN_EMAIL) {
      console.warn("Login Failure: Email mismatch");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!valid) {
      console.warn("Login Failure: Password mismatch (bcrypt failed)");
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

