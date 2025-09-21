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
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location:{ type: String },
    arrivalLocation:{ type: String },
    departureLocation:{ type: String },
    costFrom: { type: Number, required:true },
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

tourSchema.pre("save", async function (next) {
  this.slug = this.title.toLocaleLowerCase().split(" ").join("-");

  // if(this.isModified("title")){
  // this.slug = this.title.toLocaleLowerCase().split(" ").join("-");
  // }

  next();
});

tourSchema.pre("findOneAndUpdate", async function (next) {
  //to access tour data  need to this.getUpdate()
  const tour = this.getUpdate() as ITour;
  if (tour.title) {
    tour.slug = tour.title.toLocaleLowerCase().split(" ").join("-");
  }
  //after modify via middleware need to set manually
  this.setUpdate(tour);
  next()
});

export const Tour = model<ITour>("Tour", tourSchema);
