import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourTypeZodSchema,
  updateTourZodSchema,
} from "./tour.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TourController } from "./tour.controller";

const router = Router();
// ---------------------Tour Type-----------------------
router.post(
  "/create-tour-type",
  validateRequest(createTourTypeZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.createTourType
);

router.get("/tour-type", TourController.getTourType);

router.patch(
  "/tour-type/:id",
  validateRequest(updateTourTypeZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.updateTourType
);

router.delete(
  "/tour-type/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTourType
);
// ------------------------Tour--------------------------//

router.post(
  "/create",
  validateRequest(createTourZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.createTour
);

router.get("/", TourController.getAllTour);
router.get("/:id", TourController.getSingleTour);

router.patch(
  "/:id",
  validateRequest(updateTourZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.updateTour
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour
);

router.post(
  "/create-bulk",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.createBulk
);

export const TourRoute = router;
