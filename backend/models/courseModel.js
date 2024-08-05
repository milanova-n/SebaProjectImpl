import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
    {
        courseName: { type: String, required: true },
        courseIDs: [{ type: String, required: true }],
    },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);