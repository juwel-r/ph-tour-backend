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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.MONGODB_LOCAL);
            console.log("Mongoose connected.");
            server = app_1.default.listen(5000, () => {
                console.log("Server is listening on port 5000");
            });
        }
        catch (error) {
            console.log({ name: error.name, message: error.message });
        }
    });
}
main();
//==>> Error Handler
// See details about error handler => '../___notes.js'
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
