import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
    name: String,
    messages:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }]
});

export default mongoose.model('ChatRoom', chatRoomSchema);