import EventDetailsTicket from "./EventDetailsTicket.jsx";
import EventDetailsParticipantsOverview from "./EventDetailsParticipantsOverview.jsx";
import EventDetailsSubmitter from "./EventDetailsSubmitter.jsx";
import {Stack, TextField} from "@mui/material";
import PropTypes from "prop-types";
import {useContext, useEffect, useState} from "react";
import dayjs from "dayjs";
import {UserContext} from "../../../context/UserContext.jsx";
import EventDetailsLinks from "./EventDetailsLinks.jsx";

const EventDetailsBarTicketPartOrga = ({
                                           edit,
                                           details,
                                           handleTextChange,
                                           socialMediaError,
                                           websiteError,
                                           setSocialMediaError,
                                           setWebsiteError
                                       }) => {

    const [disableButton, setDisableButton] = useState(false);
    const [hasTicket, setHasTicket] = useState(false);
    const {user} = useContext(UserContext);
    const [participants, setParticipants] = useState(0);
    const [totalParticipants, setTotalParticipants] = useState(0);
    const [isOwner, setIsOwner] = useState(false);


    useEffect(() => {
        if (edit && details.participants !== undefined) {
            setDisableButton(true)
        } else if (edit) {
            setDisableButton(true)
        } else if (user.role !== undefined && (user.role === "company" || user.role === "admin")) {
            setDisableButton(true);
        } else if (!edit && details !== undefined && user._id !== undefined && details.eventName !== "") {
            if (dayjs(details.eventStartDate)) {
                const startDate = dayjs(details.eventStartDate);
                const currentDate = dayjs();
                if (currentDate.isAfter(startDate)) {
                    setDisableButton(true);
                }
            }
            details.tickets.forEach(ticket => {
                if (ticket._id === user._id) {
                    setHasTicket(true);
                }
            })
            if (details.userId === user._id) {
                setIsOwner(true);
            }
            if (details.tickets.length >= details.participants) {
                setDisableButton(true);
            }
        }
        if (details.tickets !== undefined && details.participants !== undefined) {
            setParticipants(details.tickets.length);
            setTotalParticipants(details.participants);
        }
    }, [details, user]);

    const handleLinksChange = (event) => {
        if (event.target.id === "website") {
            handleTextChange('eventWebsite')(event);
            setWebsiteError(false);
        } else if (event.target.id === "socialMedia") {
            handleTextChange('eventSocialMedia')(event);
            setSocialMediaError(false);
        }
    }


    return (
        <Stack
            direction={"column"}
            spacing={4}

            width={"30vh"}
            height={"auto"}
            sx={{backgroundColor: "white", border: 0}}
        >

            <EventDetailsTicket
                details={details}
                disableButton={disableButton}
                hasTicket={hasTicket}
                isOwner={isOwner}
                edit={edit}
                eventIsFull={details.tickets ? details.tickets.length >= details.participants : false}
            />


            <EventDetailsParticipantsOverview participants={participants} totalParticipants={totalParticipants}/>

            <EventDetailsSubmitter
                submitterName={details.eventSubmitter}
                userId={details.userId}
            />

                <EventDetailsLinks
                    eventWebsite={details.eventWebsite}
                    eventSocialMedia={details.eventSocialMedia}
                />


            {edit &&
                <Stack direction={"column"} width={"auto"} alignItems={"flex-end"}
                       sx={{border: 1, borderColor: "grey.500", borderRadius: "16px", backgroundColor: "white"}}
                       spacing={3}
                       padding={"5%"}
                >
                    <TextField
                        id="website"
                        value={details.eventWebsite}
                        /*
                                            onChange={(event) => handleLinkChange(event)}
                        */
                        onChange={handleLinksChange}
                        label="Website"
                        error={websiteError}
                        maxRows={1}
                        fullWidth={true}
                    />
                    <TextField
                        id="socialMedia"
                        value={details.eventSocialMedia}
                        /*
                                            onChange={(event) => handleLinkChange(event)}
                        */
                        onChange={handleLinksChange}
                        error={socialMediaError}
                        label="Social Media"
                        maxRows={1}
                        fullWidth={true}
                    />
                </Stack>
            }

        </Stack>

    )

}
EventDetailsBarTicketPartOrga.propTypes = {
    details: PropTypes.object.isRequired,
    edit: PropTypes.bool.isRequired,
    handleTextChange: PropTypes.func.isRequired,
    socialMediaError: PropTypes.bool.isRequired,
    websiteError: PropTypes.bool.isRequired,
    setSocialMediaError: PropTypes.func.isRequired,
    setWebsiteError: PropTypes.func.isRequired
}
export default EventDetailsBarTicketPartOrga;
