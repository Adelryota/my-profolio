import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/auth";

function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  return payload?.role === "admin";
}

/* GET /api/projects — public */
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(projects);
  } catch (err) {
    console.error("[GET /api/projects]", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

/* POST /api/projects — admin only */
export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    console.error("[POST /api/projects] Unauthorized — no valid admin token");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const project = await Project.create(body);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("[POST /api/projects]", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

