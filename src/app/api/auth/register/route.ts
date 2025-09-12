import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json({ error: "username and password required" }, { status: 400 });
    }
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid input types" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashed,
      role: "user",
      createdAt: new Date(),
    });

    await user.save();

    return NextResponse.json({ ok: true, message: "User created" }, { status: 201 });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
