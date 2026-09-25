import { Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

//http://localhost:5000/api/v1/auth/signin
router.post("/signin", authControllers.login);

//http://localhost:5000/api/v1/auth/signup
router.post("/signup", authControllers.signup);

export const authRoutes = router;