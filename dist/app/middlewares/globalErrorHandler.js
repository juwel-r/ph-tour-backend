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
exports.globalErrorHandler = void 0;
const env_config_1 = require("../config/env.config");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const mongooseError_1 = require("../errorHelpers/mongooseError");
const zodError_1 = require("../errorHelpers/zodError");
const cloudinary_config_1 = require("../config/cloudinary.config");
const globalErrorHandler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_config_1.envVar.NODE_ENV === "development" ? error.stack : null) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
    //Cloudinary image delete if error occurred while execution
    if (req.file) {
        yield (0, cloudinary_config_1.cloudinaryDelete)(req.file.path);
    }
    if (req.files && Number(req.files.length) > 0) {
        const urls = req.files.map((file) => file.path);
        yield Promise.all(urls.map((url) => (0, cloudinary_config_1.cloudinaryDelete)(url)));
    }
    //Error handle
    let statusCode = 500;
    let message = error.message;
    if (error.code === 11000) {
        const simplifiedError = (0, mongooseError_1.handleDuplicateError)(error);
        statusCode = simplifiedError.StatusCode;
        message = simplifiedError.message;
    }
    else if (error.name === "CastError") {
        const simplifiedError = (0, mongooseError_1.handleCastError)();
        statusCode = simplifiedError.StatusCode;
        message = simplifiedError.message;
    }
    else if (error.name === "ValidationError") {
        const simplifiedError = (0, mongooseError_1.handleValidationError)(error);
        statusCode = simplifiedError.StatusCode;
        message = simplifiedError.message;
    }
    else if (error.name === "ZodError") {
        const simplifiedError = (0, zodError_1.handleZodError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message: message,
        error: env_config_1.envVar.NODE_ENV === "development" ? error : null,
        stack: env_config_1.envVar.NODE_ENV === "development" ? error.stack : null,
    });
});
exports.globalErrorHandler = globalErrorHandler;
