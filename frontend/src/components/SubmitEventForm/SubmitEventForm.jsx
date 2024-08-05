import {
    Alert,
    AlertTitle,
    Button,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import axios from "axios";
import {useContext, useEffect, useRef, useState} from "react";
import {getToken} from "../../../utils/tokenService.jsx";
import Maps from "../Maps.jsx";
import Box from "@mui/material/Box";
import TextFieldSubmitEvent from "./components/TextFieldSubmitEvent.jsx";
import WideBox from "./components/WideBox.jsx";
import SelectTopCategory from "../SelectTopCategory.jsx";
import SelectSubCategory from "../SelectSubCategory.jsx";
import DateTimePickerComp from "../DateTimePickerComp.jsx";
import dayjs from "dayjs";
import AlertDialog from "../AlertDialog.jsx";
import useAuth from "../../../utils/useAuth.jsx";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SelectionRecurringEvent from "./components/SelectionRecurringEvent.jsx";
import TimePickerRange from "./components/TimePickerRange.jsx";
import SubmitEventTitle from "./components/SubmitEventTitle.jsx";
import SubmitEventDescription from "./components/SubmitEventDescription.jsx";
import SubmitEventParticipants from "./components/SubmitEventParticipants.jsx";
import SubmitEventPrice from "./components/SubmitEventPrice.jsx";
import SubmitEventText from "./components/SubmitEventText.jsx";
import {UserContext} from "../../context/UserContext.jsx";
import {styled} from "@mui/material/styles";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import EventIcon from "@mui/icons-material/Event";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import SettingsIcon from "@mui/icons-material/Settings";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {ErrorContext} from "../../context/ErrorContext.jsx";
import backgroundImage from "../TUM_Uhrenturm.jpg";

const CustomStepIcon = styled("div")(({active}) => ({
    backgroundColor: active ? "#1D75BC" : "grey",
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    color: "#FFFFFF",
}));

const CustomStepLabel = styled(StepLabel)(({active}) => ({
    "& .MuiStepLabel-label": {
        backgroundColor: active ? "#1D75BC" : "#FFFFFF",
        borderRadius: "10px",
        padding: "4px 8px",
        fontSize: "16px",
        fontWeight: active ? "bold" : "normal",
        color: active ? "#1D75BC" : "#000000",
    },
}));

const SubmitEventForm = () => {
    const {user} = useContext(UserContext);
    const [eventName, setEventName] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [eventLocation, setEventLocation] = useState({
        country: "Deutschland",
        city: "Garching bei München",
        zipCode: "85748",
        street: "Boltzmannstraße",
        number: "15",
        latitude: 48.2656062,
        longitude: 11.668422,
    });
    const [eventDescription, setEventDescription] = useState("");
    const [eventTopCategory, setEventTopCategory] = useState("");
    const [eventSubCategory, setEventSubCategory] = useState("");
    const [eventWebsite, setEventWebsite] = useState("");
    const [eventSocialMedia, setEventSocialMedia] = useState("");

    const [eventPrice, setEventPrice] = useState("0");
    const [isTopCategoryOther, setIsTopCategoryOther] = useState(false);
    const [isSubCategoryOther, setIsSubCategoryOther] = useState(false);

    const [eventOtherTopCategory, setEventOtherTopCategory] = useState("");
    const [eventOtherSubCategory, setEventOtherSubCategory] = useState("");

    const [participants, setParticipants] = useState("0");

    const [recurringEvent, setRecurringEvent] = useState("once");

    const [dialogOpen, setDialogOpen] = useState(false);
    const isAuthenticated = useAuth();
    const isCompany = user?.role === "company";

    const [openImageAlert, setOpenImageAlert] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const [errorTime, setErrorTime] = useState(false);
    const [errorEventName, setErrorEventName] = useState(false);
    const [errorEventDescription, setErrorEventDescription] = useState(false);
    const [errorParticipants, setErrorParticipants] = useState(false);
    const [errorPrice, setErrorPrice] = useState(false);
    const [errorTopCategory, setErrorTopCategory] = useState(false);
    const [errorSubCategory, setErrorSubCategory] = useState(false);
    const [errorWebsite, setErrorWebsite] = useState(false);
    const [errorSocialMedia, setErrorSocialMedia] = useState(false);
    const {setErrorMessage} = useContext(ErrorContext);


    // Stepper
    const [activeStep, setActiveStep] = useState(0);
    const [isFormVisible, setIsFormVisible] = useState(true);


    const steps = [{label: 'Describe your event', icon: <FactCheckIcon/>}, {
        label: 'Choose the date',
        icon: <EventIcon/>
    }, {label: 'Define details', icon: <SettingsIcon/>}, {label: 'Visualize your event ', icon: <PhotoCameraIcon/>},];

    const [mapsForm, setMapsForm] = useState({
        name: "", address: "", latitude: null, longitude: null, radius: 500,
    });


    const fileUploadRef = useRef();
    const [uploadedFile, setUploadedFile] = useState();

    const handleNext = () => {
        if (getToken() === null) {
            setDialogOpen(true);
            return;
        }
        if (validateStep(activeStep)) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const validateStep = (step) => {
        let isValid = true;
        switch (step) {
            case 0:
                if (!eventName) {
                    setErrorEventName(true);
                    isValid = false;
                } else {
                    setErrorEventName(false);
                }
                if (!eventDescription) {
                    setErrorEventDescription(true);
                    isValid = false;
                } else {
                    setErrorEventDescription(false);
                }
                if (!eventTopCategory) {
                    setErrorTopCategory(true);
                    isValid = false;
                } else {
                    setErrorTopCategory(false);
                }
                if (!eventSubCategory) {
                    setErrorSubCategory(true);
                    isValid = false;
                } else {
                    setErrorSubCategory(false);
                }
                break;
            case 1:
                if (eventStartDate === undefined || eventStartDate === "" || eventEndDate === "" || eventEndDate === undefined || dayjs(eventStartDate).isAfter(dayjs(eventEndDate), "minute")) {
                    setErrorDate(true);
                    isValid = false;
                } else {
                    setErrorDate(false);
                }
                break;
            case 2:
                if (!participants || Number(participants) < 1) {
                    setErrorParticipants(true);
                    isValid = false;
                } else {
                    setErrorParticipants(false);
                }
                if (!eventPrice || Number(eventPrice) < 0) {
                    setErrorPrice(true);
                    isValid = false;
                } else {
                    setErrorPrice(false);
                }
                break;
            case 3:
                // Additional validation for the last step if required
                break;
            default:
                break;
        }
        return isValid;
    };

    const handleClick = async () => {
        if (!isAuthenticated) {
            setDialogOpen(true);
        } else {
            //To check, if there has been at least one error
            let onceError = false;

            if (!eventName || eventName === "") {
                setErrorEventName(true);
                onceError = true;
            } else {
                setErrorEventName(false);
            }

            if (!eventDescription || eventDescription === "") {
                setErrorEventDescription(true);
                onceError = true;
            } else {
                setErrorEventDescription(false);
            }
            if (eventStartDate === "" || eventEndDate === "") {
                setErrorDate(true);
                onceError = true;
            } else {
                setErrorDate(false);
            }

            if (!participants || participants === "0" || participants === "") {
                setErrorParticipants(true);
                onceError = true;
            } else {
                setErrorParticipants(false);
            }

            if (!eventPrice || eventPrice === "") {
                setErrorPrice(true);
                onceError = true;
            } else {
                setErrorPrice(false);
            }


            if (eventTopCategory === "") {
                setErrorTopCategory(true);
                onceError = true;
            }
            if (eventSubCategory === "") {
                setErrorSubCategory(true);
                onceError = true;
            }

            if (isTopCategoryOther && eventOtherTopCategory === "") {
                setErrorTopCategory(true);
                onceError = true;
            }

            if (isSubCategoryOther && eventOtherSubCategory === "") {
                setErrorSubCategory(true);
                onceError = true;
            }
            try {
                const participantsNumber = Number(participants);
                if (participantsNumber < 1) {
                    setErrorParticipants(true);
                    onceError = true;
                }
            } catch (error) {
                setErrorParticipants(true);
                return;
            }

            try {
                const priceNumber = Number(eventPrice);
                if (priceNumber < 0) {
                    setErrorPrice(true);
                    onceError = true;
                }
            } catch (error) {
                setErrorPrice(true);
                onceError = true;
            }

            const urlRegex = /^(https?:\/\/)?(www\.)?[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
            if (eventWebsite !== "" && !urlRegex.test(eventWebsite)) {
                setErrorWebsite(true);
                onceError = true;
            }

            if (eventSocialMedia !== "" && !urlRegex.test(eventSocialMedia)) {
                setErrorSocialMedia(true);
                onceError = true;
            }

            if (onceError) {
                return;
            }

            const token = getToken();
            console.log(token);
            let newEvent = {
                eventName: eventName,
                eventStartDate: eventStartDate,
                eventEndDate: eventEndDate,
                eventDescription: eventDescription,
                eventCategory: eventSubCategory,
                eventLocation: eventLocation,
                recurringEvent: recurringEvent,
                price: Number(eventPrice),
                participants: Number(participants),
                published: false,
                paid: !isCompany,
            };
            if (isTopCategoryOther) {
                newEvent = isTopCategoryOther ? {...newEvent, eventOtherTopCategory: eventOtherTopCategory} : newEvent;
            }
            if (isSubCategoryOther) {
                newEvent = isSubCategoryOther ? {...newEvent, eventOtherSubCategory: eventOtherSubCategory} : newEvent;
            }
            if (eventWebsite !== "") {
                newEvent = {...newEvent, eventWebsite: eventWebsite};
            }
            if (eventSocialMedia !== "") {
                newEvent = {...newEvent, eventSocialMedia: eventSocialMedia};
            }

            newEvent = {...newEvent, image: uploadedFile};

            try {
                const response = await axios
                    .post("http://localhost:8080/api/events/", newEvent, {
                        headers: {
                            "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`,
                        },
                    });

                if (response.data) {
                    const tempEventId = response.data._id;
                    console.log("Event created successfully", response.data);
                    if (isCompany) {
                        window.location.href = `http://localhost:5010/submitEvent/payment/${tempEventId}`;
                    } else {
                        setIsFormVisible(false);
                    }
                }
            } catch (error) {
                console.error("Error creating event:", error);
                if (error.response) {
                    if (error.response.status === 401) {
                        window.location.href = "/noAccess";
                    }
                }
                const errorMessage = error?.response?.data?.message || "Unknown";
                setErrorMessage(errorMessage);
                window.location.href = "/error";

            }

        }
    };
    useEffect(() => {
        const checkDate = () => {
            const now = dayjs();
            const startDate = dayjs(eventStartDate);
            const endDate = dayjs(eventEndDate);
            const isStartDateAfterEndDate = startDate.isAfter(endDate);
            // By minute as we the seconds when the event is created doesn't matter (Edge case)
            const isStartDateInPast = startDate.isBefore(now, "minute");
            const isEndDateInPast = endDate.isBefore(now, "minute");
            // Event should not be too far in the future
            const isStartDateTooFarFuture = startDate.isAfter(now.add(5, "years"), "day");
            const isEndDateTooFarFuture = endDate.isAfter(now.add(5, "years"), "day");
            if (recurringEvent !== "once") {
                const startDate = dayjs(eventStartDate).format("YYYY-MM-DD");
                const endDate = dayjs(eventEndDate).format("YYYY-MM-DD");
                const startDateTime = dayjs(eventStartDate).format("HH:mm");
                const endDateTime = dayjs(eventEndDate).format("HH:mm");
                let hasDateError = false
                if (recurringEvent === "weekly") {
                    const deltaDays = dayjs(eventEndDate).diff(dayjs(eventStartDate), 'day');
                    if (deltaDays < 7) {
                        hasDateError = true;
                    }
                } else if (recurringEvent === "biweekly") {
                    const deltaDays = dayjs(eventEndDate).diff(dayjs(eventStartDate), 'day');
                    if (deltaDays < 14) {
                        hasDateError = true;
                    }
                } else if (recurringEvent === "monthly") {
                    const deltaMonths = dayjs(eventEndDate).diff(dayjs(eventStartDate), 'month');
                    if (deltaMonths < 1) {
                        hasDateError = true;
                    }
                }
                if (startDate > endDate) {
                    hasDateError = true;
                }


                if (hasDateError) {
                    setErrorDate(true);
                } else {
                    setErrorDate(false);
                }

                if (startDateTime > endDateTime) {
                    setErrorTime(true);
                } else {
                    setErrorTime(false);
                }
            } else if (recurringEvent === "once" && (isStartDateAfterEndDate || isStartDateInPast || isEndDateInPast || isStartDateTooFarFuture || isEndDateTooFarFuture)) {


                setErrorDate(true);
            } else {
                setErrorDate(false);
            }
        };
        checkDate();
    }, [eventStartDate, eventEndDate, recurringEvent]);

    const handleImageUpload = () => {
        fileUploadRef.current.click();
    };

    const uploadImageDisplay = async (event) => {
        setUploadedFile(event.target.files[0]);
        setOpenImageAlert(true);
    };


    return (<>{isFormVisible ? (
        <Stack alignItems={"center"}>


            {/*/!*     <Stack*!/*/}
            {/*//     direction="column"*/}
            {/*//     alignContent={"center"}*/}
            {/*//     alignItems={"center"}*/}
            {/*//     width={"90%"}*/}
            {/*//     sx={{justifyContent: "center", margin: "auto"}}*/}
            {/*// >*/}
            <Stack sx={{
                paddingTop: "20vh",
                paddingBottom: "10vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: "100vw",
            }}
                   spacing={3}
                   alignItems={"center"}
            >
                <Stack sx={{
                    padding: "30px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(10px)",
                    border: "4px solid #FFFFFF",
                    borderRadius: "10px",
                    width: "70%",
                    marginTop: 400,
                }}
                       alignItems={"center"}
                       spacing={2}
                >
                    <Typography variant={"h3"} color="common.white">Submit an event 🚀</Typography>

                    <Stepper activeStep={activeStep} sx={{marginBottom: 3, marginTop: 3}}>
                        {steps.map((step, index) => (<Step key={step.label}>
                            <CustomStepLabel
                                icon={<CustomStepIcon active={activeStep === index}>{step.icon}</CustomStepIcon>}>
                                {step.label}
                            </CustomStepLabel>
                        </Step>))}
                    </Stepper>

                </Stack>

            </Stack>

            {(<Stack alignItems={"center"}
                     sx={{margin: "10px", borderRadius: "16px", padding: "20px", paddingTop: "50px", width: "80%"}}>
                {activeStep === 0 && (<Grid container direction="column" spacing={2}>
                    <WideBox categoryname={"Event Name *"}>
                        <SubmitEventTitle
                            setEventName={setEventName}
                            eventName={eventName}
                            error={errorEventName}
                            setError={setErrorEventName}
                        />
                    </WideBox>
                    <WideBox categoryname={"Event Description *"}>
                        <SubmitEventDescription
                            eventDescription={eventDescription}
                            setEventDescription={setEventDescription}
                            error={errorEventDescription}
                            setError={setErrorEventDescription}
                        />
                    </WideBox>
                    <WideBox categoryname={"Category *"}>
                        <Stack direction="row" alignItems="flex-start" spacing={2}>
                            <Stack direction="column" spacing={2}>

                                <SelectTopCategory
                                    setEventTopCategory={setEventTopCategory}
                                    setIsOther={setIsTopCategoryOther}
                                    selectedTopCategory={eventTopCategory}
                                    error={errorTopCategory}
                                    setError={setErrorTopCategory}
                                />
                                {isTopCategoryOther && (<TextFieldSubmitEvent
                                    onChange={(e) => setEventOtherTopCategory(e.target.value)}
                                    value={eventOtherTopCategory}
                                    rows={1}
                                    style={{width: 300}}
                                />)}
                            </Stack>

                            <Stack direction="column" spacing={2}>

                                <SelectSubCategory
                                    selectedTopCategory={eventTopCategory}
                                    selectedCategory={eventSubCategory}
                                    setSubCategory={setEventSubCategory}
                                    setIsOther={setIsSubCategoryOther}
                                    error={errorSubCategory}
                                    setError={setErrorSubCategory}
                                />
                                {isSubCategoryOther && (<TextFieldSubmitEvent
                                    onChange={(e) => setEventOtherSubCategory(e.target.value)}
                                    value={eventOtherSubCategory}
                                    rows={1}
                                    style={{width: 300}}
                                />)}
                            </Stack>
                        </Stack>
                    </WideBox>

                </Grid>)}

                {activeStep === 1 && (<Grid container direction="column" spacing={2}>
                    <WideBox categoryname={"Recurring Event *"}>
                        <SelectionRecurringEvent
                            recurringEvent={recurringEvent}
                            setRecurringEvent={setRecurringEvent}
                        />
                    </WideBox>

                    <WideBox categoryname={"Start Date *"}>
                        <DateTimePickerComp
                            eventDateObj={dayjs(eventStartDate)}
                            setEventDate={setEventStartDate}
                            dateError={errorDate}
                            recurring={recurringEvent !== "once"}
                            width={"30vw"}
                        />
                    </WideBox>
                    <WideBox categoryname={"End Date *"}>
                        <DateTimePickerComp
                            eventDateObj={dayjs(eventEndDate)}
                            setEventDate={setEventEndDate}
                            dateError={errorDate}
                            recurring={recurringEvent !== "once"}
                            width={"30vw"}
                        />
                    </WideBox>

                    {recurringEvent !== "once" && (<WideBox categoryname={"Choose the recurring time"}>
                        <TimePickerRange
                            eventEndTime={dayjs(eventEndDate)}
                            setEventEndTime={setEventEndDate}
                            eventStartTime={dayjs(eventStartDate)}
                            dateError={errorTime}
                            setError={setErrorTime}
                            setEventStartTime={setEventStartDate}
                        />
                    </WideBox>)}
                </Grid>)}

                {activeStep === 2 && (<Grid container direction="column" spacing={2}>
                    <WideBox categoryname={"Participants *"}>
                        <SubmitEventParticipants
                            participants={participants}
                            setParticipants={setParticipants}
                            error={errorParticipants}
                            setError={setErrorParticipants}
                        />
                    </WideBox>
                    <WideBox categoryname={"Price *"}>
                        <SubmitEventPrice
                            eventPrice={eventPrice}
                            setEventPrice={setEventPrice}
                            error={errorPrice}
                            setError={setErrorPrice}
                        />
                    </WideBox>
                    <WideBox categoryname={"Location *"}>
                        <Stack direction={"column"} spacing={4} alignItems={"flex-end"}>
                            <Maps
                                form={mapsForm}
                                setForm={setMapsForm}
                                address={eventLocation}
                                setAddress={setEventLocation}
                                onlyView={false}
                                width={"80vh"}
                                height={"50vh"}
                                onlyEdit={false}
                            />
                        </Stack>
                    </WideBox>
                </Grid>)}

                {activeStep === 3 && (<Grid container direction="column" spacing={2}>
                    <WideBox categoryname={"Header Picture"}>
                        <Button onClick={handleImageUpload}>Upload Image</Button>
                        <input
                            type="file"
                            ref={fileUploadRef}
                            onChange={uploadImageDisplay}
                            style={{display: "none"}}
                        />
                    </WideBox>
                    {openImageAlert && (<Alert
                        severity="success"
                        onClose={() => setOpenImageAlert(false)}
                        sx={{marginLeft: 2}}
                    >
                        <AlertTitle>Success</AlertTitle>
                        Your image was successfully submitted.
                    </Alert>)}
                    <WideBox categoryname={"Website"}>
                        <SubmitEventText
                            eventWebsite={eventWebsite}
                            setEventWebsite={setEventWebsite}
                            error={errorWebsite}
                            setError={setErrorWebsite}
                        />
                    </WideBox>
                    <WideBox categoryname={"Social Media"}>
                        <SubmitEventText
                            eventWebsite={eventSocialMedia}
                            setEventWebsite={setEventSocialMedia}
                            error={errorSocialMedia}
                            setError={setErrorSocialMedia}
                        />
                    </WideBox>
                </Grid>)}

                <Stack direction={"row"} spacing={3} width={"100%"} sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{mr: 1}}
                    >
                        Back
                    </Button>
                    <Box sx={{flex: '1 1 auto'}}/>
                    {activeStep === steps.length - 1 ? (
                        <Button onClick={handleClick}>Submit event</Button>) : (
                        <Button onClick={handleNext}>Next</Button>)}
                </Stack>
            </Stack>)}
            <AlertDialog open={dialogOpen} type={"registrationSubmit"} onClose={() => setDialogOpen(false)}/>
        </Stack>
    ) : (<Stack
        direction={"column"}
        width={"100%"}
        height={"400px"}
        spacing={3}
        alignItems={"center"}
        justifyContent={"center"}
        padding={"50px"}
    >
        <CheckCircleOutlineIcon
            sx={{color: "green"}}
            fontSize={"large"}
        ></CheckCircleOutlineIcon>
        <Typography variant={"h6"}>Your Event has been successfully submitted 🚀 </Typography>
        <Typography variant={"h6"}>The event will be published after a review of our
            administrators within 24h</Typography>
    </Stack>)

    } </>)
}

export default SubmitEventForm;
