import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    if (!JWT_SECRET) throw new Error("JWT_SECRET not set in .env.local");
    const body = await req.json();
    const { username, password } = body || {};
    if (!username || !password) return NextResponse.json({ error: "username and password required" }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ username });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return NextResponse.json({ ok: true, token });
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
