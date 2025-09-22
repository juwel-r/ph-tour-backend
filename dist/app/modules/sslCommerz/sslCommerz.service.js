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
exports.SSLService = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const env_config_1 = require("../../config/env.config");
const sslPaymentUrl_1 = require("../../utils/sslPaymentUrl");
const payment_model_1 = require("../payment/payment.model");
const sslPaymentInit = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, name, email, address, phone, transactionId } = payload;
    try {
        const data = {
            store_id: env_config_1.envVar.SSL.SSL_STORE_ID,
            store_passwd: env_config_1.envVar.SSL.SSL_STORE_PASS,
            total_amount: amount,
            currency: "BDT",
            tran_id: transactionId,
            success_url: (0, sslPaymentUrl_1.sslPaymentUrl)("SUCCESS_BACKEND", transactionId, amount),
            fail_url: (0, sslPaymentUrl_1.sslPaymentUrl)("FAILED_BACKEND", transactionId, amount),
            cancel_url: (0, sslPaymentUrl_1.sslPaymentUrl)("CANCEL_BACKEND", transactionId, amount),
            ipn_url: env_config_1.envVar.SSL.SSL_IPN_URL,
            shipping_method: "N/A",
            product_name: "Tour",
            product_category: "Service",
            product_profile: "General",
            cus_name: name,
            cus_email: email,
            cus_add1: address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "N/A",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: phone,
            cus_fax: "N/A",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: "N/A",
            ship_country: "N/A",
        };
        const response = yield (0, axios_1.default)({
            method: "POST",
            url: env_config_1.envVar.SSL.SSL_PAYMENT_API,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response.data;
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
    }
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, axios_1.default)({
        method: "GET",
        url: `${env_config_1.envVar.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${env_config_1.envVar.SSL.SSL_STORE_ID}&store_passwd=${env_config_1.envVar.SSL.SSL_STORE_PASS}`,
    });
    // eslint-disable-next-line no-console
    console.log({ validate_response: response.data });
    yield payment_model_1.Payment.updateOne({ transactionId: payload.tran_id }, { paymentGatewayData: response.data });
    /**
     1st sslCommerz will call a api which is created in payment -> "payment/validate-payment", then sslCommerz send some data with api req.body as payload (including "val_id"). sslServices.validatePayment() called from payment module and passed argument "req.body" which sslCommerz send, here i received as payload
     */
});
exports.SSLService = {
    sslPaymentInit,
    validatePayment,
};
