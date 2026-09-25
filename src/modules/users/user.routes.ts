import { Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
const router = Router();

//create user
router.post("/", userControllers.cretateUser);

router.get("/",logger, auth("admin"), userControllers.getUsers);

router.get("/:id",logger, auth("admin", "customer"), userControllers.getSingleUser);

router.put("/:id",logger, auth("admin", "customer"), userControllers.updateUser);

router.delete("/:id",logger, auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
