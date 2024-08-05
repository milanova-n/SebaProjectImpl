import express from 'express';
import {createPaymentIntent} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);
//router.post('/create-subscription', createSubscription);

export default router;
