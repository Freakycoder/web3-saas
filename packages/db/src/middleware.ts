import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
export const secreatKey = 'SeCrEaT'

export const userMiddleware = (req: Request, res: Response, next : NextFunction) => {
    const authHeader = req.headers['authorization'] ?? '';
    const data = jwt.verify(authHeader, secreatKey );

    if(!data){
        res.status(400).json({message : "no wallet address found"});
        return
    }
    // @ts-ignore
    if(data.userID){
        //@ts-ignore
        req.userID = data.userID;
        next();
    }
    else{
        res.status(403).json({message : "please connect wallet"})
        return
    }
}

export const workerMiddleware = (req: Request, res: Response, next : NextFunction) => {
    const authHeader = req.headers['authorization'] ?? '';
    const data = jwt.verify(authHeader, secreatKey );

    if(!data){
        res.status(400).json({message : "no wallet address found"});
        return
    }
    // @ts-ignore
    if(data.userID){
        //@ts-ignore
        req.userID = data.userID;
        next();
    }
    else{
        res.status(403).json({message : "please connect wallet"})
        return
    }
}