import express from "express";
import { Course } from "../models/courseModel.js";
import { checkAuth } from "../middleware/authorization.js";
import { Student } from "../models/studentModel.js";
import { SubCategory } from "../models/subCategoryModel.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  let subcategories = await SubCategory.find({
    subCategory: { $type: "objectId" },
  });

  const subcategoriesObjects = subcategories.map((course) => course.toObject());

  let courses = [];
  for (let subcategory of subcategoriesObjects) {
    const courseId = subcategory.subCategory.toString();
    let courseObj = await Course.findById(courseId);
    courseObj = courseObj.toObject();
    subcategory.subCategory = courseObj;
    courses.push(subcategory);
  }

  /*
        const courses = await Course.find();
    */
  return res.status(200).send(courses);
});
router.get("/coursesFromStudent", checkAuth, async (req, res) => {
  const userId = req.userId;
  let student = await Student.findById(userId);
  if (!student) {
    return res.status(404).send({ message: "Student not found" });
  }
  const studentCoursesIds = student.courses.map((course) => course._id);
  let courses = [];
  for (let subcategoryId of studentCoursesIds) {
    let subcategoryObj = await SubCategory.findById(subcategoryId.toString());
    if (subcategoryObj) {
      subcategoryObj = subcategoryObj.toObject();
      const courseId = subcategoryObj.subCategory.toString();
      let courseObj = await Course.findById(courseId);
      courseObj = courseObj.toObject();
      subcategoryObj.subCategory = courseObj;
      courses.push(subcategoryObj);
    }
  }
  return res.status(200).send(courses);
});

router.get("/otherCoursesFromStudent", checkAuth, async (req, res) => {
  const userId = req.userId;
  let student = await Student.findById(userId);
  if (!student) {
    return res.status(404).send({ message: "Student not found" });
  }
  student = student.toObject();
  const studentCourses = student.courses.map((course) => course.toString());
  let subcategories = await SubCategory.find({
    subCategory: { $type: "objectId" },
  });

  let subcategoriesObjects = subcategories.map((course) => course.toObject());

  subcategoriesObjects = subcategoriesObjects.filter(
    (course) => !studentCourses.includes(course._id.toString())
  );

  let courses = [];

  for (let subcategory of subcategoriesObjects) {
    const courseId = subcategory.subCategory.toString();
    let courseObj = await Course.findById(courseId);
    courseObj = courseObj.toObject();
    subcategory.subCategory = courseObj;
    courses.push(subcategory);
  }

  return res.status(200).send(courses);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  let course = await Course.findById(id);
  if (course) {
    return res.status(200).send(course);
  } else {
    return res.status(404).send({ message: "Course not found" });
  }
});

//Change the whole courses for a student
router.put("/updateCoursesForStudent", checkAuth, async (req, res) => {
  const userId = req.userId;
  const { courseIds } = req.body;
  let student = await Student.findById(userId);
  if (!student) {
    return res.status(404).send({ message: "Student not found" });
  }
  try {
    student.courses = courseIds;
    await student.save();
    return res.status(200).send({ message: "Courses updated successfully" });
  } catch {
    return res
      .status(500)
      .send({ message: "Error in updating courses for student" });
  }
});

export default router;
