import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { DivisionRoute } from "../modules/division/division.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/division",
    route: DivisionRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
