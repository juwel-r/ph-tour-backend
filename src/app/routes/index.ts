import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { DivisionRoute } from "../modules/division/division.route";
import { TourRoute } from "../modules/tour/tour.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { OtpRoutes } from "../modules/otp/otp.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
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
  {
    path: "/division",
    route: DivisionRoute,
  },
  {
    path: "/tour",
    route: TourRoute,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
