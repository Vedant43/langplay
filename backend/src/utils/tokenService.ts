import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const privateKey = fs.readFileSync(path.join(__dirname, "../keys/private.pem"), "utf8");
const publicKey = fs.readFileSync(path.join(__dirname, "../keys/public.pem"), "utf8");

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "20s",
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, publicKey, { algorithms: ["RS256"] });  
};
