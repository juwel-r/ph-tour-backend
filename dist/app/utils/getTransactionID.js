"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionID = void 0;
const getTransactionID = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};
exports.getTransactionID = getTransactionID;
