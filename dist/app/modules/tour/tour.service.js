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
exports.TourServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tour_constraint_1 = require("./tour.constraint");
const tour_model_1 = require("./tour.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
//--------------------Tour Type --------------------//
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (isTourTypeExist) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "This tour type is already exist.");
    }
    const tourType = yield tour_model_1.TourType.create(payload);
    return tourType;
});
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findById(id);
    if (!isTourTypeExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No tour type found to update.");
    }
    const updateTourType = yield tour_model_1.TourType.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updateTourType;
});
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findById(id);
    if (!isTourTypeExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No tour type found to delete.");
    }
    yield tour_model_1.TourType.findByIdAndDelete(id);
    return null;
});
//--------------------Tour --------------------//
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourExist = yield tour_model_1.Tour.findOne({ title: payload.title });
    if (isTourExist) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A tour with this title already exists.");
    }
    // slug created at pre hook
    //   const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-");
    //   payload.slug = `${baseSlug}-tour`;
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
// const getAllTour = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   //fields filtering
//   const fields = query.fields?.split(",").join(" ") || "";
//   //pagination
// const page = Number(query.page) || 1;
// const limit = Number(query.limit) || 5;
// const skip = (page - 1) * limit;
//   // => deleted other field from filter, otherwise result will empty
//   // delete filter["searchTerm"];
//   // delete filter["sort"];
//   for (const field of excludeField) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }
//   // const result = await Tour.find({
//   //   $or: [
//   //     { title: { $regex: searchTerm, $options: "i" } },
//   //     { description: { $regex: searchTerm, $options: "i" } },
//   //     { location: { $regex: searchTerm, $options: "i" } },
//   //   ],
//   // });
//   //dynamic way
// const searchQuery = {
//   $or: searchAbleField.map((field) => ({
//     [field]: { $regex: searchTerm, $options: "i" },
//   })),
// };
//   // const result = await Tour.find(searchQuery)
//   //   .find(filter)
//   //   .sort(sort)
//   //   .select(fields)
//   //   .skip(skip)
//   //   .limit(limit);
//   const filterQuery = Tour.find(filter);
//   const tours = filterQuery.find(searchQuery);
//   const result = await tours.sort(sort).select(fields).skip(skip).limit(limit);
// const tourCount = await Tour.countDocuments();
// const totalPage = Math.ceil(tourCount / limit);
// const meta = {
//   page: page,
//   limit: limit,
//   totalPage: totalPage,
//   total: tourCount,
// };
//   return {
//     meta: meta,
//     data: result,
//   };
// };
const getAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = yield queryBuilder
        .filter()
        .search(tour_constraint_1.searchAbleField)
        .sort()
        .fields()
        .paginate()
        .build();
    const meta = yield queryBuilder.getMeta();
    return {
        meta: Object.assign(Object.assign({}, meta), { loaded: tours.length }),
        data: tours,
    };
});
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const isTourExist = yield tour_model_1.Tour.findById(id);
    //if user only add images
    if (((_a = payload.images) === null || _a === void 0 ? void 0 : _a.length) && ((_b = isTourExist === null || isTourExist === void 0 ? void 0 : isTourExist.images) === null || _b === void 0 ? void 0 : _b.length)) {
        payload.images = [...isTourExist.images, ...payload.images];
    }
    //if user  delete images
    if (((_c = payload.deleteImages) === null || _c === void 0 ? void 0 : _c.length) && ((_d = isTourExist === null || isTourExist === void 0 ? void 0 : isTourExist.images) === null || _d === void 0 ? void 0 : _d.length)) {
        const remainingImages = isTourExist.images.filter((img) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(img)); });
        const updatePayloadImg = (payload.images || [])
            .filter((img) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(img)); })
            .filter((img) => !remainingImages.includes(img));
        /**
          payload.images = 1234
          isTourExist.images =5678
          payload.delete=56
    
          remainingImages = 78
          updatePayloadImg = 12345678 -> 123478 ->1234
           */
        payload.images = [...remainingImages, ...updatePayloadImg];
        // mean that, if user delete and add images --> 1st filter and select undeleted urls, then add new images (payload.images) array with previously remainingImages
    }
    if (!isTourExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No tour found to update.");
    }
    const updateTour = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (((_e = payload.deleteImages) === null || _e === void 0 ? void 0 : _e.length) && ((_f = isTourExist === null || isTourExist === void 0 ? void 0 : isTourExist.images) === null || _f === void 0 ? void 0 : _f.length)) {
        yield Promise.all(payload.deleteImages.map((url) => (0, cloudinary_config_1.cloudinaryDelete)(url)));
    }
    return updateTour;
});
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourExist = yield tour_model_1.Tour.findById(id);
    if (!isTourExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No tour found to delete.");
    }
    yield tour_model_1.Tour.findByIdAndDelete(id);
    return null;
});
exports.TourServices = {
    createTourType,
    updateTourType,
    deleteTourType,
    createTour,
    getAllTour,
    updateTour,
    deleteTour,
};
