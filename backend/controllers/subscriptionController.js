// controllers/stripeController.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCustomer = async (req, res) => {
    const {email, name} = req.body;

    if (!email || !name) {
        return res.status(400).json({error: 'Email and name are required.'});
    }

    try {
        const customer = await stripe.customers.create({
            email: email,
            name: name,
            shipping: {
                address: {
                    city: 'Brothers',
                    country: 'US',
                    line1: '27 Fredrick Ave',
                    postal_code: '97712',
                    state: 'CA',
                },
                name: name,
            },
            address: {
                city: 'Brothers',
                country: 'US',
                line1: '27 Fredrick Ave',
                postal_code: '97712',
                state: 'CA',
            },
        });

        res.status(200).json(customer); // Ensure JSON response
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({error: 'Internal Server Error', message: error.message});
    }
};

export const createSubscription = async (req, res) => {
    //const customerId = req.cookies['customer'];
    const {customerId, priceId} = req.body;

    if (!customerId || !priceId) {
        return res.status(400).json({error: 'Customer ID and Price ID are required.'});
    }

    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price: priceId,
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: {
                save_default_payment_method: 'on_subscription',
                payment_method_types: ['card'],
            },
            expand: ['latest_invoice.payment_intent'],
        });

        res.send({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return res.status(400).send({error: {message: error.message}});
    }
};

export const createPaymentIntent = async (req, res) => {
    const {clientSecret, customerId, amount, subscriptionId} = req.body;


    try {
        //const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const paymentIntent = await stripe.paymentIntents.create({
            customer: customerId,
            metadata: {subscription_id: subscriptionId},
            amount: amount * 100,
            currency: 'eur',
            payment_method_types: ['card'],
        });

        res.json({clientSecret: paymentIntent.client_secret});
    } catch (error) {
        console.error('Error creating payment intent for subscription:', error);
        res.status(500).send('Error creating payment intent for subscription:', error);
    }
};

export const cancelSubscription = async (req, res) => {
    const {subscriptionId} = req.body;

    if (!subscriptionId) {
        return res.status(400).json({error: 'Subscription ID is required.'});
    }

    try {
        const subscription = await stripe.subscriptions.update(
            subscriptionId, {
                cancel_at_period_end: true,
            });
        console.log('Subscription updated:', subscriptionId);
        return res.status(200).json(subscription);
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).send('Error updating subscription:', error);
    }
};

export const getSubscription = async (req, res) => {
    const {subscriptionId} = req.body;

    if (!subscriptionId) {
        return res.status(400).json({error: 'Subscription ID is required.'});
    }

    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        //console.log('Subscription:', subscription);
        return res.status(200).json(subscription);
    } catch (error) {
        console.error('Error getting subscription:', error);
        res.status(500).send('Error getting subscription:', error);
    }
};