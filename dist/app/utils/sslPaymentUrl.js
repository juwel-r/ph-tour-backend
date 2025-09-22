"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sslPaymentUrl = void 0;
const env_config_1 = require("../config/env.config");
const sslPaymentUrl = (urlType, transactionId, amount) => {
    const status = urlType.toLowerCase().split(/_backend|_frontend/)[0];
    const url = env_config_1.envVar.SSL[`SSL_${urlType}_URL`] +
        `?transactionId=${transactionId}&amount=${amount}&status=${status}`;
    return url;
};
exports.sslPaymentUrl = sslPaymentUrl;
