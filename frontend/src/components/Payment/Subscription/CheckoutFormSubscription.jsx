import {useEffect, useState} from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import {Typography, Box, Button} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom'; // If you are using react-router for navigation


// eslint-disable-next-line react/prop-types
export default function CheckoutFormSubscription({clientSecret}) { // Receive eventId as a prop { eventId }
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }
        /*
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

         */

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    //updateEventTickets(); // Update event after successful payment
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const {error, paymentIntent} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // No need to specify a return_url here
                // return_url: "http://localhost:5010",
            },
            redirect: "if_required" // This will handle redirection for certain payment methods
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded! Get started with your subscription!");
                    setPaymentSuccess(true);
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        }

        setIsLoading(false);
    };

    const handleNavigateToStart = () => {
        navigate('/'); // Adjust the path to your start page
    };

    const paymentElementOptions = {
        layout: "tabs"
    };

    if (paymentSuccess) {
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2}}>
                <CheckCircleOutlineIcon sx={{color: '#6AF170', fontSize: 150}}/>
                <Typography variant="h6" sx={{color: '#FFFFFF', marginTop: 1}}>
                    {message}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleNavigateToStart}
                    sx={{bgcolor: '#1C75BC', color: '#FFFFFF', marginTop: 2}}
                >
                    Go to Start Page
                </Button>
            </Box>
        );
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions}/>
            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 2}}>
                <Button
                    variant="contained"
                    type="submit"
                    disabled={isLoading || !stripe || !elements}
                    sx={{bgcolor: '#1C75BC', color: '#FFFFFF'}}
                >
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
                </Button>
            </Box>
            {message && (
                <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 2}}>
                    <Typography variant="body2" sx={{color: '#1D75BC'}}>
                        {message}
                    </Typography>
                </Box>
            )}
        </form>
    );
}