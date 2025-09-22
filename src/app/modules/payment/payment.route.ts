import express from "express";
import { PaymentController } from "./payment.controller";


const router = express.Router();


router.post("/init-payment/:bookingId", PaymentController.initPayment);
router.post("/success", PaymentController.successPayment);
router.post("/failed", PaymentController.failedPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.get('/invoice/:transactionId', PaymentController.invoicePDF)
router.post('/validate-payment', PaymentController.validatePayment) 
//this api will call from sslCommerz and sslCommerz will sed data via req.body and then with those data another api will call in client -> created a api in sslCommerz moduler

export const PaymentRoutes = router;