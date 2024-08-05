import { Alert, Button, Grid, InputAdornment, Stack } from "@mui/material";
import axios from "axios";
import { useRef, useContext, useState } from "react";
import { getToken } from "../../utils/tokenService.jsx";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import SelectTopCategory from "./SelectTopCategory.jsx";
import SelectSubCategory from "./SelectSubCategory.jsx";
import { useNavigate } from "react-router-dom";
import WideBox from "./SubmitEventForm/components/WideBox.jsx";
import TextFieldSubmitEvent from "./SubmitEventForm/components/TextFieldSubmitEvent.jsx";
import { UserContext } from "../context/UserContext.jsx";

const SubmitEventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventTopCategory, setEventTopCategory] = useState("");
  const [eventSubCategory, setEventSubCategory] = useState("");
  const [eventParticipants, setEventParticipants] = useState("0");
  const [eventPrice, setEventPrice] = useState("0");
  const { user } = useContext(UserContext);
  const fileUploadRef = useRef();
  let [uploadedFile, setUploadedFile] = useState();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    if (
      !eventName ||
      !eventStartDate ||
      !eventEndDate ||
      !eventLocation ||
      !eventDescription ||
      !eventParticipants ||
      !eventPrice ||
      !eventTopCategory ||
      !eventSubCategory
    ) {
      setError("Required field(s) is/are missing!");
      return;
    }
    const formData = new FormData();
    if (uploadedFile) {
      formData.append("image", uploadedFile);
    }
    const token = getToken();
    const isCompany = user?.role === "company";

    const newEvent = {
      eventName: eventName,
      eventStartDate: eventStartDate,
      eventEndDate: eventEndDate,
      eventDescription: eventDescription,
      eventCategory: eventSubCategory,
      eventLocation: eventLocation,
      participants: eventParticipants,
      price: eventPrice,
      published: false,
      paid: !isCompany, //If isCompany == True the value has to be False, for students the value is True
    };

    Object.keys(newEvent).forEach((key) => {
      formData.append(key, newEvent[key]);
    });

    axios
      .post("http://localhost:8080/api/events/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        if (isCompany) {
          console.log("EventID:", response.data.id); // Assuming the response contains an id field
          let selectedPlan;

          if (eventParticipants <= 50) {
            selectedPlan = 0; // "Professional"
          } else if (eventParticipants <= 100) {
            selectedPlan = 1; //"Enterprise"
          } else {
            selectedPlan = 2; //"Unlimited"
          }

          navigate("/paymentEventSubmission", {
            state: { eventName, selectedPlan },
          });
        } else {
          navigate("/event-creation-success", { state: { eventName } });
        }
      })
      .catch((error) => {
        navigate("/error", { state: { errorMessage: error.message } });
      });
  };

  const handleImageUpload = () => {
    fileUploadRef.current.click(); //simulate click event on <input>
  };

  const uploadImageDisplay = async (event) => {
    console.log(event.target);
    setUploadedFile(event.target.files[0]); //single type uploader
    console.log("UploadImage: ", uploadedFile);
  };

  return (
    <Stack
      direction="column"
      alignContent={"center"}
      alignItems={"center"}
      width={"60%"}
      sx={{ justifyContent: "center", margin: "auto", marginTop: "50px" }}
    >
      <h2>Submit an event </h2>
      <Box
        sx={{
          margin: "10px",
          borderRadius: "16px",
          padding: "20px",
          width: "90%",
        }}
      >
        <Grid direction="column">
          <WideBox categoryname={"Event Name*"}>
            <TextFieldSubmitEvent
              onChange={(e) => setEventName(e.target.value)}
              value={eventName}
              style={{ width: 500 }}
            />
          </WideBox>
          <WideBox categoryname={"Start Date*"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                views={["year", "month", "day", "hours", "minutes"]}
                ampm={false}
                label={""}
                value={eventStartDate ? dayjs(eventStartDate) : null}
                onChange={(newValue) =>
                  setEventStartDate(newValue.toISOString())
                }
              />
            </LocalizationProvider>
          </WideBox>
          <WideBox categoryname={"End Date*"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                views={["year", "month", "day", "hours", "minutes"]}
                ampm={false}
                label={""}
                value={eventEndDate ? dayjs(eventEndDate) : null}
                onChange={(newValue) => setEventEndDate(newValue.toISOString())}
              />
            </LocalizationProvider>
          </WideBox>
          <WideBox categoryname={"Event Location*"}>
            <TextFieldSubmitEvent
              onChange={(e) => setEventLocation(e.target.value)}
              value={eventLocation}
              required={true}
              rows={1}
              maxRows={1}
              style={{ width: 500 }}
            />
          </WideBox>
          <WideBox categoryname={"Event Description*"}>
            <TextFieldSubmitEvent
              onChange={(e) => setEventDescription(e.target.value)}
              value={eventDescription}
              required={true}
              multiline={true}
              fullWidth={true}
              sx={{ width: "100%" }}
              rows={10}
              maxRows={15}
              style={{ width: 500 }}
            />
          </WideBox>
          <WideBox categoryname={"Category*"}>
            <SelectTopCategory
              setEventTopCategory={setEventTopCategory}
              selectedTopCategory={eventTopCategory}
            ></SelectTopCategory>
            <SelectSubCategory
              selectedTopCategory={eventTopCategory}
              selectedCategory={eventSubCategory}
              setSubCategory={setEventSubCategory}
            ></SelectSubCategory>
          </WideBox>
          <WideBox categoryname={"Participants*"}>
            <TextFieldSubmitEvent
              onChange={(e) => setEventParticipants(e.target.value)}
              value={eventParticipants}
              required={true}
              rows={1}
              maxRows={1}
              width={200}
              style={{ width: 100 }}
            />
          </WideBox>
          <WideBox categoryname={"Price*"}>
            <TextFieldSubmitEvent
              onChange={(e) => setEventPrice(e.target.value)}
              value={eventPrice}
              required={true}
              rows={1}
              maxRows={1}
              width={200}
              style={{ width: 100 }}
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              }}
            />
          </WideBox>

          <WideBox categoryname={"Header Picture"}>
            <Button onClick={handleImageUpload}>Upload Image</Button>
            <input
              type="file"
              ref={fileUploadRef} //whenever I call fileUploadRef, I am referencing this <input>
              onChange={uploadImageDisplay}
              style={{ display: "none" }}
            />
          </WideBox>
          {error && <Alert severity="error">{error}</Alert>}
        </Grid>
      </Box>

      <Button
        variant="outlined"
        color="secondary"
        type="submit"
        onClick={handleClick}
        sx={{ borderRadius: "16px", margin: "10px", width: "15%" }}
      >
        Create Event
      </Button>
    </Stack>
  );
};

export default SubmitEventForm;
