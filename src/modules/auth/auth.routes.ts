import { Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

//http://localhost:5000/auth/login
router.post("/login", authControllers.login);

export const authRoutes = router;