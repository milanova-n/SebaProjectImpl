import mongoose from "mongoose";
import { User } from "../models/userModel.js";
const Schema = mongoose.Schema;

const studentSchema = mongoose.Schema({
  ...User.schema.obj,
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: (value) => {
        return /^[a-zA-Z0-9._%+-äöüÄÖÜ]+@tum\.de$/.test(value);
      },
    },
  },
  birthday: {
    type: Date,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },
  linkedIn: {
    type: String,
    required: false,
  },
  interests: {
    type: [String],
  },
  hobbies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  eventsParticipated: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

export const Student = mongoose.model("Student", studentSchema);
