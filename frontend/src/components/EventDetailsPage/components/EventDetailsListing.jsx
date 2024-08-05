import PropTypes from "prop-types";
import {Divider, Stack, Typography} from "@mui/material";
import dayjs from "dayjs";
import {useState} from "react";
import EventDetailsDescription from "./EventDetailsDescription.jsx";
import EventDetailsLocation from "./EventDetailsLocation.jsx";
import EventDetailsDate from "./EventDetailsDate.jsx";
import EventDetailsTitle from "./EventDetailsTitle.jsx";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Box from "@mui/material/Box";
import EventDetailsBarTicketPartOrga from "./EventDetailsBarTicketPartOrga.jsx";
import Chip from "@mui/material/Chip";

dayjs.extend(utc);
dayjs.extend(timezone);

const EventDetailsListing = ({
                                 details,
                                 setDetails,
                                 handleTextChange,
                                 edit,
                                 isStudyGroup,
                                 websiteError,
                                 socialMediaError,
                                 setWebsiteError,
                                 setSocialMediaError,
                                 descriptionError,
                                 setDescriptionError
                             }) => {
    const startDate = dayjs(details.eventStartDate);
    const endDate = dayjs(details.eventEndDate);
    const [isStartDateValid, setIsStartDateValid] = useState(true);
    const [isEndDateValid, setIsEndDateValid] = useState(true);

    const handleDateChange = (attribute) => (date) => {
        date = dayjs(date);
        const dateToday = dayjs();
        if (date.isBefore(dateToday)) {
            if (attribute === "eventStartDate") {
                setIsStartDateValid(false);
            } else if (attribute === "eventEndDate") {
                setIsEndDateValid(false);
            }
            return;
        } else {
            if (attribute === "eventStartDate") {
                setIsStartDateValid(true);
            } else if (attribute === "eventEndDate") {
                setIsEndDateValid(true);
            }
        }

        setDetails({
            ...details,
            [attribute]: date.toISOString(),
        });
    };

    return (
        <Stack
            direction={"row"}
            spacing={10}
            paddingBottom={"10vh"}
            alignItems={"center"}
            width={"100%"}
            height={"auto"}
            sx={{backgroundColor: "white"}}
        >
            {/*sx={{width: "auto", height: "auto", backgroundColor: "white"}}*/}
            <Stack
                direction={"column"}
                spacing={4}
                alignItems={"space-between"}
                sx={{width: "100%", height: "auto", backgroundColor: "white"}}
            >


                <Stack direction={"row"} spacing={1} justifyContent={"space-between"} sx={{backgroundColor: "white"}}>

                    <Stack direction={"column"} spacing={4}>
                        <Box width={"40vw"}>
                            <EventDetailsDescription
                                edit={edit}
                                details={details}
                                handleTextChange={handleTextChange}
                                descriptionError={descriptionError}
                                setDescriptionError={setDescriptionError}
                            />
                        </Box>
                        <Stack
                            direction={"row"}
                            sx={{
                                /*
                                                                paddingBottom: "50px",
                                */
                                width: "35vw",
                                borderRadius: "16px",
                                border: 1,
                                borderColor: "grey.500",
                                justifyContent: "flex-start",
                            }}
                            spacing={0}
                        >

                            <EventDetailsLocation
                                location={details.eventLocation}
                                handleTextChange={handleTextChange}
                                isStudyGroup={isStudyGroup}
                                edit={edit}
                            />
                            <Divider orientation="vertical" variant="middle" flexItem/>

                            <EventDetailsDate
                                startDate={startDate}
                                endDate={endDate}
                                handleDateChange={handleDateChange}
                                isStudyGroup={isStudyGroup}
                                edit={edit}
                                details={details}
                                isStartDateValid={isStartDateValid}
                                isEndDateValid={isEndDateValid}
                            />

                        </Stack>

                    </Stack>


                    <EventDetailsBarTicketPartOrga details={details}
                                                   edit={edit}
                                                   handleTextChange={handleTextChange}
                                                   websiteError={websiteError}
                                                   socialMediaError={socialMediaError}
                                                   setWebsiteError={setWebsiteError}
                                                   setSocialMediaError={setSocialMediaError}/>

                </Stack>
            </Stack>


        </Stack>
    );
};

EventDetailsListing.propTypes = {
    handleTextChange: PropTypes.func,
    details: PropTypes.object,
    setDetails: PropTypes.func,
    edit: PropTypes.bool,
    isStudyGroup: PropTypes.bool,
    handleClickOpen: PropTypes.func,
    websiteError: PropTypes.bool,
    socialMediaError: PropTypes.bool,
    setWebsiteError: PropTypes.func,
    setSocialMediaError: PropTypes.func,
    descriptionError: PropTypes.bool,
    setDescriptionError: PropTypes.func
};
export default EventDetailsListing;
