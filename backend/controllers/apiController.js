import express from "express";
import  eventsRouter from "./eventController.js";
import  usersRouter from "./userController.js";
import categoriesRouter from "./categoryController.js";
import coursesRouter from "./courseController.js";
import hobbiesRouter from "./hobbiesController.js";
import paymentRoutes from "../routes/paymentRoutes.js";
import subscriptionRoutes from "../routes/subscriptionRoutes.js";
const router = express.Router();


// Use the individual route modules
router.use('/events', eventsRouter);
router.use('/users', usersRouter);
router.use('/categories', categoriesRouter);
router.use('/courses', coursesRouter);
router.use('/hobbies', hobbiesRouter);
router.use('/payments', paymentRoutes);
router.use('/subscriptions', subscriptionRoutes);

// Export the base API router
export default router;