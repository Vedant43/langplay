import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import ApiError from "./ApiError";

dotenv.config();

export interface TokenPayload extends JwtPayload {
  userId: number;
  username: string;
}

const privateKey = fs.readFileSync(path.join(__dirname, "../keys/private.pem"), "utf8");
const publicKey = fs.readFileSync(path.join(__dirname, "../keys/public.pem"), "utf8");

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "20d",
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) : TokenPayload => {
  const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    if (typeof decoded !== "object" || decoded === null) {
        throw new ApiError(403, "Invalid or expired token");
    }

    return decoded as TokenPayload
    // return jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as TokenPayload  
};
