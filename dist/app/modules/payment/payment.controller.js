"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const payment_service_1 = require("./payment.service");
const sslPaymentUrl_1 = require("../../utils/sslPaymentUrl");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const initPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.params;
    const result = yield payment_service_1.PaymentService.initPayment(bookingId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Payment URL Generate successful.",
        data: result,
    });
}));
const successPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.query.transactionId;
    const amount = Number(req.query.amount);
    const result = yield payment_service_1.PaymentService.successPayment(transactionId);
    if (result.success) {
        res.redirect((0, sslPaymentUrl_1.sslPaymentUrl)("SUCCESS_FRONTEND", transactionId, amount));
    }
}));
const failedPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.query.transactionId;
    const amount = Number(req.query.amount);
    const result = yield payment_service_1.PaymentService.failedPayment(transactionId);
    if (!result.success) {
        res.redirect((0, sslPaymentUrl_1.sslPaymentUrl)("FAILED_FRONTEND", transactionId, amount));
    }
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.query.transactionId;
    const amount = Number(req.query.amount);
    const result = yield payment_service_1.PaymentService.cancelPayment(transactionId);
    if (!result.success) {
        res.redirect((0, sslPaymentUrl_1.sslPaymentUrl)("CANCEL_FRONTEND", transactionId, amount));
    }
}));
const invoicePDF = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.params.transactionId;
    const result = yield payment_service_1.PaymentService.invoicePDF(transactionId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Payment URL Generate successful.",
        data: result,
    });
}));
const validatePayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield sslCommerz_service_1.SSLService.validatePayment(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Payment validation successful.",
        data: null,
    });
}));
exports.PaymentController = {
    initPayment,
    successPayment,
    failedPayment,
    cancelPayment,
    invoicePDF,
    validatePayment,
};
