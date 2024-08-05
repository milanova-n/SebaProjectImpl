import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema(
    {

        subCategory: { type: mongoose.Schema.Types.Mixed, required: true },
        topCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'TopCategory' },

    },
  { timestamps: true }
);

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);