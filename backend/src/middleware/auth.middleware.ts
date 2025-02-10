import { NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { verifyToken } from "../utils/tokenService";

export const aunthicate = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = (req.headers as { authorization?: string }).authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new ApiError(401, "Unauthorized")
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)
    //check what is returned by verifytoken if failed
    if(!decoded){
        throw new ApiError(403, "Invalid or expired token")
    }

}