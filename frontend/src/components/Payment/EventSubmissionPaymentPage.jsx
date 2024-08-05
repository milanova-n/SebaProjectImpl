import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PaymentIcon from "@mui/icons-material/Payment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import PaymentCreatorGeneral from "./PaymentCreatorGeneral.jsx"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { getToken } from "../../../utils/tokenService.jsx";
import axios from "axios";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ErrorContext } from "../../context/ErrorContext.jsx";

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

const InfoBox = () => {
  const { eventId } = useParams(); // Get eventId from URL

  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState(false);
  const steps = [
    { label: "Event Details", icon: <FactCheckIcon /> },
    { label: "Payment Details", icon: <PaymentIcon /> },
  ];
  const [details, setDetails] = useState({
    eventName: "",
    eventStart: "",
    eventEnd: "",
    eventLocation: "",
    eventParticipants: 0,
    eventPrice: "",
  });

  const [companyPrice, setCompanyPrice] = useState(0);
  const [product, setProduct] = useState("");
  const { user } = useContext(UserContext);
  const [userId, setUserId] = useState("user@example.com");
  const token = getToken();
  const { setErrorMessage } = useContext(ErrorContext);

  const loadEventById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/events/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
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
        eventParticipants: Number(res.data.participants),
        eventPrice: res.data.price.$numberDecimal,
      });

      calculateCompanyPrice(Number(res.data.participants));
    } catch (error) {
      console.error("Failed to load event details:", error);
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }
  };

  const calculateCompanyPrice = (participants) => {
    console.log("Participants: ", participants);
    let price;
    let tempProduct;

    if (participants <= 50) {
      price = 30.0;
      tempProduct = "Professional";
    } else if (participants <= 100) {
      price = 50.0;
      tempProduct = "Enterprise";
    } else {
      price = 100.0;
      tempProduct = "Unlimited";
    }

    setCompanyPrice(price);
    setProduct(tempProduct);
  };

  useEffect(() => {
    loadEventById();
    console.log(token);
    setUserId(user?._id);
  }, [eventId,user]);

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
        Promote your event! 🚀
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
          <Table sx={{ color: "#FFFFFF" }}>
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
                  {details.eventName || "-"}
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
                  {details.eventStart || "-"}
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
                  {details.eventEnd || "-"}
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
                  {details.eventLocation || "-"}
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
                  Participants:
                </TableCell>
                <TableCell
                  sx={{
                    color: "#FFFFFF",
                    borderBottom: "none",
                    padding: "4px",
                  }}
                >
                  {details.eventParticipants || "-"}
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
                  Ticket Price:
                </TableCell>
                <TableCell
                  sx={{
                    color: "#FFFFFF",
                    borderBottom: "none",
                    padding: "4px",
                  }}
                >
                  {details.eventPrice || "-"}
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
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
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
              sx={{ color: "#FFFFFF", fontSize: "16px", fontWeight: "bold" }}
            >
              {companyPrice}€
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
                and accept.
              </Typography>
            }
          />
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
          <PaymentCreatorGeneral
            product={product}
            price={companyPrice}
            user={userId}
            eventId={eventId}
            processOfPayment={"createEvent"}
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
            disabled={activeStep === 0 && !checked}
            sx={{ bgcolor: "#1C75BC", color: "#FFFFFF" }}
          >
            Pay Now and Publish Event
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default function EventSubmissionPaymentPage() {
  const defaultTheme = createTheme({ palette: "light" });
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header />
      <Box sx={{ bgcolor: "background.default" }}>
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
          <InfoBox />
        </Box>
        <Divider />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
