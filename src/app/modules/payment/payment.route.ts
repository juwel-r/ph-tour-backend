import express from "express";
import { PaymentController } from "./payment.controller";


const router = express.Router();


router.post("/init-payment/:bookingId", PaymentController.initPayment);
router.post("/success", PaymentController.successPayment);
router.post("/failed", PaymentController.failedPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.get('/invoice/:transactionId', PaymentController.invoicePDF)
export const PaymentRoutes = router;