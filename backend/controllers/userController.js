import express from "express";
import { User } from "../models/userModel.js";
import { Student } from "../models/studentModel.js";
import { Company } from "../models/companyModel.js";
import bcrypt from "bcryptjs";
import { checkAuth } from "../middleware/authorization.js";
import Stripe from "stripe";
import { generateJWTToken } from "../utils/SecretToken.js";
import { upload } from "../utils/multer.js";
import { cloudinary } from "../utils/cloudinary.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validateCredentials.js";
import { Event } from "../models/eventModel.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.get("/me", checkAuth, async (req, res) => {
  const { role } = req;

  let UserRole;
  if (role === "student") {
    UserRole = Student;
  } else if (role === "company") {
    UserRole = Company;
  } else if (role === "admin") {
    UserRole = User;
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  let user = await UserRole.findById(req.userId).populate("eventsCreated"); // to populate the events in eventsCreated
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (UserRole.schema.obj?.hasOwnProperty("eventsParticipated")) {
    // check if eventsParticipated is defined for this user
    await user.populate("eventsParticipated");
  }

  if (
    user.stripeSubscriptionId !== undefined &&
    user.stripeSubscriptionId !== ""
  ) {
    const subscription = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    );
    user = user.toObject();
    user.subscriptionIsActive = subscription.status === "active";
    if (subscription.cancel_at) {
      user.subscriptionCancelAt = subscription.cancel_at * 1000;
    }
  } else {
    user = user.toObject();
    user.subscriptionIsActive = false;
  }
  if (
    user.eventsParticipated !== undefined &&
    user.eventsParticipated.length > 0
  ) {
    user.eventsParticipated = user.eventsParticipated
      .map((event) => event)
      .sort((a, b) => new Date(a.eventStartDate) - new Date(b.eventStartDate));
  }

  return res.status(200).send(user);
});

router.get("/user/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  const { role } = req;

  if (role !== "student" && role !== "company" && role !== "admin") {
    return res.status(401).json({ message: "Invalid role" });
  }

  try {
    let user = await Student.findById(id);
    if (!user) {
      user = await Company.findById(id);
    }
    if (!user) {
      user = await User.findById(id);
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email or password missing" });
  }

  //Check user
  try {
    let user = await Student.findOne({ email });
    if (!user) {
      user = await Company.findOne({ email });
    }
    if (!user) {
      user = await User.findOne({ email });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "Valid authentication credentials are not provided" });
    }

    let UserRole;
    if (user.role === "student") {
      UserRole = Student;
    } else if (user.role === "company") {
      UserRole = Company;
    } else if (user.role === "admin") {
      UserRole = User;
    } else {
      return res.status(400).json({ message: `Invalid role ${user.role}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res
        .status(200)
        .send({ user, token: generateJWTToken(user._id, user.role) });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(400).json({ message: "An error occured" });
  }
});

// To create an admin account
// Should not be public
// Only here for demonstration purposes

/*router.post("/createAdmin", async (req, res) => {

    const role = "admin"
    const lastName = "admin"
    const firstName = "admin"
    const email = "seba.team21@gmail.com"
    const password = "admin"
    const salt = await bcrypt.genSalt(10); //10 is a default value
    const hashedPassword = await bcrypt.hash(password, salt);

    const userObject = {
        role, lastName, firstName, email, password : hashedPassword
    }
    const newUser = await User.create(userObject);
    return res.status(200).send({newUser});
})*/

router.post("/create", async (req, res) => {
  const {
    email,
    password,
    role,
    lastName,
    firstName,
    profilePicture,
    stripeCustomerId,
    ...otherAttributes
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email or password is missing" });
  }

  let UserRole;
  if (role === "student") {
    UserRole = Student;
  } else if (role === "company") {
    UserRole = Company;
  } else if (role === "admin") {
    UserRole = User;
  } else {
    return res.status(401).json({ message: "Invalid role" });
  }

  const emailError = validateEmail(email, role);
  if (emailError) {
    return res.status(400).json({ message: emailError });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  if (!validateName(lastName) || !validateName(firstName)) {
    return res.status(400).json({ message: "Invalid name" });
  }

  const existingUser = await UserRole.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "An account already exists" });
  }

  //Hash password
  const salt = await bcrypt.genSalt(10); //10 is a default value
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await UserRole.create({
      ...otherAttributes,
      role,
      email,
      password: hashedPassword,
      lastName,
      firstName,
      profilePicture,
      stripeCustomerId,
      stripeSubscriptionId: "",
    });
    return res.status(200).send({ newUser });
  } catch (error) {
    return res.status(500).json({
      message: "Failure! User was not created",
    });
  }
});

router.delete("/delete/:id", checkAuth, async (req, res) => {
  const { userId, role } = req;

  let UserRole;
  if (role === "student") {
    UserRole = Student;
  } else if (role === "company") {
    UserRole = Company;
  } else if (role === "admin") {
    UserRole = User;
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }
  try {
    const user = await UserRole.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.cloudinary_id)
      await cloudinary.uploader.destroy(user.cloudinary_id);
    await UserRole.findByIdAndDelete(userId);
    return res.status(200).json({ message: "User was successfully deleted" });
  } catch (error) {
    return (
      res.status(500),
      json({ message: `An error occurred while deleting the user ${error}` })
    );
  }
});

router.put("/notifications", checkAuth, async (req, res) => {
  const { role } = req;
  const { userId, message } = req.body;

  if (role !== "admin") {
    res.status(404).json({ message: "Unauthorized" });
  }

  try {
    let user = await Student.findByIdAndUpdate(
      userId,
      {
        $push: { eventNotifications: message },
      },
      { new: true }
    );
    if (!user) {
      user = await Company.findByIdAndUpdate(
        userId,
        {
          $push: { eventNotifications: message },
        },
        { new: true }
      );
    }
    if (!user) {
      user = await User.findByIdAndUpdate(
        userId,
        {
          $push: { eventNotifications: message },
        },
        { new: true }
      );
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/update", checkAuth, async (req, res) => {
  const { lastName, firstName, instagram, linkedIn, profession, website } =
    req.body;
  const { role } = req;

  let UserRole;
  if (role === "student") {
    UserRole = Student;
  } else if (role === "company") {
    UserRole = Company;
  } else if (role === "admin") {
    UserRole = User;
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    let user = await UserRole.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User was not found" });

    if (lastName) user.lastName = lastName;
    if (firstName) user.firstName = firstName;

    if (role === "student") {
      if (instagram) user.instagram = instagram;
      if (linkedIn) user.linkedIn = linkedIn;
    } else if (role === "company") {
      if (profession) user.profession = profession;
      if (website) user.website = website;
    }

    await user.save();
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).json({
      message: "Failure! User was not updated",
    });
  }
});

router.patch("/:id/updateSubscription", checkAuth, async (req, res) => {
  const { stripeSubscriptionId } = req.body;
  const { id } = req.params;

  try {
    const user = await Student.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await Student.findByIdAndUpdate(
      id,
      { stripeSubscriptionId: stripeSubscriptionId },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(400)
        .json({ message: "Failed to update subscription for user" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user subscription:", error);
    return res.status(500).json({
      message: "An error occurred while updating the subscription",
      error: error.message,
    });
  }
});

router.patch("/addTicket/:eventId", checkAuth, async (req, res) => {
  const { eventId } = req.params; //Ticket id
  const userId = req.userId;
  const user = await Student.findById(userId);
  const event = await Event.findById(eventId);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const updateUser = await Student.findByIdAndUpdate(
    userId,
    { $addToSet: { eventsParticipated: eventId } },
    { new: true }
  );

  if (!updateUser) {
    return res
      .status(404)
      .send({ message: "Ticket could not be added to user" });
  }

  return res.status(200).send(updateUser);
});

//Not implemented in frontend and not tested, used for search bar to search for other students
router.get("/byName/:searchString", async (req, res) => {
  const { searchString } = req.params;

  if (!searchString) {
    return res.status(400).send({ message: "Search string is required" });
  }

  // Split the search string into an array of terms
  const searchTerms = searchString.split(" ").filter((term) => term);

  // Construct the search query
  const searchQuery = {
    $or: [
      { firstName: { $regex: searchTerms.join("|"), $options: "i" } },
      {
        lastName: {
          $regex: searchTerms.join("|"),
          $options: "i",
        },
      },
    ],
  };

  try {
    const users = await User.find(searchQuery);
    console.log(users);
    return res.status(200).send(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post(
  "/uploadImage",
  checkAuth,
  upload.single("image"),
  async (req, res) => {
    //in frontend input type=file name= "image"
    const { role } = req;

    let UserRole;
    if (role === "student") {
      UserRole = Student;
    } else if (role === "company") {
      UserRole = Company;
    } else if (role === "admin") {
      UserRole = User;
    } else {
      return res.status(401).json({ message: "Invalid role" });
    }
    try {
      const result = await cloudinary.uploader.upload(req.file.path);

      let user = await UserRole.findById(req.userId);
      if (!user) return res.status(404).json({ message: "User was not found" });

      user.profilePicture = result.secure_url;
      user.cloudinary_id = result.public_id;

      await user.save();
      res.json(user);
    } catch (error) {
      console.log("My error: ", error);
    }
  }
);

router.delete("/profilePicture", checkAuth, async (req, res) => {
  try {
    const { role } = req;

    let UserRole;
    if (role === "student") {
      UserRole = Student;
    } else if (role === "company") {
      UserRole = Company;
    } else if (role === "admin") {
      UserRole = User;
    } else {
      return res.status(401).json({ message: "Invalid role" });
    }

    let user = await UserRole.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User was not found" });

    // Delete image from cloudinary
    if (user.cloudinary_id)
      await cloudinary.uploader.destroy(user.cloudinary_id);

    user.profilePicture = null;
    user.cloudinary_id = null;
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.patch("/changedEventStatus", checkAuth, async (req, res) => {
  const { role, userId } = req;
  const { status } = req.body;

  let UserRole;
  if (role === "student") {
    UserRole = Student;
  } else if (role === "company") {
    UserRole = Company;
  } else {
    return res.status(401).json({ message: "Invalid role" });
  }

  try {
    const user = await UserRole.findByIdAndUpdate(
      userId,
      { eventStatusChanged: status },
      { new: true }
    );

    res.status(200).send(user);
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/request-reset-password", async (req, res) => {
  const { email } = req.body;
  let user = await Student.findOne({ email });

  if (!user) {
    user = await Company.findOne({ email });
  }
  if (!user) {
    return res.status(400).send("User with given email does not exist.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "seba.team21@gmail.com",
      pass: "ngqu wfja tbka jfnz",
    },
  });

  const mailOptions = {
    to: user.email,
    from: "seba.team21@gmail.com",
    subject: "Password Reset",
    text: `You are receiving this because you have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://localhost:5010/reset-password/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send("A reset link has been sent to your email.");
  });
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  let user = await Student.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    user = await Company.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }
  if (!user) {
    return res
      .status(400)
      .send("Password reset token is invalid or has expired.");
  }
  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }
  const salt = await bcrypt.genSalt(10); //10 is a default value

  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).send("Password has been reset.");
});

export default router;
