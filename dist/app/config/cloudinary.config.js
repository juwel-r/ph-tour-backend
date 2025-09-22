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
exports.cloudinaryDelete = exports.cloudinaryBufferUpload = exports.cloudinaryUpload = void 0;
const cloudinary_1 = require("cloudinary");
const env_config_1 = require("./env.config");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const stream_1 = __importDefault(require("stream"));
cloudinary_1.v2.config({
    cloud_name: env_config_1.envVar.CLOUDINARY_CLOUD_NAME,
    api_secret: env_config_1.envVar.CLOUDINARY_API_SECRET,
    api_key: env_config_1.envVar.CLOUDINARY_API_KEY,
});
exports.cloudinaryUpload = cloudinary_1.v2;
const cloudinaryBufferUpload = (buffer, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const publicId = `pdf/${fileName}-${Date.now()}`;
            const bufferStream = new stream_1.default.PassThrough();
            bufferStream.end();
            cloudinary_1.v2.uploader.upload_stream({
                resource_type: "auto",
                public_id: publicId,
                folder: "pdf",
            }, (error, result) => {
                if (error)
                    reject(error);
                resolve(result);
            })
                .end(buffer);
        });
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
});
exports.cloudinaryBufferUpload = cloudinaryBufferUpload;
const cloudinaryDelete = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // eslint-disable-next-line no-useless-escape
        const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/i);
        const public_id = match ? match[1] : "";
        yield cloudinary_1.v2.uploader.destroy(public_id);
        // console.log(`${public_id} is deleted form cloudinary`);
    }
    catch (error) {
        throw new AppError_1.default(401, "Cloudinary image deletion failed!", error.message);
    }
});
exports.cloudinaryDelete = cloudinaryDelete;
