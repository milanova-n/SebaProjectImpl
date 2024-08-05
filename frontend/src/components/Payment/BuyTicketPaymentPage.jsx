import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PaymentIcon from "@mui/icons-material/Payment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {styled} from "@mui/material/styles";
import {getToken} from "../../../utils/tokenService.jsx";
import axios from "axios";
import {UserContext} from "../../context/UserContext.jsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CheckoutFromFreeTicket from "./CheckoutFromFreeTicket.jsx";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {ErrorContext} from "../../context/ErrorContext.jsx";
import PaymentCreatorGeneral from "./PaymentCreatorGeneral.jsx";

dayjs.extend(utc);
dayjs.extend(timezone);

const CustomStepIcon = styled("div")(({theme, active}) => ({
    backgroundColor: active ? "#1D75BC" : "transparent",
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    color: "#FFFFFF",
}));

const CustomStepLabel = styled(StepLabel)(({theme, active}) => ({
    "& .MuiStepLabel-label": {
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        padding: "4px 8px",
        fontSize: "16px",
        fontWeight: active ? "bold" : "normal",
        color: active ? "#1D75BC" : "#000000",
    },
}));

const InfoBox = () => {
    const {eventId} = useParams(); // Get eventId from URL

    const [activeStep, setActiveStep] = useState(0);
    const [checked, setChecked] = useState(false);
    const [eventIsFree, setEventIsFree] = useState(false); // Check if event is free
    const [dialogOpen, setDialogOpen] = useState(false);

    let steps = [
        {label: "Event Details", icon: <FactCheckIcon/>},
        eventIsFree
            ? {label: "Free Ticket", icon: <FavoriteIcon/>}
            : {label: "Payment Details", icon: <PaymentIcon/>},
    ];
    const [details, setDetails] = useState({
        eventName: "",
        eventStart: "",
        eventEnd: "",
        eventLocation: "",
        eventPrice: "",
        eventParticipants: "",
        eventMaxParticipants: 0,
    });
    const {user} = useContext(UserContext);
    const token = getToken();
    const [product, setProduct] = useState("");
    const [disableButton, setDisableButton] = useState(false);
    const [checkOnce, setCheckOnce] = useState(false);
    const [errorMessageTicket, setErrorMessageTicket] = useState("");
    const {setErrorMessage} = useContext(ErrorContext);
    const loadEventById = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/events/${eventId}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            const locationString =
                res.data.eventLocation.street +
                " " +
                res.data.eventLocation.number +
                ", " +
                res.data.eventLocation.zipCode +
                " " +
                res.data.eventLocation.city;

            setDetails({
                eventName: res.data.eventName,
                eventStart: dayjs(res.data.eventStartDate)
                    .tz("Europe/Berlin")
                    .format("ddd, DD.MM.YYYY HH:mm")
                    .toString(),
                eventEnd: dayjs(res.data.eventEndDate)
                    .tz("Europe/Berlin")
                    .format("ddd, DD.MM.YYYY HH:mm")
                    .toString(),
                eventLocation: locationString,
                eventPrice: Number(res.data.price.$numberDecimal),
                eventParticipants: res.data.tickets,
                eventMaxParticipants: res.data.participants,
            });
            setProduct(res.data.eventName);
            if (Number(res.data.price.$numberDecimal) === 0) {
                setEventIsFree(true);
            }
        } catch (error) {
            console.error("Failed to load event details:", error);
            const errorMessage = error?.response?.data?.message || "Unknown";
            setErrorMessage(errorMessage);
            window.location.href = "/error";
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await loadEventById();
        };

        initialize();
    }, [eventId]);

    // Check whether the user already has a ticket
    // If true, the button stays disabled
    useEffect(() => {
        if (!checkOnce && user._id !== undefined && details.eventName !== "") {
            let hasTicket = false;
            details.eventParticipants.forEach((ticket) => {
                if (ticket._id === user._id) {
                    hasTicket = true;
                    setDisableButton(true);
                    setErrorMessageTicket("You already have a ticket for this event!");
                }
            });
            if (details.eventParticipants.length >= details.eventMaxParticipants) {
                setDisableButton(true);
                if (hasTicket) {
                    setErrorMessageTicket(
                        "You already have a ticket for this event and it is fully booked!"
                    );
                } else {
                    setErrorMessageTicket("This event is already fully booked!");
                }
            }

            if (!user.subscriptionIsActive) {
                setDisableButton(true);
                setErrorMessageTicket("You need to be a subscriber to buy tickets!");
            }

            setCheckOnce(true);
        }
    }, [details, user]);

    const handleNext = () => {
        if (activeStep === 0 && !checked) return;
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <Box
            className="info-box"
            sx={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)", // Adjusted to blur 10px
                border: "4px solid #FFFFFF",
                borderRadius: "10px",
                height: "auto",
                width: 500,
                marginLeft: "auto", // Ensure it is aligned to the right
                marginRight: 15, // Some margin from the right edge
                marginBottom: -30,
                p: 3, // Padding to add some space inside the box
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
                Get your Ticket! 🚀
            </Typography>
            <Box
                sx={{
                    width: "100px",
                    height: "4px",
                    backgroundColor: "#1D75BC",
                    marginBottom: 2,
                }}
            />
            <Stepper activeStep={activeStep} sx={{marginBottom: 3}}>
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
                    <Table sx={{color: "#FFFFFF"}}>
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        color: "#FFFFFF",
                                        borderBottom: "none",
                                        padding: "4px",
                                        width: "30%",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Event:
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#FFFFFF",
                                        borderBottom: "none",
                                        padding: "4px",
                                    }}
                                >
                                    {details.eventName}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        color: "#FFFFFF",
                                        borderBottom: "none",
                                        padding: "4px",
                                        width: "30%",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Start:
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#FFFFFF",
                                        borderBottom: "none",
                                        padding: "4px",
                                    }}
                                >
                                    {details.eventStart}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        color: "#FFFFFF",
                                        borderBottom: "none",
                                        padding: "4px",
                                        width: "30%",
                                        fontWeight: "bold",
                                    }}
                                >
                                    End:
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#FFFFFF",
                                        borderBottom: "none",
                                        padding: "4px",
                                    }}
                                >
                                    {details.eventEnd}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        color: "#FFFFFF",
                                        borderBottom: "none",
                                        padding: "4px",
                                        width: "30%",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Location:
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "#FFFFFF",
                                        borderBottom: "none",
                                        padding: "4px",
                                    }}
                                >
                                    {details.eventLocation}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
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
                        sx={{display: "flex", justifyContent: "flex-end", width: "100%"}}
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
                        <Typography
                            sx={{color: "#FFFFFF", fontSize: "16px", fontWeight: "bold"}}
                        >
                            {details.eventPrice}€
                        </Typography>
                    </Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                onChange={handleCheckboxChange}
                                sx={{color: "#FFFFFF"}}
                            />
                        }
                        label={
                            <Typography sx={{color: "#FFFFFF", fontSize: "14px"}}>
                                I have read the{" "}
                                <Link href="/frontend/src/components/GeneralTerms" sx={{color: "#FFFFFF"}}>
                                    General Terms and Conditions
                                </Link>{" "}
                                and accept.
                            </Typography>
                        }
                    />
                </>
            ) : (
                <>
                    {eventIsFree ? (
                        <Box
                            sx={{
                                color: "#FFFFFF",
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginBottom: 2,
                                textAlign: "left",
                            }}
                        >
                            <CheckoutFromFreeTicket eventId={eventId}/>
                        </Box>
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
                            <PaymentCreatorGeneral
                                product={product}
                                price={details.eventPrice}
                                user={user._id}
                                eventId={eventId}
                                processOfPayment={"buyTicket"}
                            />
                        </Box>
                    )}
                </>
            )}
            {activeStep !== steps.length - 1 && (
                <>
                    {disableButton && (
                        <Typography color={"red"} fontWeight={"bold"} variant={"h9"}>
                            {errorMessageTicket}
                        </Typography>
                    )}
                    <Stack
                        spacing={2}
                        direction="row"
                        sx={{justifyContent: "center", marginTop: 2}}
                    >
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={(activeStep === 0 && !checked) || disableButton}
                            sx={{bgcolor: "#1C75BC", color: "#FFFFFF"}}
                        >
                            {eventIsFree
                                ? "Get your free Ticket! 🎟️"
                                : "Pay Now and Get your Ticket! 🎟️"}
                        </Button>
                    </Stack>
                </>
            )}
        </Box>
    );
};

export default function BuyTicketPaymentPage() {
    const defaultTheme = createTheme({palette: "light"});
    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline/>
            <Header/>
            <Box sx={{bgcolor: "background.default"}}>
                <Box
                    id="hero"
                    sx={{
                        width: "100%",
                        height: "100vh", // Ensure the section covers the full viewport height
                        backgroundImage: `url('https://www.ub.tum.de/files/tum_uhrenturm_1482543.jpg')`, // Your background image
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center", // Center content vertically
                        alignItems: "flex-end", // Align content to the right
                    }}
                >
                    <InfoBox/>
                </Box>
                <Divider/>
                <Footer/>
            </Box>
        </ThemeProvider>
    );
}
