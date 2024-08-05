import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PaymentIcon from "@mui/icons-material/Payment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import { getToken } from "../../../../utils/tokenService.jsx";
import SubscriptionPricing from "./SubscriptionPricing.jsx";
import Header from "../../Header.jsx";
import Footer from "../../Footer.jsx";
import PaymentCreator from "./PaymentCreatorSubscription.jsx";
import { UserContext } from "../../../context/UserContext.jsx";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ErrorContext } from "../../../context/ErrorContext.jsx";

dayjs.extend(utc);
dayjs.extend(timezone);

const CustomStepIcon = styled("div")(({ active }) => ({
  backgroundColor: active ? "#1D75BC" : "transparent",
  borderRadius: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 40,
  height: 40,
  color: "#FFFFFF",
}));

const CustomStepLabel = styled(StepLabel)(({ active }) => ({
  "& .MuiStepLabel-label": {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    padding: "4px 8px",
    fontSize: "16px",
    fontWeight: active ? "bold" : "normal",
    color: active ? "#1D75BC" : "#000000",
  },
}));

const subscriptionOptions = [
  {
    label: "Monthly (1 month)",
    priceId: "price_1PZZ0mD3DYsaK49msEZvRkRj",
    amount: 3.0,
    frequency: "month",
    type: "recurring",
  },
  {
    label: "Semester Plan (6 months)",
    priceId: "price_1PNx0xD3DYsaK49mziRNo0DT",
    amount: 12.0,
    frequency: "semester",
    type: "recurring",
  },
  {
    label: "Year Plan (12 months)",
    priceId: "price_1PNx8SD3DYsaK49mTFfKUJ0s",
    amount: 18.0,
    frequency: "year",
    type: "recurring",
  },
];

const InfoBox = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(""); // Initialize as empty string
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const { user } = useContext(UserContext);
  const { setErrorMessage } = useContext(ErrorContext);
  /*    const [customerId, setCustomerId] = useState("");
    const [subscriptionId, setSubscriptionId] = useState(null);*/
  /*    const [isActive, setIsActive] = useState(false);
        const [cancelAt, setCancelAt] = useState(false);*/

  const [paymentProcess, setPaymentProcess] = useState(false);

  const steps = [
    { label: "Choose Subscription", icon: <FactCheckIcon /> },
    { label: "Payment Details", icon: <PaymentIcon /> },
  ];

  const selectedPlan = subscriptionOptions[selectedPlanIndex];

  /*    useEffect(() => {
            if (user) {
                //console.log("UserId: " + user._id);
                setUserId(user._id);
                //console.log("StripeCustomerId: " + user.stripeCustomerId);
                setCustomerId(user.stripeCustomerId);
                //console.log("SubscriptionId: " + user.stripeSubscriptionId);
                setSubscriptionId(user.stripeSubscriptionId);
            }
        }, [user]);*/

  /*
        useEffect(() => {
            if (customerId && subscriptionId) {
                checkForSubscription(customerId, subscriptionId);
            }
        }, [customerId, subscriptionId]);
    */

  /*
    useEffect(() => {
        console.log("user?._id: " + user?._id)
        setUserId(userId);
        console.log("UserId: " + userId) //did not work

        console.log("StripeCustomerId: " + user?.stripeCustomerId)
        const stripeCustomerId = user?.stripeCustomerId;
        setCustomerId(stripeCustomerId);
        console.log("CustomerId: " + customerId) //did not work always

        console.log(user?.stripeSubscriptionId)
        setSubscriptionId(user?.stripeSubscriptionId)
        console.log("SubscriptionId: " + subscriptionId)

        //checkForSubscription();
    }, [userId, customerId, subscriptionId]);

     */
  const handleCancellation = async () => {
    try {
      const response = await axios.post(
        "/api/subscriptions/cancel-subscription",
        {
          subscriptionId: user.stripeSubscriptionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      window.location.href = `http://localhost:5010/subscribe`;
      //const data = await response.json();
      //setStatusMessage(`Your subscription will be canceled on: ${new Date(data.cancel_at * 1000)}`);
    } catch (err) {
      console.error("Fetch error: ", err);
      setError("Failed to cancel subscription. Please try again.");
    }
  };

  /*    const checkForSubscription = async (stripeCustomerId, subscriptionId) => {

            console.log("Check for subscription")
            if (stripeCustomerId && subscriptionId) {
                console.log("Check for subscription:customerId && subscriptionId = True ")
                const subscriptionDetails = await checkForActiveSubscription(subscriptionId);
                console.log(subscriptionDetails);
                if (subscriptionDetails) {
                    setIsActive(subscriptionDetails.isActive);
                    setCancelAt(subscriptionDetails.cancelAt)
                }
            }
        };*/

  /*    const checkForActiveSubscription = async (subscriptionId) => {
            try {
                const response = await fetch("/api/subscriptions/get-subscription", {
                    method: "POST", // Changed from GET to POST to match body usage
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subscriptionId: subscriptionId,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const subscription = await response.json();
                console.log("Subscription details:", subscription);

                const isActive = subscription.status === 'active';
                const cancelAt = subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null;
                const canceledAt = subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null;

                console.log("Is the subscription active?", isActive);
                if (cancelAt) {
                    console.log("Subscription is scheduled to be canceled at:", cancelAt);
                }
                if (canceledAt) {
                    console.log("Subscription was canceled at:", canceledAt);
                }

                return {
                    isActive,
                    cancelAt,
                    canceledAt,
                    subscription // Return the full subscription object as well
                };
            } catch (error) {
                console.error("Failed to load subscription details:", error);
                return false;
            }
        }*/

  const addSubscriptionToUser = async (subscriptionId) => {
    try {
      const token = getToken(); // Assuming you have a getToken function
      await axios.patch(
        `http://localhost:8080/api/users/${user._id}/updateSubscription`,
        { stripeSubscriptionId: subscriptionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to add subscription to user:", error);
      if (error.response) {
        if (error.response.status === 401) {
          window.location.href = "/noAccess";
        }
      }
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }
  };

  const handleSubmit = async () => {
    /*
        console.log("customerId: " + customerId)
*/
    setPaymentProcess(true);
    console.log("selectedPrice: " + selectedPlan.priceId);
    try {
      const response = await axios.post(
        "/api/subscriptions/create-subscription",
        {
          priceId: selectedPlan.priceId,
          customerId: user.stripeCustomerId, // "cus_QP0VlXp2MpwfPE"
        }
      );

      console.log(response);
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(response.data.clientSecret);
      setClientSecret(response.data.clientSecret);
      await addSubscriptionToUser(response.data.subscriptionId);

      setError(null);
    } catch (err) {
      console.error("Fetch error: ", err);
      setError("Failed to create subscription. Please try again.");
    }
  };

  const handleNext = () => {
    handleSubmit();
    if (activeStep === 0 && !checked) return;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log(selectedPlan);
  };

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };
  let text;
  if (user.subscriptionIsActive && !paymentProcess) {
    text = "You already have an active subscription 🚀";
    if (user.subscriptionCancelAt) {
      text =
        "You already have an active subscription 🚀, but it will be canceled on " +
        dayjs(new Date(user.subscriptionCancelAt))
          .tz("Europe/Berlin")
          .format("ddd, DD.MM.YYYY HH:mm")
          .toString();

      return (
        <Box
          className="info-box"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            border: "4px solid #FFFFFF",
            borderRadius: "10px",
            width: 500,
            marginLeft: "auto",
            marginRight: 15,
            p: 3,
          }}
        >
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: "30px",
              fontWeight: "bold",
              marginBottom: -0.5,
              textAlign: "left",
            }}
          >
            {text}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box
          className="info-box"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            border: "4px solid #FFFFFF",
            borderRadius: "10px",
            height: "auto",
            width: 500,
            marginLeft: "auto",
            marginRight: 15,
            marginBottom: -30,
            p: 3,
          }}
        >
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: "30px",
              fontWeight: "bold",
              marginBottom: -0.5,
              textAlign: "left",
            }}
          >
            Cancel your subscription 🫢
          </Typography>
          <Box
            sx={{
              width: "100px",
              height: "4px",
              backgroundColor: "#1D75BC",
              marginBottom: 2,
            }}
          />
          <Box sx={{ display: "flex", width: "100%", marginBottom: 2 }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: "16px" }}>
              ❤️ We hope you had a great time with TUMSocial. <br />
              🚨Your subscription will be canceled with the end of this payment
              period.
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleCheckboxChange}
                sx={{ color: "#FFFFFF" }}
              />
            }
            label={
              <Typography sx={{ color: "#FFFFFF", fontSize: "14px" }}>
                I have read the{" "}
                <Link href="/frontend/src/components/GeneralTerms" sx={{ color: "#FFFFFF" }}>
                  General Terms and Conditions
                </Link>{" "}
                and understand the consequence of canceling my subscription.
              </Typography>
            }
          />
          <Stack
            spacing={2}
            direction="row"
            sx={{ justifyContent: "center", marginTop: 2 }}
          >
            <Button
              variant="contained"
              onClick={handleCancellation}
              disabled={!checked}
              sx={{ bgcolor: "#1C75BC", color: "#FFFFFF" }}
            >
              Cancel your subscription
            </Button>
          </Stack>
        </Box>
      );
    }
  } else {
    return (
      <Box
        className="info-box"
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)", // Adjusted to blur 10px
          border: "4px solid #FFFFFF",
          borderRadius: "10px",
          width: 500,
          marginLeft: "auto",
          marginRight: 15,
          p: 3,
        }}
      >
        <Typography
          sx={{
            color: "#FFFFFF",
            fontSize: "30px",
            fontWeight: "bold",
            marginBottom: -0.5,
            textAlign: "left",
          }}
        >
          Get your Subscription! 🚀
        </Typography>
        <Box
          sx={{
            width: "100px",
            height: "4px",
            backgroundColor: "#1D75BC",
            marginBottom: 2,
          }}
        />
        <Stepper activeStep={activeStep} sx={{ marginBottom: 3 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <CustomStepLabel
                icon={
                  <CustomStepIcon active={activeStep === index}>
                    {step.icon}
                  </CustomStepIcon>
                }
              >
                {step.label}
              </CustomStepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 ? (
          <>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "#FFFFFF" }}>
                Subscription Plan
              </InputLabel>
              <Select
                sx={{
                  color: "#FFFFFF",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFFFFF",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFFFFF",
                  },
                  ".MuiSvgIcon-root": {
                    color: "#FFFFFF",
                  },
                }}
                value={selectedPlanIndex}
                onChange={(e) => setSelectedPlanIndex(e.target.value)}
                label="Subscription Plan"
                displayEmpty
              >
                {subscriptionOptions.map((option, index) => (
                  <MenuItem key={option.label} value={index}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              sx={{
                borderTop: "4px solid #1D75BC",
                width: "266px",
                marginTop: 2,
                marginBottom: 2,
                marginLeft: "auto",
                marginRight: 0,
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginRight: 4,
                }}
              >
                TOTAL:
              </Typography>
              {selectedPlan && (
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {selectedPlan.amount}€ / {selectedPlan.frequency}
                </Typography>
              )}
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleCheckboxChange}
                  sx={{ color: "#FFFFFF" }}
                />
              }
              label={
                <Typography sx={{ color: "#FFFFFF", fontSize: "14px" }}>
                  I have read the{" "}
                  <Link href="/frontend/src/components/GeneralTerms" sx={{ color: "#FFFFFF" }}>
                    General Terms and Conditions
                  </Link>{" "}
                  and accept.
                </Typography>
              }
            />
            {error && (
              <div style={{ color: "red" }}>
                <h3>Error:</h3>
                <p>{error}</p>
              </div>
            )}
          </>
        ) : (
          <Box
            sx={{
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: 2,
              textAlign: "left",
            }}
          >
            <PaymentCreator
              clientSecret={clientSecret}
              customerId={user.stripeCustomerId}
              amount={selectedPlan.amount}
              subscriptionId={user.stripeSubscriptionId}
            />
          </Box>
        )}
        {activeStep !== steps.length - 1 && (
          <Stack
            spacing={2}
            direction="row"
            sx={{ justifyContent: "center", marginTop: 2 }}
          >
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                selectedPlanIndex === "" || (activeStep === 0 && !checked)
              }
              sx={{ bgcolor: "#1C75BC", color: "#FFFFFF" }}
            >
              Get your subscription
            </Button>
          </Stack>
        )}
      </Box>
    );
  }
};

export default function SubscriptionPage() {
  const defaultTheme = createTheme({ palette: "light" });
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header />
      <SubscriptionPricing />
      <Divider />
      <Box id="get-subscription" sx={{ bgcolor: "background.default" }}>
        <Box
          id="hero"
          sx={{
            width: "100%",
            height: "100vh",
            backgroundImage: `url('https://www.ub.tum.de/files/tum_uhrenturm_1482543.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <InfoBox />
        </Box>
        <Divider />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
