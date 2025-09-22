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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessTokenWithRefreshToken = exports.createUserTokens = void 0;
const env_config_1 = require("../config/env.config");
const jwt_1 = require("./jwt");
const isUserExistOrActive_1 = require("./isUserExistOrActive");
const createUserTokens = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    // const accessToken = jwt.sign(jwtPayload, 'hello-secret', {expiresIn:'1h'});
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.envVar.JWT_ACCESS_SECRET, env_config_1.envVar.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.envVar.JWT_REFRESH_SECRET, env_config_1.envVar.JWT_REFRESH_EXPIRES);
    return { accessToken, refreshToken };
};
exports.createUserTokens = createUserTokens;
//create Access Token With Refresh Token if access Token expired
const createAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_config_1.envVar.JWT_REFRESH_SECRET);
    const isUserExist = yield (0, isUserExistOrActive_1.isUserExistOrActive)(verifiedRefreshToken.email);
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_config_1.envVar.JWT_ACCESS_SECRET, env_config_1.envVar.JWT_ACCESS_EXPIRES);
    return accessToken;
});
exports.createAccessTokenWithRefreshToken = createAccessTokenWithRefreshToken;
