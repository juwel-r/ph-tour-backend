"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post("/init-payment/:bookingId", payment_controller_1.PaymentController.initPayment);
router.post("/success", payment_controller_1.PaymentController.successPayment);
router.post("/failed", payment_controller_1.PaymentController.failedPayment);
router.post("/cancel", payment_controller_1.PaymentController.cancelPayment);
router.get('/invoice/:transactionId', payment_controller_1.PaymentController.invoicePDF);
router.post('/validate-payment', payment_controller_1.PaymentController.validatePayment);
//this api will call from sslCommerz and sslCommerz will sed data via req.body and then with those data another api will call in client -> created a api in sslCommerz moduler
exports.PaymentRoutes = router;
