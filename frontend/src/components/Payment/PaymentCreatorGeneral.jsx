import {useState, useEffect, useRef, useContext} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

import axios from "axios";
import {getToken} from "../../../utils/tokenService.jsx";
import {ErrorContext} from "../../context/ErrorContext.jsx";
import CheckoutFormGeneral from "./CheckoutFormGeneral.jsx";


//const stripePromise = loadStripe("pk_test_51PLXAvD3DYsaK49mgA4C0oxSaWCXNsTjWrG5wRuz7jLd1tRohasUM2edeKyqZliFIg4gyQVzbvKrnoKVq1jedtYu00SANvv7CF");
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// eslint-disable-next-line react/prop-types
export default function PaymentCreatorGeneral({product, price, user, eventId, processOfPayment}) {
    const [clientSecret, setClientSecret] = useState("");
    const hasRunEffect = useRef(false);
    const {setErrorMessage} = useContext(ErrorContext);


    useEffect(() => {
        async function createPaymentIntent() {
            if (!hasRunEffect.current && price !== undefined && product !== undefined && user !== undefined) {
                if (Number(price) > 0) {
                    const token = getToken();
                    // Create PaymentIntent as soon as the page loads
                    let res;
                    try {
                        res = await axios.post("http://localhost:8080/api/payments/create-payment-intent", {
                            amount: price, productId: eventId, user,
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                    } catch (error) {
                        const errorMessage = error?.response?.data?.message || "Unknown";
                        setErrorMessage(errorMessage);
                        window.location.href = "/error";
                    }
                    setClientSecret(res?.data.clientSecret);

                    hasRunEffect.current = true;
                }
            }
        }

        createPaymentIntent();
    }, [price, product, user]);

    const appearance = {
        theme: "stripe", variables: {
            //colorPrimary: '#561029',
            //colorBackground: '#ff6a00',
            colorText: "#1D75BC",
        }, rules: {
            ".Input": {
                color: "#1D75BC",
            }, ".Label": {
                color: "#FFFFFF",
            },
        },
    };
    const options = {
        clientSecret, appearance,
    };

    return (<div className="App">
        {clientSecret && (<Elements options={options} stripe={stripePromise}>
            <CheckoutFormGeneral eventId={eventId} processOfPayment={processOfPayment}/>{" "}
        </Elements>)}
    </div>);
}
