import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
export const secreatKey = 'SeCrEaT'

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']!;
    const token = authHeader?.split(' ')[1];
    const data = jwt.verify(token, secreatKey);

    if (!data) {
        res.status(400).json({ message: "no wallet address found" });
        return
    }
    // @ts-ignore
    if (data.userID) {
        //@ts-ignore
        req.userID = data.userID;
        next();
    }
    else {
        res.status(403).json({ message: "please connect wallet" })
        return
    }
}
