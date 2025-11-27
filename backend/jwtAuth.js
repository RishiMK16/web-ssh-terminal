// backend/jwt.js
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key";

// Create a token
export function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
}

// Verify a token
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}
