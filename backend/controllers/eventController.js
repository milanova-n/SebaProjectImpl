import express from "express";
import {Event} from "../models/eventModel.js";
import {checkAuth} from "../middleware/authorization.js";
import {User} from "../models/userModel.js";
import {Student} from "../models/studentModel.js";
import {Company} from "../models/companyModel.js";
import {SubCategory} from "../models/subCategoryModel.js";
import {TopCategory} from "../models/topCategoryModel.js";
import dayjs from "dayjs";
import {Course} from "../models/courseModel.js";
import mongoose from "mongoose";

import {upload} from "../utils/multer.js";
import {cloudinary} from "../utils/cloudinary.js";

const router = express.Router();

//Sends all events to the main events page based on the params
router.get("/getAll", async (req, res) => {

    //Query from frontend (Filter after ...)
    const {
        location,
        startDate,
        endDate,
        categories,
        priceFrom,
        priceTo,
        eventAmount,
        searchString,
        sort,
    } = req.query;

    // Build query object
    let query = {};
    try {
        //Only shows approved events
        query.status = {$eq: "ACCEPTED"};

        //Date filters. Only events after today (By the second) will be shown
        if (startDate !== undefined && startDate !== " ") {
            //Checks that the searched date is not in the past
            const today = new Date();
            if (new Date(startDate) >= today) {
                query.eventStartDate = {$gte: new Date(startDate)};
            } else {
                query.eventStartDate = {$gte: new Date(today)};
            }
        }
        if (endDate !== undefined && endDate !== " ") {
            //Checks that the searched date is not in the past
            const today = new Date();
            let todayOneYearLater = new Date();
            if (new Date(endDate) >= today) {
                query.eventEndDate = {$lte: new Date(endDate)};
            } else {
                //If filter in the past, show events from today to one year later
                todayOneYearLater.setFullYear(todayOneYearLater.getFullYear() + 1);
                query.eventEndDate = {$lte: new Date(today)};
            }
        }
        //String from the search bar
        if (searchString !== undefined && searchString !== " ") {
            query.$or = [
                {eventName: {$regex: new RegExp(searchString, "i")}},
                {eventDescription: {$regex: new RegExp(searchString, "i")}},
            ];
        }
        //Location filter by München or Garching
        if (location !== undefined && location !== "") {
            query["eventLocation.city"] = {$in: location};
        }

        //Category filter
        if (categories !== undefined && categories !== "") {
            query.eventCategory = {$in: categories};
        }

        //Prices filter
        if (priceFrom !== undefined && priceFrom) {
            query.price = {...query.price, $gte: Number(priceFrom)};
        }
        if (priceTo !== undefined && priceTo) {
            query.price = {...query.price, $lte: Number(priceTo)};
        }

        //Sort request from frontend
        let sortOrder = {};
        switch (sort) {
            //Upcoming date
            case "0":
                sortOrder = {eventStartDate: 1};
                break;
            //Price low to high
            case "1":
                sortOrder = {price: 1};
                break;
            //Price high to low
            case "2":
                sortOrder = {price: -1};
                break;
        }

        // Execute query with pagination
        const events = await Event.find(query)
            .sort(sortOrder)
            //Limit as we don't have to send all events
            .limit(Number(eventAmount));

        return res.status(200).send(events);
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

//Max price needed for the price filter in the frontend
router.get("/maxPrice", async (req, res) => {
    try {
        let event = await Event.findOne().sort({price: -1}).limit(1);
        if (event) {
            event = event.toObject();
            return res.status(200).send({maxPrice: event.price});
        } else {
            return res.status(200).send({maxPrice: mongoose.Types.Decimal128.fromString("0.00")});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

router.get("/status", checkAuth, async (req, res) => {
    const {role} = req;

    if (role !== "admin") {
        return res.status(401).json({message: "Unauthorized"});
    }
    const {status} = req.query;

    if (!status) {
        return res.status(400).json({message: "Status query is not provided"});
    }
    try {
        let events = await Event.find({status: status});
        if (!events) {
            return res.status(404).json({message: "No events found"});
        }
        return res.status(200).send(events);
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

// router.get("/userEventstatus", async (req, res) => {
//   const { status } = req.query;

//   if (!status) {
//     return res.status(400).json({ message: "Status query is not provided" });
//   }
//   try {
//     let events = await Event.find({ status: status });
//     if (!events) {
//       return res.status(404).json({ message: "No events found" });
//     }
//     return res.status(200).send(events);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ message: "Internal Server Error" });
//   }
// });

/*router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    await Event.findByIdAndDelete(id);
    return res.status(200).send("ok");
});*/

//Call to pay for the event from frontend (Company pays for event)
router.patch("/:id/payEvent", checkAuth, async (req, res) => {
    const {id} = req.params;
    const userId = req.userId;
    const event = await Event.findById(id);

    //Checks for event
    if (!event) {
        return res.status(404).send({message: "Event not found"});
    }

    //Checks if the event creator matches with the user id
    if (event.userId !== userId) {
        return res
            .status(401)
            .send({message: "You are not allowed to edit this event"});
    }

    //Sets paid true for the given event id
    const updatedEvent = await Event.findByIdAndUpdate(
        id,
        {paid: true},
        {new: true}
    );

    if (!updatedEvent) {
        return res.status(404).send({message: "Event not found"});
    }

    if (updatedEvent.paid) {
        return res.status(200).send(updatedEvent);
    } else {
        return res.status(400).send({message: "Event couldn't be paid"});
    }
});

//Call to add the event id to the user object (./eventsParticipated) and userId to the event object (./tickets)
router.patch("/:id/addTicket", checkAuth, async (req, res) => {

    const {id} = req.params; //eventId
    const userId = req.userId;
    const event = await Event.findById(id);

    //Checks for event
    if (!event) {
        return res.status(404).send({message: "Event not found"});
    }
    const {participants} = event;

    if (event.tickets.includes(userId)) {
        return res
            .status(400)
            .send({message: "You already have a ticket for this event"});
    }

    if (event.tickets.length >= participants) {
        return res.status(400).send({message: "Event is already full"});
    }

    const updatedEvent = await Event.findByIdAndUpdate(
        id,
        {$addToSet: {tickets: userId}},
        {new: true}
    );

    const updateStudent = await Student.findByIdAndUpdate(
        userId,
        {$addToSet: {eventsParticipated: id}},
        {new: true}
    );

    if (!updatedEvent || !updateStudent) {
        return res
            .status(404)
            .send({message: "Ticket could not be added to event"});
    }

    return res.status(200).send(updatedEvent);
});

//Edit event
//Changes the attributes of the events
router.patch("/:id", checkAuth, async (req, res) => {
    const {id} = req.params;
    const userId = req.userId;
    const event = await Event.findById(id);

    //Checks for event
    if (!event) {
        return res.status(404).send({message: "Event not found"});
    }

    //Checks if the event creator matches with the user id
    if (event.userId !== userId) {
        return res
            .status(401)
            .send({message: "You are not allowed to edit this event"});
    }

    const eventSubCategory = await SubCategory.findById(event.eventCategory);
    const eventCategory = await TopCategory.findById(
        eventSubCategory.topCategory
    );

    const {
        eventName,
        eventDescription,
        headerPicture,
        picture,
        eventWebsite,
        eventSocialMedia,
        eventLocation,
    } = req.body;

    let newEventData = {
        eventName,
        eventDescription,
        headerPicture,
        picture,
        eventWebsite,
        eventSocialMedia,
    };

    //Location can only be changed if the event is a study group or the event costs nothing
    if (
        eventCategory.topCategory === "Study Group" ||
        Number(event.price) === 0
    ) {
        newEventData = {...newEventData, eventLocation};
    }
    // when we update the event, it should be proved again by the admin
    newEventData = {...newEventData, status: "PENDING"};
    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, newEventData, {
            new: true,
        });
        if (!updatedEvent) {
            return res.status(404).send({message: "Event not found"});
        } else {
            return res.status(200).send(updatedEvent);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

router.get("/edit/getAll", checkAuth, async (req, res) => {
    try {
        let events = await Event.find({userId: req.userId});
        return res.status(200).send(events);
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

router.get("/:id", checkAuth, async (req, res) => {
    const {id} = req.params;
    try {
        let event = await Event.findById(id).populate("tickets", [
            "_id",
            "firstName",
            "lastName",
        ]);
        if (event) {
            return res.status(200).send(event);
        } else {
            return res.status(404).send({message: "Event not found"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

router.get("/:id/participants", checkAuth, async (req, res) => {
    const {id} = req.params;
    try {
        let event = await Event.findById(id);
        if (!event) {
            return res.status(404).send({message: "Event not found"});
        }

        let userIds = event.tickets;
        userIds = JSON.parse(JSON.stringify(userIds));
        // return res.status(200).send(userIds);
        const userPromises = userIds.map(async (userId) => {
            const user = await Student.findById(userId);
            if (!user) {
                console.log("Could not find user in database");
                return res.status(500).send({message: "Internal Server Error"});
            }
            const id = user._id;
            const firstName = user.firstName;
            const lastName = user.lastName;
            const profilePicture = user.profilePicture;
            return {id, firstName, lastName, profilePicture};
        });
        const userObjects = await Promise.all(userPromises);

        return res.status(200).send(userObjects);
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

//Submit Event
router.post("/", checkAuth, upload.single("image"), async (req, res) => {
    try {
        const {role} = req;
        let UserRole;
        if (role === "student") {
            UserRole = Student;
        } else if (role === "company") {
            UserRole = Company;
        } else if (role === "admin") {
            UserRole = User;
        } else {
            return res.status(401).json({message: "Invalid role"});
        }
        const userId = req.userId;
        let user = await UserRole.findById(userId);
        const firstName = user.firstName;
        const lastName = user.lastName;
        const eventSubmitter = firstName + " " + lastName;

        let headerPicture = "";
        let cloudinary_id = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            headerPicture = result?.secure_url;
            cloudinary_id = result?.public_id;
        }

        const {
            eventName,
            eventStartDate,
            eventEndDate,
            eventDescription,
            eventWebsite,
            eventSocialMedia,
            eventCategory,
            eventLocation,
            recurringEvent,
            participants,
            price,
            picture,
        } = req.body;

        let isCourse = false;
        let eventSubCategory;
        // Check if the category is a course (object) or a subcategory string (e.g. "Football")
        if (!mongoose.Types.ObjectId.isValid(eventCategory)) {
            eventSubCategory = await Course.findById(eventCategory);
            isCourse = true;
        } else {
            eventSubCategory = await SubCategory.findById(eventCategory);
        }
        if (!eventSubCategory) {
            return res.status(404).send({message: "Category not found"});
        }



        let eventTopCategory;
        if (!isCourse) {
            eventTopCategory = await TopCategory.findById(
                eventSubCategory.topCategory
            );
        }

        if (
            recurringEvent === undefined ||
            (recurringEvent !== "once" &&
                recurringEvent !== "weekly" &&
                recurringEvent !== "biweekly" &&
                recurringEvent !== "monthly")
        ) {
            return res
                .status(400)
                .send({message: "Does not match one of the recurring types"});
        }

        let eventOtherTopCategory, eventOtherSubCategory;

        if (eventSubCategory.subCategory === "Other") {
            if (
                req.body.eventOtherSubCategory === undefined ||
                req.body.eventOtherSubCategory === ""
            ) {
                return res
                    .status(400)
                    .send({message: "Please add required field ´other´ "});
            }
            eventOtherTopCategory = req.body.eventOtherTopCategory;
        }
        if (!isCourse && eventTopCategory.topCategory === "Other") {
            if (
                req.body.eventOtherTopCategory === undefined ||
                req.body.eventOtherTopCategory === ""
            ) {
                return res
                    .status(400)
                    .send({message: "Please add required field ´other´ "});
            }
            eventOtherSubCategory = req.body.eventOtherSubCategory;
        }

        const published = false;

        //Check Date
        if (
            eventStartDate === "" ||
            eventStartDate === undefined ||
            eventEndDate === "" ||
            eventEndDate === undefined
        ) {
            return res
                .status(400)
                .send({message: "Please add required field ´date´ "});
        }

        if (
            dayjs(eventStartDate).isAfter(dayjs(eventEndDate)) ||
            dayjs(eventStartDate).isBefore(dayjs())
        ) {
            return res.status(400).send({message: "Invalid date"});
        }

        if (eventDescription === "" || eventDescription === undefined) {
            return res
                .status(400)
                .send({message: "Please add required field ´description´ "});
        }

        const websiteRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^ "]*$)?/;

        //Following: Checking all attributes

        if (
            eventWebsite !== undefined &&
            eventWebsite !== "" &&
            !websiteRegex.test(eventWebsite)
        ) {
            return res
                .status(400)
                .send({message: "Please add required field ´website´ "});
        }

        if (
            eventSocialMedia !== undefined &&
            eventSocialMedia !== "" &&
            !websiteRegex.test(eventSocialMedia)
        ) {
            return res
                .status(400)
                .send({message: "Please add required field ´social media´ "});
        }

        //Check if "Other" was selected in sub/ topcategory. A proposed sub/ topcategory for the user's event

        if (eventSubCategory === "Other" && eventOtherSubCategory === "") {
            return res
                .status(400)
                .send({message: "Please add required field ´other´ "});
        }
        if (
            !isCourse &&
            eventTopCategory === "Other" &&
            eventOtherTopCategory === ""
        ) {
            return res
                .status(400)
                .send({message: "Please add required field ´other´ "});
        }

        if (eventLocation === "" || eventLocation === undefined) {
            return res
                .status(400)
                .send({message: "Please add required field ´location´ "});
        }

        if (
            participants === "" ||
            participants === undefined ||
            isNaN(participants)
        ) {
            return res
                .status(400)
                .send({message: "Please add required field ´participants´ "});
        }
        if (price === "" || price === undefined || isNaN(price)) {
            return res
                .status(400)
                .send({message: "Please add required field ´price´ "});
        }
        try {
            if (Number(participants) < 1) {
                return res
                    .status(400)
                    .send({message: "Participants must be more than 1 participant"});
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({message: "Participants is not a number"});
        }

        try {
            if (Number(price) < 0) {
                return res.status(400).send({message: "Price cannot be negative"});
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({message: "Price is not a number"});
        }

        const paid = user.role !== "company";

        //All the event data
        let newEventData = {
            eventName,
            eventStartDate,
            eventEndDate,
            participants,
            price,
            eventDescription,
            userId,
            eventSubmitter,
            recurringEvent,
            published,
            eventCategory,
            eventWebsite,
            eventSocialMedia,
            paid,
            eventLocation,
            headerPicture,
            cloudinary_id,
        };

        if (eventSubCategory.subCategory === "Other") {
            newEventData = {...newEventData, eventOtherSubCategory};
        }
        if (!isCourse && eventTopCategory.topCategory === "Other") {
            newEventData = {...newEventData, eventOtherTopCategory};
        }

        newEventData = {...newEventData, status: "PENDING"};
        const newEvent = await Event.create(newEventData);

        if (newEvent) {
            await UserRole.findByIdAndUpdate(
                userId,
                {$push: {eventsCreated: newEvent._id}},
                {new: true} // receive an updated user
            );
            return res.status(200).send(newEvent);
        } else {
            return res.status(400).send({message: "Please add required fields"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

router.get("/byEventName/:eventName", async (req, res) => {
    console.log(req.params.eventName);
    const {eventName} = req.params;
    try {
        let event = await Event.findOne({eventName: eventName});
        if (event) {
            return res.status(200).send(event);
        } else {
            return res.status(404).send({message: "Event not found"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Internal Server Error"});
    }
});

router.post(
    "/uploadImage",
    checkAuth,
    upload.single("image"),
    async (req, res) => {
        const {id} = req.body;
        const {userId} = req;

        try {
            let event = await Event.findById(id);
            if (!event)
                return res.status(404).json({message: "Event was not found"});

            if (event.userId !== userId) {
                return res.status(401).send({
                    message: "You are not allowed to upload an image to this event",
                });
            }

            if (req?.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                event.headerPicture = result.secure_url;
                event.cloudinary_id = result.public_id;
            }

            await event.save();
            res.json(event);
        } catch (error) {
            console.log("My error: ", error);
        }
    }
);

router.delete("/headerPicture/:id", checkAuth, async (req, res) => {
    const {id} = req.params;
    const {userId} = req;
    try {
        let event = await Event.findById(id);
        if (!event) return res.status(404).json({message: "Event was not found"});

        if (event.userId !== userId) {
            return res.status(401).send({
                message: "You are not allowed to delete the image of this event",
            });
        }
        // Delete image from cloudinary
        if (event.cloudinary_id)
            await cloudinary.uploader.destroy(event.cloudinary_id);

        event.headerPicture = null;
        event.cloudinary_id = null;
        await event.save();
        res.status(200).json(event);
    } catch (err) {
        console.log(err);
    }
});

//Not working properly
router.put("/:id/notification", checkAuth, async (req, res) => {
    const {role} = req;
    const {userId, message, status} = req.body;
    const {id} = req.params;

    if (role !== "admin") {
        res.status(404).json({message: "Unauthorized"});
    }

    try {
        let event = await Event.findByIdAndUpdate(
            id,
            {notification: message, status: status},
            {new: true}
        );

        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }

        let user = await Student.findByIdAndUpdate(
            userId,
            {eventStatusChanged: true},
            {new: true}
        );

        if (!user) {
            user = await Company.findByIdAndUpdate(
                userId,
                {eventStatusChanged: true},
                {new: true}
            );
        }

        if (!user) {
            user = await User.findByIdAndUpdate(
                userId,
                {eventStatusChanged: true},
                {new: true}
            );
        }
        console.log("User notify", user);
        return res.status(200).send(event);
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;
