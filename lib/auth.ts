import { SignJWT, jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);
export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

export async function createSession(userId: string, role: string) {
  return await new SignJWT({
    userId,
    role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey);
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      secretKey
    );

    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}
