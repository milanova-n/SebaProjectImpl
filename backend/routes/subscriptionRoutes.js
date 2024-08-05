// routes/subscriptionRoutes.js
import express from 'express';
import {
    cancelSubscription,
    createCustomer,
    createPaymentIntent,
    createSubscription, getSubscription
} from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/create-customer', createCustomer);
router.post('/create-subscription', createSubscription);
router.post('/create-payment-intent', createPaymentIntent);
router.post('/cancel-subscription', cancelSubscription);
router.post('/get-subscription', getSubscription);


export default router;
