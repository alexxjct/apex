import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyTokenFromHeader } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { payload } = await verifyTokenFromHeader(req); // lanza error si falta/revocado/invalido
    const user = await User.findById(payload.userId).select("-password").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("ME ERROR:", err);

    const error = err instanceof Error ? err : new Error("Unauthorized");

    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
