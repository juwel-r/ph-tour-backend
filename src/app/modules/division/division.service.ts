import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { searchAbleField } from "./division.constraint";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatusCodes from "http-status-codes";

const createDivision = async (payload: IDivision) => {
  const isExistDivision = await Division.findOne({ name: payload.name });
  if (isExistDivision) {
    throw new AppError(400, "A division with this name already exists.");
  }

  const baseSlug = payload.name.toLowerCase().split(" ").join("-");
  payload.slug = `${baseSlug}-division`;
  const division = await Division.create(payload);
  return division;
};

// const getAllDivision2 = async () => {
//   const allDivision = await Division.find({});
//   const divisionCount = await Division.countDocuments();
//   return { meta: { total: divisionCount }, data: allDivision };
// };

const getAllDivision = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Division.find(), query);

  const division = await queryBuilder
    .search(searchAbleField)
    .filter()
    .fields()
    .sort()
    .paginate()
    .build();

    const meta = await queryBuilder.getMeta()

    return {
      meta:{...meta, loaded:division.length},
      data:division
    }
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const isDivisionExist = await Division.findById(id);

  if (!isDivisionExist) {
    throw new AppError(404, "No division found to update");
  }

  const isExistDivisionName = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (isExistDivisionName) {
    throw new AppError(
      httpStatusCodes.CONFLICT,
      "A division with this name already exists."
    );
  }

  if (payload.name) {
    const baseSlug = payload.name.toLowerCase().split(" ").join("-");
    payload.slug = `${baseSlug}-division`;
  }

  const updateDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updateDivision;
};

const deleteDivision = async (id: string) => {
  const isExistDivision = await Division.findById(id);
  if (!isExistDivision) {
    throw new AppError(404, "Division is not exist.");
  }

  await Division.findByIdAndDelete(id);
  return null;
};

export const DivisionServices = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleteDivision,
};
