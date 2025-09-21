import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyTokenFromHeader } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { payload } = await verifyTokenFromHeader(req);
    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await User.find().select("username role createdAt -_id").lean();
    return NextResponse.json({ ok: true, users });
  } catch (err) {
    console.error("ADMIN/USERS ERROR:", err);

    // Definimos err como unknown para hacer chequeos seguros
    const error = err as Error;
    const status =
      error.message === "Token revoked" || error.message === "Token missing"
        ? 401
        : 500;

    return NextResponse.json({ error: error.message || "Server error" }, { status });
  }
}
