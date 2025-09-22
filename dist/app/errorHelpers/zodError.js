"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (error) => {
    const errorSources = [];
    error.issues.forEach((issue) => {
        errorSources.push({
            // name: issue.path[issue.path.length - 1],
            //jokhon nested field hoy tokhon array ar modde array ar last ar value ta original field name hoy
            name: issue.path.reverse().join(" inside "), //this is best practice
            message: issue.message,
        });
    });
    return {
        statusCode: 400,
        message: { name: "Validation Error", errorSources },
    };
};
exports.handleZodError = handleZodError;
