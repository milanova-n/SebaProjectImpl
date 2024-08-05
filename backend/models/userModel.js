import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "student", "company"],
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: (value) => {
        return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
      },
    },
  },
  password: {
    type: String,
    required: false,
  },
  stripeCustomerId: {
    type: String,
    required: false,
  },
  stripeSubscriptionId: { type: String, required: false },
  eventsCreated: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: false },
  ],
  cloudinary_id: {
    type: String,
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: false,
    },
  ],
  eventNotifications: [{ type: String }],
  eventStatusChanged: { type: Boolean },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);
