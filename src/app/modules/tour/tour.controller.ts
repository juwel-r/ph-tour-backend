import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { Tour, TourType } from "./tour.model";

//--------------------Tour Type --------------------//

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const result = await TourServices.createTourType(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Tour Type created successfully.",
    data: result,
  });
});

const getTourType = catchAsync(async (req: Request, res: Response) => {
  const result = await TourType.find();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour Type retrieved successfully.",
    data: result,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await TourServices.updateTourType(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour Type Updated.",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourServices.deleteTourType(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour Type deleted.",
    data: result,
  });
});

//--------------------Tour --------------------//
const createTour = catchAsync(async (req: Request, res: Response) => {
  const result = await TourServices.createTour(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Tour Type created successfully.",
    data: result,
  });
});

const createBulk = catchAsync(async (req: Request, res: Response) => {
  const result = await Tour.insertMany(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour Type deleted.",
    data: result,
  });
});

const getAllTour = catchAsync(async (req: Request, res: Response) => {
  const query = req.query
  const result = await TourServices.getAllTour(query as Record<string, string>);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour Type retrieved successfully.",
    data: result,
  });
});

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await Tour.findById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour Type retrieved successfully.",
    data: result,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await TourServices.updateTour(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour Type Updated.",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourServices.deleteTour(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour Type deleted.",
    data: result,
  });
});

export const TourController = {
  createTourType,
  getTourType,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTour,
  getSingleTour,
  updateTour,
  deleteTour,
  createBulk,
};
