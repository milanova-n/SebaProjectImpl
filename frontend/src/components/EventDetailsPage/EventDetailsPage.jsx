import {useState, useEffect, useContext, useRef} from "react";
import {useLocation, useParams} from "react-router-dom";
import axios from "axios";
import {Stack, IconButton, Grid, Button, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";

import backgroundImageEvent from "../../../public/Running.svg";
import backgroundImage from "../TUM_Uhrenturm.jpg";

import {getToken} from "../../../utils/tokenService.jsx";
import PropTypes from "prop-types";
import EventDetailsListing from "./components/EventDetailsListing.jsx";
import PatchEventBar from "../PatchEventBar.jsx";
import Box from "@mui/material/Box";
import SubscriptionDialog from "../Dialog.jsx";

import SimpleBottomNavigation from "../BottomNavigation.jsx";
import Maps from "../Maps.jsx";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import {UserContext} from "../../context/UserContext.jsx";
import {theme} from "../../theme/theme.js";
import EventDetailsParticipants from "./components/EventDetailsParticipants.jsx";
import ChatComponent from "../ChatComponent.jsx";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TextField from "@mui/material/TextField";
import {ErrorContext} from "../../context/ErrorContext.jsx";
import EventDetailsTitle from "./components/EventDetailsTitle.jsx";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const EventDetailsPage = ({edit}) => {
    const fileUploadRef = useRef();
    const {eventId} = useParams()
    const [open, setOpen] = useState(false)
    const {user} = useContext(UserContext);
    const {setErrorMessage} = useContext(ErrorContext);
    const query = useQuery();
    const initialNavValue = query.get('nav') ? parseInt(query.get('nav'), 10) : 0;
    const [hasAccessToSee, setHasAccessToSee] = useState(false);
    const [details, setDetails] = useState({
        eventCategory: "",
        eventTopCategory: "",
        eventCategoryId: "",
        eventName: "",
        eventDescription: "",
        eventStartDate: "",
        eventEndDate: "",
        eventLocation: {},
        eventSubmitter: "",
        price: {
            $numberDecimal: 0,
        },
        headerPicture: "",
        eventWebsite: "",
        eventSocialMedia: "",
    });
    const token = getToken();
    const [isStudyGroup, setIsStudyGroup] = useState(false);
    const [socialMediaError, setSocialMediaError] = useState(false);
    const [websiteError, setWebsiteError] = useState(false);
    const [mapsObject, setMapsObject] = useState({});


    const handleClickOpen = () => {
        if (!edit) {
            setOpen(true);
            if (user.role === "student") {
                if (!edit && user.subscriptionIsActive !== undefined && !user.subscriptionIsActive) {
                    setOpen(true)
                } else {
                    window.location.href = `/events/payment/${eventId}`
                }
            }
        }
    }


    const handleTextChange = (attribute) => (event) => {
        setDetails({
            ...details,
            [attribute]: event.target.value,
        });
    };


    useEffect(() => {
        setMapsObject(details.eventLocation);
    }, [details]);

    const loadEventById = async () => {
        let res;
        try {
            res = await axios.get(`http://localhost:8080/api/events/${eventId}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Unknown";
            setErrorMessage(errorMessage);
            window.location.href = "/error";
        }
        let getCategoryObject;
        try {
            getCategoryObject = await axios.get(
                `http://localhost:8080/api/categories/subCategories/${res.data.eventCategory}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Unknown";
            setErrorMessage(errorMessage);
            window.location.href = "/error";
        }
        let categoryName = "";
        if (typeof getCategoryObject?.data.subCategory === "object") {
            categoryName = getCategoryObject?.data.subCategory.courseName;
        } else {
            categoryName = getCategoryObject?.data.subCategory;
        }
        setDetails({
            ...res.data,
            eventCategory: categoryName,
            eventCategoryId: res.data.eventCategory,
            headerPicture: res.data.headerPicture,
        });

        let getTopCategoryName;
        try {
            getTopCategoryName = await axios.get(
                `http://localhost:8080/api/categories/topCategories/${getCategoryObject.data.topCategory}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Unknown";
            setErrorMessage(errorMessage);
            window.location.href = "/error";
        }
        if (getTopCategoryName?.data.topCategory === "Study Group") {
            setIsStudyGroup(true);
        }

        setDetails((prevState) => ({
            ...prevState,
            eventTopCategory: getTopCategoryName?.data.topCategory, // Assuming this is the correct value and type
        }));
    };

    useEffect(() => {
        loadEventById();
    }, [eventId]);
    useEffect(() => {
        if (details?.userId === user._id) {
            setHasAccessToSee(true);
        } else if (details?.tickets) {
            const atLeastOneMatch = details.tickets.some(
                (participant) => participant._id === user._id
            );
            if (atLeastOneMatch) {
                setHasAccessToSee(true);
            }
        } else {
            setHasAccessToSee(false);
        }
    }, [details, user]);

    const [navValue, setNavValue] = useState(initialNavValue);
    const [openInputField, setOpenInputField] = useState(false);
    const [message, setMessage] = useState("");
    const [descriptionError, setDescriptionError] = useState(false);
    const startDate = dayjs(details?.eventStartDate);
    const switchNavValue = (newValue) => {
        switch (newValue) {
            case 0:
                return (
                    <>
                        <SubscriptionDialog open={open} setOpen={setOpen}/>
                        <EventDetailsListing
                            edit={edit}
                            details={details}
                            setDetails={setDetails}
                            handleTextChange={handleTextChange}
                            isStudyGroup={isStudyGroup}
                            handleClickOpen={handleClickOpen}
                            websiteError={websiteError}
                            setWebsiteError={setWebsiteError}
                            socialMediaError={socialMediaError}
                            setSocialMediaError={setSocialMediaError}
                            descriptionError={descriptionError}
                            setDescriptionError={setDescriptionError}

                        />

                    </>
                );
            case 1:
                return (
                    <>
                        <Stack
                            direction={"column"}
                            width={"100%"}
                            spacing={5}
                            alignItems={"center"}
                            paddingTop={"2%"}
                        >
                            <Maps
                                address={mapsObject}
                                setAddress={setMapsObject}
                                latitude={mapsObject.latitude}
                                longitude={mapsObject.longitude}
                                onlyView={edit === false && isStudyGroup === false}
                                width={"100vh"}
                                height={"50vh"}
                            ></Maps>
                        </Stack>
                    </>
                );
            case 2:
                return (
                    <>
                        <Stack
                            direction={"column"}
                            width={"100%"}
                            spacing={5}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            {hasAccessToSee?(
                                <ChatComponent eventId={eventId}> </ChatComponent>

                            ): <Typography variant={"h6"}>You first need a ticket to view the chat!</Typography>}

                        </Stack>
                    </>
                );
            case 3:
                return <></>;
            case 4:
                return (
                    <>
                        <EventDetailsParticipants
                            eventId={details._id}
                            participants={details.tickets}
                            eventSubmitter={details.userId}
                            isStudyGroup={isStudyGroup}
                        />
                    </>
                );
        }
    };
    const handleDeleteImage = async () => {
        try {
            const deletedImage = await axios.delete(
                `http://localhost:8080/api/events/headerPicture/${eventId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDetails(deletedImage.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    window.location.href = "/noAccess";
                }
                console.log("Error while deleting header picture: ", error);
                const errorMessage = error?.response?.data?.message || "Unknown";
                setErrorMessage(errorMessage);
                window.location.href = "/error";
            }
        }
    };
    const handleImageUpload = () => {
        fileUploadRef.current.click(); //simulate click event on <input>
    };

    const uploadImageDisplay = async (event) => {
        try {
            const uploadedFile = event.target.files[0]; //single type uploader
            const formData = new FormData();
            formData.append("image", uploadedFile);
            formData.append("id", eventId);
            console.log("Uploaded file", uploadedFile);

            const response = await axios.post(
                "http://localhost:8080/api/events/uploadImage",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Response: ", response);
            setDetails(response.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    window.location.href = "/noAccess";
                }
                console.log("Error while uploading profile picture: ", error);
                const errorMessage = error?.response?.data?.message || "Unknown";
                setErrorMessage(errorMessage);
                window.location.href = "/error";
            }
        }
    };

    const handleAcceptClick = async () => {
        try {
            const res = await axios.put(
                `http://localhost:8080/api/events/${eventId}/notification`,
                {
                    userId: details.userId,
                    status: "ACCEPTED",
                },
                {headers: {Authorization: `Bearer ${token}`}}
            );
            window.location.href = "/admin";
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Unknown";
            setErrorMessage(errorMessage);
            window.location.href = "/error";
        }
    };

    const handleDeclineClick = () => {
        setOpenInputField(true);
    };


    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            // Save the message
            try {
                const res = await axios.put(
                    `http://localhost:8080/api/events/${eventId}/notification`,
                    {
                        userId: details.userId,
                        message: message,
                        status: "DECLINED",
                    },
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                // Optionally, clear the input field
                setMessage("");
                // Hide the input field
                setOpenInputField(false);
                // Prevent the default form submission behavior
                event.preventDefault();
                window.location.href = "/admin";
            } catch (error) {
                const errorMessage = error?.response?.data?.message || "Unknown";
                setErrorMessage(errorMessage);
                window.location.href = "/error";
            }
        }
    };

    return (
        <>
            <Header/>

            <Box
                sx={{
                    width: "100%",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                }}
            >
                <Box paddingTop={"15vh"}></Box>

                <Stack
                    spacing={9}
                    alignItems="center"
                    sx={{
                        width: "80%",
                        height: "auto",
                        margin: "auto",
                        paddingTop: "2%",
                        backgroundColor: "white",
                        borderTopRightRadius: "16px",
                        borderTopLeftRadius: "16px",
                    }}
                >
                    {/*<Box sx = {{width : "80%", margin: "auto", backgroundColor : "green", paddingY: "20px", alignContent: "center"}}>*/}

                    <Stack alignItems={"center"} spacing={6}>
                        <Box
                            position="relative"
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                height: "30vh",
                                width: "130vh",
                            }}
                        >
                            <Box
                                component="img"
                                alt="Background"
                                src={details.headerPicture || backgroundImageEvent}
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: "16px",
                                    objectFit: "cover",
                                }}
                            />
                            {edit && (
                                <Box
                                    position="absolute"
                                    bottom={2}
                                    right={2}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={1}
                                >
                                    <IconButton
                                        onClick={handleImageUpload}
                                        sx={{
                                            bgcolor: "rgba(255,255,255,0.7)",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <EditIcon sx={{color: theme.colors.blue}}/>
                                    </IconButton>
                                    <IconButton
                                        onClick={handleDeleteImage}
                                        sx={{
                                            bgcolor: "rgba(255,255,255,0.7)",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <DeleteIcon sx={{color: theme.colors.blue}}/>
                                    </IconButton>
                                </Box>
                            )}

                            <input
                                type="file"
                                ref={fileUploadRef} //whenever I call fileUploadRef, I am referencing this <input>
                                onChange={uploadImageDisplay}
                                style={{display: "none"}}
                            />
                        </Box>
                        <Stack justifyContent={"center"}>

                            <Stack spacing={1} paddingBottom={"1vh"}>
                                <Typography variant="h7" sx={{paddingBlock: "2px"}}>
                                    {" "}
                                    {startDate
                                        .tz("Europe/Berlin")
                                        .format("ddd, DD.MM.YYYY HH:mm")
                                        .toString()}{" "}
                                </Typography>

                                <EventDetailsTitle
                                    details={details}
                                    edit={edit}
                                    handleTextChange={handleTextChange}
                                />

                                <Stack direction={"row"} spacing={1}>
                                    <Chip label={details.eventTopCategory}/>
                                    <Chip label={details.eventCategory}/>
                                </Stack>
                            </Stack>


                            <SimpleBottomNavigation
                                navValue={navValue}
                                setNavValue={setNavValue}
                            />
                        </Stack>
                        <Stack direction={"column"} width={"90%"} height={"70vh"} alignContent={"center"}>
                            {switchNavValue(navValue)}
                            {user.role === "admin" && (
                                <Stack spacing={2}>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<ThumbUpIcon/>}
                                                onClick={handleAcceptClick}
                                            >
                                                Accept
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<ThumbDownIcon/>}
                                                onClick={handleDeclineClick}
                                            >
                                                Decline
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {openInputField && (
                                        <TextField
                                            label="Enter your reason"
                                            variant="outlined"
                                            value={message}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            margin="normal"
                                        />
                                    )}
                                </Stack>

                            )}
                        </Stack>
                    </Stack>
                    <Footer/>
                </Stack>

                <PatchEventBar
                    edit={edit}
                    details={details}
                    setDetails={setDetails}
                    eventLocation={mapsObject}
                    setSocialMediaError={setSocialMediaError}
                    setWebsiteError={setWebsiteError}
                    setDescriptionError={setDescriptionError}
                    userId={user._id}

                />
            </Box>
        </>
    );
};
EventDetailsPage.propTypes = {
    edit: PropTypes.bool,
};
export default EventDetailsPage;
