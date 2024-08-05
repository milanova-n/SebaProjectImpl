import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutFormSubscription from "./CheckoutFormSubscription.jsx";

//const stripePromise = loadStripe(  "pk_test_51PLXAvD3DYsaK49mgA4C0oxSaWCXNsTjWrG5wRuz7jLd1tRohasUM2edeKyqZliFIg4gyQVzbvKrnoKVq1jedtYu00SANvv7CF");
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);



const stripeProducts = [
  {
    label: "Professional",
    description: "Events with up to 50 participants",
    productId: "prod_QMDc1REZHOLGmx",
    priceId: "price_1PVVBID3DYsaK49msaOJYVVb",
    amount: 30 * 100,
    type: "one-time",
  },
  {
    label: "Enterprise",
    description: "Events with up to 100 participants",
    productId: "prod_QMDddyDdlT84Ag",
    priceId: "price_1PVVC0D3DYsaK49mZ0c5d8mi",
    amount: 50 * 100,
    type: "one-time",
  },
  {
    label: "Unlimited",
    description: "Events with unlimited participants",
    productId: "prod_QMDddbdxOFRDdj",
    priceId: "price_1PVVCiD3DYsaK49m7bfNgB25",
    amount: 100 * 100,
    type: "one-time",
  },
];

// eslint-disable-next-line react/prop-types
export default function PaymentCreator({
  clientSecret,
  customerId,
  amount,
  subscriptionId,
}) {
  // Find the selected product based on the provided string
  //const selectedStripeProduct = stripeProducts.find(product => product.label === selectedProduct);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("http://localhost:8080/api/subscriptions/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: customerId,
        subscriptionId: subscriptionId,
        amount: amount,
        clientSecret: clientSecret,
      }),
    }).then((res) => res.json());
    //.then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "stripe",
    variables: {
      //colorPrimary: '#561029',
      //colorBackground: '#ff6a00',
      colorText: "#1D75BC",
    },
    rules: {
      ".Input": {
        color: "#1D75BC",
      },
      ".Label": {
        color: "#FFFFFF",
      },
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutFormSubscription clientSecret={clientSecret} />{" "}
            {/* Pass eventId to CheckoutForm */}
          </Elements>
        </>
      )}
    </div>
  );
}
