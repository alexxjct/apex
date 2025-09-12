import { NextResponse } from "next/server";
import { RevokedToken } from "@/models/RevokedToken";
import { verifyTokenFromHeader } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { token } = await verifyTokenFromHeader(req);
    // Guardar token como revocado (si no existe)
    await RevokedToken.create({ token });
    return NextResponse.json({ ok: true, message: "Token revoked" });
  } catch (err: any) {
    console.error("LOGOUT ERROR:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 401 });
  }
}
