import jwt from "jsonwebtoken";

export interface JWTPayload {
  email: string;
  role: "admin";
  iat?: number;
  exp?: number;
}

/** Sign a JWT valid for 7 days */
export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("Please define JWT_SECRET in .env.local");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/** Verify and decode a JWT. Returns null if invalid. */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) return null;
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
