"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundRoute = void 0;
const http_status_codes_1 = require("http-status-codes");
const NotFoundRoute = (req, res) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Route not found.",
    });
};
exports.NotFoundRoute = NotFoundRoute;
