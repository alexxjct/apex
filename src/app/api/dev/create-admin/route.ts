import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

const ADMIN_CREATE_KEY = process.env.ADMIN_CREATE_KEY as string;

interface CreateAdminRequestBody {
  key?: unknown;
  username?: unknown;
}

export async function POST(req: Request) {
  try {
    if (!ADMIN_CREATE_KEY) {
      return NextResponse.json({ error: "ADMIN_CREATE_KEY not set in .env.local" }, { status: 500 });
    }

    const body: CreateAdminRequestBody = await req.json();
    const { key, username } = body;

    if (key !== ADMIN_CREATE_KEY) {
      return NextResponse.json({ error: "Invalid admin creation key" }, { status: 401 });
    }

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "username required and must be a string" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.role = "admin";
    await user.save();

    return NextResponse.json({ ok: true, message: `User ${username} promoted to admin` });
  } catch (err) {
    console.error("CREATE-ADMIN ERROR:", err);

    const error = err instanceof Error ? err : new Error("Server error");

    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
