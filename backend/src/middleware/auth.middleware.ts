import { NextFunction, RequestHandler, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { verifyToken } from "../utils/tokenService";
import { AuthRequest } from "../utils/types";

export const authenticate : RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = (req.headers as { authorization?: string }).authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new ApiError(401, "Unauthorized!!")
    }

    const token = authHeader.split(" ")[1]
    try {
        const decoded = verifyToken(token)
        if(!decoded){
            throw new ApiError(401, "Unauthorized!!")
        }
        //check what is returned by verifytoken if failed
        (req as unknown as AuthRequest).userId = decoded.userId as number
        (req as unknown as AuthRequest).username = decoded.username
        next()
    } catch (error) {
        console.log(error)
        throw new ApiError(401, "Unauthorized!!")
    }
}