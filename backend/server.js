import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose, {get} from 'mongoose';
import apiController from './controllers/apiController.js';

import http from 'http';
import {Server as SocketIOServer} from 'socket.io';
import Message from './models/messageModel.js';
import ChatRoom from './models/chatRoomModel.js';
import {User} from "./models/userModel.js";
import {Student} from "./models/studentModel.js";
import {Company} from "./models/companyModel.js";

import {Event} from './models/eventModel.js';
import {Notification} from './models/notificationModel.js';
import notificationController from "./controllers/notificationController.js";


dotenv.config();

const PORT = process.env.PORT || 8080; // Port with Fallback Port

const app = express();
let model = '';
// Middleware
app.use(cors());
app.use(express.json());
//app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

//mount controllers
app.use("/api", apiController);


// MongoDB connection and server start
mongoose
    .connect(process.env.MONGODB_URI_ATLAS, {
        //useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(() => console.log(`Connected to MongoDB`))
    .catch((error) => console.log("Error connecting to MongoDB:", error));


app.use('/api/notifications', notificationController);

// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:5010",
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('joinRoom', ({chatRoomId}) => {
        socket.join(chatRoomId);
        console.log(`User ${socket.id} joined room ${chatRoomId}`);
    });

    socket.on('chatMessage', async ({chatRoomId, message, userId}) => {
        const {sender, senderType} = await findSenderAndType(userId);
        if (!sender) {
            console.error(`Sender with ID ${userId} not found.`);
            return;
        }
        //console.log("SENDERTYPE")
        //console.log(senderType)
        const newMessage = new Message({
            sender: sender._id,
            senderType: senderType,
            content: message,
            chat: chatRoomId,
        });

        await newMessage.save();

        let chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) {
            console.error(`ChatRoom with ID ${chatRoomId} not found.`);

            chatRoom = new ChatRoom({
                _id: chatRoomId,
                messages: []
            });
            await chatRoom.save();
            console.log(`New ChatRoom created with ID ${chatRoomId}`);
        }
        chatRoom.messages.push(newMessage._id);
        await chatRoom.save();


        console.log(`Message saved: ${message}`);
        io.to(chatRoomId).emit('message', newMessage);


        //notification logic
        const event = await Event.findById(chatRoomId);
        const tickets = event.tickets

        for (let i = 0; i < tickets.length; i++) {
            const ticketUserId = tickets[i];
            const ticketUserString = ticketUserId.toString();
            if (ticketUserString === userId) {
                continue;
            }
            //console.log(ticketUserId)
            const user = await Student.findById(ticketUserId);
            //console.log(user)

            if (!user.notifications) {
                user.notifications = [];
            }

            const notification = new Notification({
                message: `"${message}" in: ${event.eventName}`,
                user: user._id,
                eventId: event._id,
            });
            await notification.save();

            user.notifications.push(notification._id);
            await user.save();
        }


        // Notify the event creator if different from the message sender
        if (event.userId !== userId) {
            const eventCreator = await Student.findById(event.userId) || await Company.findById(event.userId) || await User.findById(event.userId);
            if (eventCreator) {
                const notificationForCreator = new Notification({
                    message: `"${message}" in your event: ${event.eventName}`,
                    user: eventCreator._id,
                    eventId: event._id
                });
                await notificationForCreator.save();

                if (!eventCreator.notifications)
                    eventCreator.notifications = [];
                eventCreator.notifications.push(notificationForCreator._id);
                await eventCreator.save();
            }
        }


        event.eventSubmitter


    });

    async function findSenderAndType(userId) {
        let sender = await User.findById(userId);
        console.log("Fuehre findSender() aus")
        let senderType = 'User';
        if (!sender) {
            sender = await Student.findById(userId);
            senderType = 'Student';
            if (!sender) {
                sender = await Company.findById(userId);
                senderType = 'Company';
            }
        }
        return {sender, senderType};
    }

    /*
        app.get('/unread/:userId', async (req, res) => {
            try {
                console.log('Unread userId wird ');
                const userId = req.userId;
                const unreadNotifications = await Notification.find({ user: userId, readStatus: false }).sort({ createdAt: -1 });

                res.json(unreadNotifications);
            } catch (error) {
                console.error(error);
                res.status(500).send('Error fetching unread notifications');
            }
        });

     */


    //später abstrahieren
    app.get(`/api/messages/:chatRoomId`, async (req, res) => {

        try {
            const chatRoomId = req.params.chatRoomId;
            const chatRoom = await ChatRoom.findById(chatRoomId).populate('messages');

            if (!chatRoom) {
                return res.status(404).send('ChatRoom not found');
            }

            // Jeder Sender muss einzeln populated werden, damit alles richtig angezeigt wird
            const messagesWithSender = await Promise.all(chatRoom.messages.map(async (messageId) => {
                const message = await Message.findById(messageId);
                //console.log(message)
                const senderModel = message.senderType === 'Student' ? Student : message.senderType === 'Company' ? Company : User;
                const populatedSender = await senderModel.findById(message.sender);
                return {
                    ...message.toObject(),
                    sender: populatedSender
                };
            }));

            res.json(messagesWithSender);
        } catch (error) {
            console.error(error);
            res.status(400).send('Error fetching messages');
        }

    });

    socket.on('newNotification', async ({userId, message}) => {
        const notification = new Notification({
            message: `"${message}" in: ${event.eventName}`,
            user: user._id,
            eventId: eventId,
            readStatus: false
        });
        await notification.save();
        io.to(userId).emit('notification', notification);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

// Listen on the HTTP server, not the express app
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send({error: 'Internal Server Error', message: err.message});
});