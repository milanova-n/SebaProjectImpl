import mongoose from "mongoose";

const topCategorySchema = mongoose.Schema(
    {
        topCategory: { type: String, required: true },
    },
  { timestamps: true }
);

export const TopCategory = mongoose.model("TopCategory", topCategorySchema);