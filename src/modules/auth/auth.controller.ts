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

const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const result = await authServices.signupUser(name, email, password, phone,role);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    phone: result.user.phone,
                    role: result.user.role
                }
            }
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const authControllers = {
    login,
    signup
}       