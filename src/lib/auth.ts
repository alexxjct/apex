import jwt, { JwtPayload } from "jsonwebtoken";
import { RevokedToken } from "@/models/RevokedToken";
import { connectToDatabase } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenPayload extends JwtPayload {
  userId?: string;
  username?: string;
  role?: string;
}

export async function verifyTokenFromHeader(req: Request) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");
  const auth = req.headers.get("authorization");
  if (!auth) throw new Error("Token missing");
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) throw new Error("Invalid authorization header");

  await connectToDatabase();
  const revoked = await RevokedToken.findOne({ token }).lean();
  if (revoked) throw new Error("Token revoked");

  const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
  return { token, payload };
}
