import mongoose from "mongoose";
import { locationSchema } from "./locationModel.js";

const eventSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    eventSubmitter: { type: String, required: true },
    eventName: { type: String, required: true },
    eventStartDate: { type: Date, required: true },
    eventEndDate: { type: Date, required: true },
    eventRecurring: { type: String, required: false },
    eventDescription: { type: String, required: true },
    eventWebsite: { type: String, required: false },
    eventSocialMedia: { type: String, required: false },
    eventCategory: { type: String, required: true },
    eventLocation: { type: locationSchema, required: true },
    headerPicture: { type: String, required: false },
    price: { type: mongoose.Types.Decimal128, required: true },
    picture: { type: String, required: false },
    published: { type: Boolean, required: true },
    ratings: { type: Number, required: false },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    hobbies: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
    participants: { type: Number, required: true },
    paid: { type: Boolean, required: true },
    recurringEvent: {
      type: String,
      enum: ["once", "weekly", "biweekly", "monthly"],
      default: "once",
      required: false,
    },
    cloudinary_id: {
      type: String,
    },
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: false,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DECLINED"],
      required: false,
    },
    notification: { type: String, required: false },

        //If Submitter uses a different category than the ones provided
        //Later needed for to make them into a new category
        eventOtherTopCategory: {type: String, required: false},
        eventOtherSubCategory: {type: String, required: false},
        tickets: [{type: mongoose.Schema.Types.ObjectId, ref: "Student"}],
    },
    {timestamps: true}
);

export const Event = mongoose.model("Event", eventSchema); //events as collection
