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
exports.DivisionServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const division_constraint_1 = require("./division.constraint");
const division_model_1 = require("./division.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistDivision = yield division_model_1.Division.findOne({ name: payload.name });
    if (isExistDivision) {
        throw new AppError_1.default(400, "A division with this name already exists.");
    }
    const baseSlug = payload.name.toLowerCase().split(" ").join("-");
    payload.slug = `${baseSlug}-division`;
    const division = yield division_model_1.Division.create(payload);
    return division;
});
// const getAllDivision2 = async () => {
//   const allDivision = await Division.find({});
//   const divisionCount = await Division.countDocuments();
//   return { meta: { total: divisionCount }, data: allDivision };
// };
const getAllDivision = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(division_model_1.Division.find(), query);
    const division = yield queryBuilder
        .search(division_constraint_1.searchAbleField)
        .filter()
        .fields()
        .sort()
        .paginate()
        .build();
    const meta = yield queryBuilder.getMeta();
    return {
        meta: Object.assign(Object.assign({}, meta), { loaded: division.length }),
        data: division,
    };
});
const updateDivision = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isDivisionExist = yield division_model_1.Division.findById(id);
    if (!isDivisionExist) {
        throw new AppError_1.default(404, "No division found to update");
    }
    const isExistDivisionName = yield division_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (isExistDivisionName) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A division with this name already exists.");
    }
    if (payload.name) {
        const baseSlug = payload.name.toLowerCase().split(" ").join("-");
        payload.slug = `${baseSlug}-division`;
    }
    const updateDivision = yield division_model_1.Division.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (isDivisionExist.thumbnail && payload.thumbnail) {
        yield (0, cloudinary_config_1.cloudinaryDelete)(isDivisionExist.thumbnail);
    }
    //ekhane update korar age delete kora jabe na cause, if i deleted old url and then if error occurred while update then no url will be show for this data
    return updateDivision;
});
const deleteDivision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistDivision = yield division_model_1.Division.findById(id);
    if (!isExistDivision) {
        throw new AppError_1.default(404, "Division is not exist.");
    }
    yield division_model_1.Division.findByIdAndDelete(id);
    if (isExistDivision.thumbnail) {
        yield (0, cloudinary_config_1.cloudinaryDelete)(isExistDivision.thumbnail);
    }
    return null;
});
exports.DivisionServices = {
    createDivision,
    getAllDivision,
    updateDivision,
    deleteDivision,
};
