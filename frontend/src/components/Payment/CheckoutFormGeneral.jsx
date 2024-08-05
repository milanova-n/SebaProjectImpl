import {useContext, useState} from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import {Typography, Box, Button, Stack} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {useNavigate} from "react-router-dom"; // If you are using react-router for navigation
import axios from "axios";
import {getToken} from "../../../utils/tokenService.jsx";
import error from "eslint-plugin-react/lib/util/error.js";
import {ErrorContext} from "../../context/ErrorContext.jsx"; // Import axios for API calls
export default function CheckoutFormGeneral({eventId, processOfPayment}) {
    // Receive eventId as a prop
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const {setErrorMessage} = useContext(ErrorContext);
    const [showShareButton, setShowShareButton] = useState(false);

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);


    const updateEventTickets = async () => {
        try {
            const token = getToken(); // Assuming you have a getToken function
            const resp = await axios.patch(
                `http://localhost:8080/api/events/${eventId}/addTicket`,
                {},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            if (resp.status === 200) {
                setMessage(
                    "Payment succeeded! You can find your tickets in your profile!"
                );
                setPaymentSuccess(true);
            } else {
                throw error;
            }
        } catch (error) {
            setMessage(
                "Payment succeeded, but failed to update event and user tickets."
            );

            console.error("Failed to update event tickets:", error);
        }
    };
    const updateEventPaymentStatus = async () => {
        try {
            const token = getToken(); // Assuming you have a getToken function
            await axios.patch(
                `http://localhost:8080/api/events/${eventId}/payEvent`,
                {},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setMessage("Payment succeeded!");
            setPaymentSuccess(true);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    window.location.href = "/noAccess";
                }
            }
            setMessage(
                "Payment succeeded, but failed to update event payment status."
            );
            console.error("Failed to update event payment status:", error);
            const errorMessage = error?.response?.data?.message || "Unknown";
            setErrorMessage(errorMessage);
            window.location.href = "/error";
        }
    };


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
            redirect: "if_required", // This will handle redirection for certain payment methods
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
                    //Added here to update event tickets
                    if (processOfPayment === "buyTicket") {
                        await updateEventTickets();
                        setMessage(
                            "Payment succeeded! You can find your tickets in your profile!"
                        );
                        setShowShareButton(true);
                    } else if (processOfPayment === "createEvent") {
                        await updateEventPaymentStatus();
                        setMessage("Payment succeeded! Your event will be published within in 24h after a review by our Team!");

                    }
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
        navigate("/"); // Adjust the path to your start page
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    if (paymentSuccess) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: 2,
                }}
            >

                <CheckCircleOutlineIcon sx={{color: "#6AF170", fontSize: 150}}/>
                <Typography variant="h6" sx={{color: "#FFFFFF", marginTop: 1}}>
                    {message}
                </Typography>
                <Stack direction={"row"} justifyContent={"flex-end"} spacing={2} paddingTop={"2vh"}>

                    <Button
                        variant="contained"
                        onClick={handleNavigateToStart}
                        sx={{bgcolor: "#1C75BC", color: "#FFFFFF", marginTop: 2}}
                    >
                        Go to Start Page
                    </Button>
                    {showShareButton && (

                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText("http://localhost:5010/events/" + eventId);
                            }}
                             variant="contained"
                        sx={{bgcolor: "#1C75BC", color: "#FFFFFF", marginTop: 2}}
                        >
                            Share event link
                        </Button>
                    )}
                </Stack>
            </Box>
        );
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions}/>
            <Box sx={{display: "flex", justifyContent: "center", marginTop: 2}}>
                <Button
                    variant="contained"
                    type="submit"
                    disabled={isLoading || !stripe || !elements}
                    sx={{bgcolor: "#1C75BC", color: "#FFFFFF"}}
                >
          <span id="button-text">
            {isLoading ? (
                <div className="spinner" id="spinner"></div>
            ) : (
                "Pay now"
            )}
          </span>
                </Button>
            </Box>
            {message && (
                <Box sx={{display: "flex", justifyContent: "center", marginTop: 2}}>
                    <Typography variant="body2" sx={{color: "#1D75BC"}}>
                        {message}
                    </Typography>
                </Box>
            )}
        </form>
    );
}
