import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionServices } from "./division.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { Division } from "./division.model";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const division = await DivisionServices.createDivision(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Division created.",
    data: division,
  });
});

const getAllDivision = catchAsync(async (req: Request, res: Response) => {
  const allDivision = await DivisionServices.getAllDivision();
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All division Retrieved.",
    data: allDivision,
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const division = await Division.findOne({ slug });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Division Retrieved.",
    data: division,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const id = req.params.id;
  const updateDivision = await DivisionServices.updateDivision(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Division updated.",
    data: updateDivision,
  });
});


const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const deleteDivision = await DivisionServices.deleteDivision(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Division Deleted.",
    data: deleteDivision,
  });
});



export const DivisionController = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
