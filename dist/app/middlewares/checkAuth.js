"use strict";
//(...authRoles:string[]) -> ata holo ai middleware ta je route ar jonno use kora hobe sei route ta kon typer user ar jonno accessible, route theke seta param hisabe patabe
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
exports.checkAuth = void 0;
const env_config_1 = require("../config/env.config");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const jwt_1 = require("../utils/jwt");
const isUserExistOrActive_1 = require("../utils/isUserExistOrActive");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const accessToken = req.cookies.accessToken;
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.default(403, "No access token received");
        }
        // const verifiedToken = jwt.verify(accessToken, "secret");
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_config_1.envVar.JWT_ACCESS_SECRET);
        yield (0, isUserExistOrActive_1.isUserExistOrActive)(verifiedToken.email);
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.default(403, "You are not authorized person for this route.");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
