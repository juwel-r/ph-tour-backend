import AppError from "../../errorHelpers/AppError";
import { searchAbleField, searchAbleFieldForTourType } from "./tour.constraint";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { cloudinaryDelete } from "../../config/cloudinary.config";

//--------------------Tour Type --------------------//
const createTourType = async (payload: ITourType) => {
  const isTourTypeExist = await TourType.findOne({ name: payload.name });
  if (isTourTypeExist) {
    throw new AppError(httpStatus.CONFLICT, "This tour type is already exist.");
  }

  const tourType = await TourType.create(payload);
  return tourType;
};

const getAllTourType = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(TourType.find(), query);
  const tourType = await queryBuilder
    .filter()
    .search(searchAbleFieldForTourType)
    .sort()
    .fields()
    .paginate()
    .build();

  const meta = await queryBuilder.getMeta();

  return {
    meta: { ...meta },
    data: tourType,
  };
};

const updateTourType = async (id: string, payload: ITourType) => {
  const isTourTypeExist = await TourType.findById(id);
  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No tour type found to update.");
  }

  const updateTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updateTourType;
};

const deleteTourType = async (id: string) => {
  const isTourTypeExist = await TourType.findById(id);
  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No tour type found to delete.");
  }
  await TourType.findByIdAndDelete(id);
  return null;
};

//--------------------Tour --------------------//
const createTour = async (payload: ITour) => {
  const isTourExist = await Tour.findOne({ title: payload.title });
  if (isTourExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A tour with this title already exists."
    );
  }

  // slug created at pre hook
  //   const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-");
  //   payload.slug = `${baseSlug}-tour`;

  const tour = await Tour.create(payload);
  return tour;
};

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

const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .filter()
    .search(searchAbleField)
    .sort()
    .fields()
    .paginate()
    .populate("division tourType")
    .build();

  const meta = await queryBuilder.getMeta();

  return {
    meta: { ...meta, loaded: tours.length },
    data: tours,
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isTourExist = await Tour.findById(id);

  //if user only add images
  if (payload.images?.length && isTourExist?.images?.length) {
    payload.images = [...isTourExist.images, ...payload.images];
  }

  //if user  delete images
  if (payload.deleteImages?.length && isTourExist?.images?.length) {
    const remainingImages = isTourExist.images.filter(
      (img:string) => !payload.deleteImages?.includes(img)
    );

    const updatePayloadImg = (payload.images || [])
      .filter((img) => !payload.deleteImages?.includes(img))
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
    throw new AppError(httpStatus.NOT_FOUND, "No tour found to update.");
  }

  const updateTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.deleteImages?.length && isTourExist?.images?.length) {
    await Promise.all(payload.deleteImages.map((url) => cloudinaryDelete(url)));
  }

  return updateTour;
};

const deleteTour = async (id: string) => {
  const isTourExist = await Tour.findById(id);
  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No tour found to delete.");
  }
  await Tour.findByIdAndDelete(id);
  return null;
};

export const TourServices = {
  createTourType,
  getAllTourType,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
};
