import { Request, Response } from "express";
import { authServices } from "./auth.service";

const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        const result = await authServices.loginUser(email, password);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: result
        })
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}   

export const authControllers = {
    login
}       