import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const route = Router();

route.post("/register",validateRequest(createUserZodSchema),UserControllers.createUser);
route.get("/all-users",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),UserControllers.getAllUsers);
route.get("/me",checkAuth(...Object.values(Role)),UserControllers.getMe);
route.get("/:id",checkAuth(...Object.values(Role)),UserControllers.getSingleUser);
route.patch("/:id",validateRequest(updateUserZodSchema),checkAuth(...Object.values(Role)),UserControllers.updateUser);

export const UserRoutes = route;
