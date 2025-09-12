import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyTokenFromHeader } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { payload } = await verifyTokenFromHeader(req);
    if (payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await User.find().select("username role createdAt -_id").lean();
    return NextResponse.json({ ok: true, users });
  } catch (err: any) {
    console.error("ADMIN/USERS ERROR:", err);
    const status = err.message === "Token revoked" || err.message === "Token missing" ? 401 : 500;
    return NextResponse.json({ error: err.message || "Server error" }, { status });
  }
}
