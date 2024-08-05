import {checkAuth} from "../middleware/authorization.js";
import express from "express";
import {Notification} from "../models/notificationModel.js";


const router = express.Router()

//ALl notifications for a user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const notifications = await Notification.find({user: userId}).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching notifications');
    }
});

//only unread notifications for a user
router.get('/unread/:userId', async (req, res) => {
    try {
        console.log('Unread userId wird ');
        const userId = req.params.userId;
        const unreadNotifications = await Notification.find({ user: userId, readStatus: false }).sort({ createdAt: -1 });
        res.json(unreadNotifications);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching unread notifications');
    }
});

router.patch('/read/:notificationId', async (req, res) => {
    try {
        //console.log('Markiere Notification als gelesen');
        const notificationId = req.params.notificationId;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).send({ message: 'Notification not found' });
        }

        await Notification.findByIdAndUpdate(notificationId, { readStatus: true });
        res.status(200).send('Notification updated sucessfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error marking notification as read');
    }
});


router.delete('/delete/:notificationId', async (req, res) => {
    try {
        const notificationId = req.params.notificationId;


        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).send({ message: 'Notification not found' });
        }

        await Notification.findByIdAndDelete(notificationId);
        res.status(200).send('Notification deleted sucessfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting notification');
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        console.log("loesche alle")
        const userId = req.params.userId;
        const notifications = await Notification.deleteMany({user: userId});
        res.send('All notifications deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting all notifications');
    }
});


export default router;