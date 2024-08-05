import mongoose from "mongoose";
import { User } from "../models/userModel.js";

const companySchema = new mongoose.Schema();

companySchema.add({
  ...User.schema.obj,
  companyName: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: false,
  },
  profession: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
});

export const Company = mongoose.model("Company", companySchema);
