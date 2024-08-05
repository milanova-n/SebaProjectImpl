import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom'
    },
    senderType: {
        type: String,
        enum: ['User', 'Student', 'Company']
    },

} , {timestamps: true});

export default mongoose.model('Message', messageSchema);