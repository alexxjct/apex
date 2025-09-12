import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

const ADMIN_CREATE_KEY = process.env.ADMIN_CREATE_KEY as string;

export async function POST(req: Request) {
  try {
    if (!ADMIN_CREATE_KEY) {
      return NextResponse.json({ error: "ADMIN_CREATE_KEY not set in .env.local" }, { status: 500 });
    }
    const body = await req.json();
    const { key, username } = body || {};
    if (key !== ADMIN_CREATE_KEY) return NextResponse.json({ error: "Invalid admin creation key" }, { status: 401 });
    if (!username) return NextResponse.json({ error: "username required" }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ username });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.role = "admin";
    await user.save();

    return NextResponse.json({ ok: true, message: `User ${username} promoted to admin` });
  } catch (err: any) {
    console.error("CREATE-ADMIN ERROR:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
