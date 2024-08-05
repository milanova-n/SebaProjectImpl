import mongoose from "mongoose";

export const locationSchema = mongoose.Schema(
    {
        country: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        street: { type: String, required: true },
        number: { type: String, required: false },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
  { timestamps: true }

);

export const location = mongoose.model("Location", locationSchema); //events as collection