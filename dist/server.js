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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./app/config/env.config");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const redis_config_1 = require("./app/config/redis.config");
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(env_config_1.envVar.DB_URL);
            console.log("Mongoose connected.");
            server = app_1.default.listen(env_config_1.envVar.PORT, () => {
                console.log(`Server is listening on port ${env_config_1.envVar.PORT}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, redis_config_1.connectRedis)();
        yield main();
        yield (0, seedSuperAdmin_1.seedSuperAdmin)();
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}))();
process.on("uncaughtException", (error) => {
    console.log("uncaughtException error detected, server shutting down!", error.name);
    if (server) {
        server.close();
    }
    process.exit(1);
});
process.on("unhandledRejection", (error) => {
    console.log("unhandledRejection error detected, server shutting down!", error.name);
    if (server) {
        server.close();
    }
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log("Signal Termination received, shutting down server!");
    process.exit(0);
});
process.on("SIGINT", () => {
    console.log("Signal Termination received, shutting down server!");
    process.exit(0);
});
