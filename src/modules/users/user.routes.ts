import { Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
const router = Router();

//create user
router.post("/", userControllers.cretateUser);

router.get("/", userControllers.getUsers);

router.get("/:id", userControllers.getSingleUser);

router.put("/:id", userControllers.updateUser);

router.delete("/:id", userControllers.deleteUser);

export const userRoutes = router;

