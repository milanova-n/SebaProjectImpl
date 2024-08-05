import express from "express";
import {SubCategory} from "../models/subCategoryModel.js";
import {TopCategory} from "../models/topCategoryModel.js";
import {checkAuth} from "../middleware/authorization.js";
import {Course} from "../models/courseModel.js";
import mongoose from "mongoose";

const router = express.Router();
router.get("/topCategories/all", async (req, res) => {
    const topCategories = await TopCategory.find();
    return res.status(200).send(topCategories);
});

//Get top categories (submit event & categories bar)
router.get("/topCategories", async (req, res) => {
    const {userRole} = req.query;

    let query = {};

    //Companies should not be able to create/ see study groups
    if (userRole === "company") {
        query.topCategory = {$ne: "Study Group"};
    }

    let topCategories = await TopCategory.find(query);
    return res.status(200).send(topCategories);
});

router.get("/topCategories/:id", async (req, res) => {
    const {id} = req.params;
    let topCategory = await TopCategory.findById(id);
    if (topCategory) {
        return res.status(200).send(topCategory);
    } else {
        return res.status(404).send({message: "Category not found"});
    }
});

router.post("/topCategories", checkAuth, async (req, res) => {
    const {topCategory: topCategory} = req.body;
    const newTopCategory = new TopCategory({
        topCategory: topCategory
    });
    const savedCategory = await newTopCategory.save();
    if (savedCategory) {
        return res.status(201).send({message: "Category created", data: savedCategory});
    } else {
        return res.status(500).send({message: "Error in creating category"});
    }

});

router.get("/subCategories/all", async (req, res) => {
    const {userRole} = req.params;

    let query = {};

    if (userRole === "company") {
        query.topCategory = {$ne: "Study Group"};
    }
    const subCategories = await SubCategory.find(query);

    for (let subCategory of subCategories) {
        if (mongoose.Types.ObjectId.isValid(subCategory.subCategory)) {
            subCategory.subCategory = await Course.findById(subCategory.subCategory);
        }
    }
    return res.status(200).send(subCategories);
});

//Get subcategories without courses (Students with own courses will be fetched elsewhere)
router.get("/subcategories/withoutCourses", async (req, res) => {
    // Using $not with $type to exclude documents where `subCategory` is an object
    const subCategories = await SubCategory.find({
        "subCategory": {"$type": "string"}
    });
    return res.status(200).send(subCategories);

});

router.get("/subCategories", async (req, res) => {
    const topCategory = req.header("topCategory")
    if (!topCategory) {
        return res.status(400).send({message: "Top category not provided"});
    }
    let existingTopCategory;
    try {
        existingTopCategory = await TopCategory.findById({_id: topCategory});
    } catch (e) {
        return res.status(500).send({message: "Error in finding top category"});
    }

    let subCategories = await SubCategory.find({topCategory: existingTopCategory._id});

    for (let subCategory of subCategories) {
        if (mongoose.Types.ObjectId.isValid(subCategory.subCategory)) {
            subCategory.subCategory = await Course.findById(subCategory.subCategory);
        }
    }


    if (subCategories) {
        return res.status(200).send(subCategories);
    } else {
        return res.status(404).send({message: "Category not found"});
    }
});

router.get("/subCategories/:id", async (req, res) => {
    const {id} = req.params;
    let subCategory = await SubCategory.findById(id);

    if (!subCategory) {
        return res.status(404).send({message: "Category not found"});
    }
    if (mongoose.Types.ObjectId.isValid(subCategory.subCategory)) {
        const course = await Course.findById(subCategory.subCategory);
        if (course) {
            subCategory.subCategory = course;
        }
    }
    return res.status(200).send(subCategory);
});

router.post("/subCategories", async (req, res) => {
    const {subCategory, topCategory} = req.body;
    const existingTopCategory = await TopCategory.findOne({topCategory: topCategory});
    if (!existingTopCategory) {
        return res.status(404).send({message: "Top category not found"});
    }
    const newSubCategory = new SubCategory({
        subCategory: subCategory,
        topCategory: existingTopCategory._id
    });
    const savedSubCategory = await newSubCategory.save();
    if (savedSubCategory) {
        return res.status(201).send({message: "Subcategory created", data: savedSubCategory});
    } else {
        return res.status(500).send({message: "Error in creating subcategory"});
    }
});

//Code to add a list of courses into the database
/*router.post("/subCategories/courses", async (req, res) => {
    const {courses, topCategory} = req.body;
    const savedSubCategories = [];

    const existingTopCategory = await TopCategory.findOne({topCategory: topCategory});
    if (!existingTopCategory) {
        return res.status(404).send({message: "Top category not found"});
    }

    for (let course of courses) {
        const {courseName, courseIDs} = course;
        const newCourse = new Course({
            courseName: courseName,
            courseIDs: courseIDs
        });
        const savedCourse = await newCourse.save();
        if (!savedCourse) {
            return res.status(500).send({message: "Error in creating course"});
        }
        const newSubCategory = new SubCategory({
            subCategory: savedCourse._id,
            topCategory: existingTopCategory._id
        });
        const savedSubCategory = await newSubCategory.save();
        if (!savedSubCategory) {
            return res.status(500).send({message: "Error in creating subcategory"});
        }
        savedSubCategories.push(savedSubCategory);
    }

    return res.status(201).send({message: "Subcategories created", data: savedSubCategories});
});*/


export default router;
