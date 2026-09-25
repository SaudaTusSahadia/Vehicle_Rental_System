//higher order function

import config from "../config";
import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";


const auth = (...role: string[]) => {
    return async(req: Request, res: Response, next: NextFunction) => {
     try{
        const headerAuth = req.headers.authorization;
     if(!headerAuth){
        return res.status(401).json({
            success: false,
            message: "You do not have permission"
        })
     }
     const decoded = jwt.verify(headerAuth, config.jwt_secret as string) as JwtPayload;
     console.log(decoded)
     req.user = decoded ;
     if(role.length && !role.includes(decoded.role as string)){
        return res.status(401).json({
            success: false,
            message: "You do not have permission"
        })
     }
     next();
     }catch(err: any){
        return res.status(500).json({
            success: false,
            message: err.message
        })
     }
    }
}
export default auth;