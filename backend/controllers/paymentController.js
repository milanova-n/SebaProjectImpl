import Stripe from 'stripe';
//import {User} from '../models/userModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Ensure you have the Stripe secret key in your environment variables


export const createPaymentIntent = async (req, res) => {
    const {amount, productId} = req.body;
    console.log("Amount:" + amount)

    try {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            //amount: calculateOrderAmount(items),
            amount: amount * 100, //to ensure it is in € not cent
            currency: 'eur',
            metadata: {productId: productId},
            description: "Payment for product ID:" + productId,
           // automatic_payment_methods: {
             //   enabled: true,2
            //},
            payment_method_types: ['card'],
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({error: 'Internal Server Error', message: error.message});
    }
};


/*
// Create Subscription for recurring payments
export const createSubscription = async (req, res) => {
    const {userId, priceId, paymentMethodId} = req.body; // Added paymentMethodId

    try {
        const user = await User.findById(userId);

        if (!user) {
            console.error('User not found');
            return res.status(404).send('User not found');
        }

        if (!user.stripeCustomerId) {
            // Create a new Stripe customer if the user does not have one
            const customer = await stripe.customers.create({
                email: user.email,
                payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
            user.stripeCustomerId = customer.id;
            await user.save();
        } else {
            // Attach the payment method to the existing customer
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: user.stripeCustomerId,
            });

            // Set the default payment method for the customer
            await stripe.customers.update(user.stripeCustomerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
        }

        const subscription = await stripe.subscriptions.create({
            customer: user.stripeCustomerId,
            items: [{price: priceId}],
            expand: ['latest_invoice.payment_intent'],
        });

        user.stripeSubscriptionId = subscription.id;
        await user.save();

        res.send({subscription});
    } catch (error) {
        console.error('Error creating subscription:', error.message);
        res.status(500).send({ error: 'Internal Server Error', message: error.message });
    }
};

 */
