import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from "http-status-codes";

//--------------------Tour Type --------------------//
const createTourType = async (payload: ITourType) => {
  const isTourTypeExist = await TourType.findOne({ name: payload.name });
  if (isTourTypeExist) {
    throw new AppError(httpStatus.CONFLICT, "This tour type is already exist.");
  }

  const tourType = await TourType.create(payload);
  return tourType;
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

const getAllTour = async (query: Record<string, string>) => {
  const filter = query;
  const searchTerm  = query.searchTerm || "";

  delete filter["searchTerm"];


  // const result = await Tour.find({
  //   $or: [
  //     { title: { $regex: searchTerm, $options: "i" } },
  //     { description: { $regex: searchTerm, $options: "i" } },
  //     { location: { $regex: searchTerm, $options: "i" } },
  //   ],
  // });

  const searchAbleField = ["title", "description", "location"];

  const searchQuery = {
    $or: searchAbleField.map((field) => ({[field]: { $regex: searchTerm, $options: "i" },})),
  };

  const result = await Tour.find(searchQuery).find(filter);

  const tourCount = await Tour.countDocuments();

  return {
    data: result,
    meta: {
      total: tourCount,
    },
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isTourExist = await Tour.findById(id);
  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No tour found to update.");
  }

  //   if (payload.title) {
  //     const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-");
  //     payload.slug = baseSlug;
  //   }

  const updateTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

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
  updateTourType,
  deleteTourType,
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
};
