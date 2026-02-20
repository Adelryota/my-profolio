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

/* PUT /api/projects/[id] */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await connectDB();
    const body = await request.json();
    const project = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

/* DELETE /api/projects/[id] */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await connectDB();
    const project = await Project.findByIdAndDelete(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
