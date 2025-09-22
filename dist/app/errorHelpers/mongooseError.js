"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = exports.handleCastError = exports.handleDuplicateError = void 0;
const handleDuplicateError = (error) => {
    const message = error.message.match(/"([^"]+)"/)[1] + " - is already registered.";
    return {
        StatusCode: 400,
        message: message,
    };
};
exports.handleDuplicateError = handleDuplicateError;
const handleCastError = () => {
    return {
        StatusCode: 400,
        message: "Invalid MongoDB ObjectID",
    };
};
exports.handleCastError = handleCastError;
const handleValidationError = (error) => {
    const errorSources = [];
    Object.values(error.errors).forEach((errObject) => errorSources.push({ name: errObject.path, message: errObject.message }));
    return {
        StatusCode: 400,
        message: { name: "Validation Error", errorSources },
    };
};
exports.handleValidationError = handleValidationError;
