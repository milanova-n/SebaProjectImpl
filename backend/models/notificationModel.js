import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    readStatus: {
        type: Boolean,
        default: false
    },
    eventId: {type: String},
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);