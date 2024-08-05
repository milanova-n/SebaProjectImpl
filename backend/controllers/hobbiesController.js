import {SubCategory} from "../models/subCategoryModel.js";
import router from "./categoryController.js";
import {checkAuth} from "../middleware/authorization.js";
import {Student} from "../models/studentModel.js";
import {Course} from "../models/courseModel.js";

router.get("/all", async (req, res) => {
    // For now the hobbies are just stored in the subcategories, so we just return all subcategories that are not strings
    //Structure in backend is prepared for (maybe) future changes, like extra model for hobbies

    const subCategories = await SubCategory.find({
        /*"subCategory": {"$type": "string"}*/
        $and: [
        { "subCategory": { $type: "string" } },
        { "subCategory": { $ne: "Other" } }
    ]
    });
    return res.status(200).send(subCategories);
});

router.get("/hobbiesFromStudent", checkAuth, async (req, res) => {
    const userId = req.userId;
    let student = await Student.findById(userId);
    if (!student) {
        return res.status(404).send({message: "Student not found"});
    }
    let hobbies = []
    for (let hobby of student.hobbies) {

        hobbies.push(await SubCategory.findById(hobby));
    }
    return res.status(200).send(hobbies);
});

router.put("/updateHobbiesForStudent", checkAuth, async (req, res) => {
    const userId = req.userId;
    const { hobbyIds } = req.body;
    let student = await Student.findById(userId);
    if (!student) {
        return res.status(404).send({message: "Student not found"});
    }
    try {
        student.hobbies = hobbyIds;
        await student.save();
        return res.status(200).send({message: "Courses updated successfully"});
    } catch {
        return res.status(500).send({message: "Error in updating courses for student"});
    }
});






export default router;