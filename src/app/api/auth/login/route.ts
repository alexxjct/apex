import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"; // 👈 para tipar ObjectId
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface LoginRequestBody {
  username?: string;
  password?: string;
}

export async function POST(req: Request) {
  try {
    if (!JWT_SECRET) throw new Error("JWT_SECRET not set in .env.local");

    const body: LoginRequestBody = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "username and password required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Corregido para castear el _id como ObjectId o string
    const token = jwt.sign(
      {
        userId: (user._id as mongoose.Types.ObjectId).toString(),
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return NextResponse.json({ ok: true, token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    const error = err instanceof Error ? err : new Error("Unknown error");

    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
