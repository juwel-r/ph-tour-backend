import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  { name: { type: String, require: true } },
  { versionKey: false, timestamps: true }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    costFrom: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlane: { type: [String], default: [] },
    maxGuest: { type: String },
    minAge: { type: String },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: Schema.Types.ObjectId, ref: "TourType", required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Tour = model<ITour>("Tour", tourSchema);
