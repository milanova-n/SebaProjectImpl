import {Button, Stack, Typography} from "@mui/material";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import {useContext, useState} from "react";
import {UserContext} from "../../../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import AlertDialog from "../../AlertDialog.jsx";

const EventDetailsTicket = ({details, disableButton, eventIsFull, hasTicket, isOwner, edit}) => {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);

    const showTitleContent = () => {
        if (details.price?.$numberDecimal > 0 && (!disableButton || edit)) {
            return (
                <Typography variant={"h5"}>{details.price.$numberDecimal} €</Typography>
            )
        } else if (eventIsFull) {
            return (
                <Typography variant={"h8"} align={"center"}>This event is full 😢</Typography>)
        } else {
            return (
                <Typography variant={"h6"}>Free</Typography>
            )
        }
    }

    const handleClickOpen = () => {
        if (!user.subscriptionIsActive) {
            setDialogOpen(true);
        } else if (hasTicket || isOwner) {
            navigate(`/profile/${user._id}`);
        } else if (!disableButton) {
            navigate(`/events/payment/${details._id}`);
        }
    }

    const buttonText = () => {
        if (disableButton) {
            return "Not available"
        } else if (details.categoryName === "Study Group") {
            return "Join Group"
        } else if (hasTicket) {
            return "View your booked events"
        } else if (isOwner) {
            return "View your event"
        } else {
            return "Get your ticket"
        }
    }

    /*    const messageText = () => {
            if (isComp) {

            }
        }*/


    return (
        <Stack direction="column" spacing={2} sx={{
            width: "auto",
            height: "auto",
            padding: "2vh",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "16px",
            alignItems: "center",
            border: 1,
            borderColor: "grey.500"
        }}>
            <Box width={"100%"}>
                <Typography align="center" variant={"h6"}>Are you ready to meet new people? 🚀</Typography>
            </Box>
            {showTitleContent()}

            <Box>

                    <Button
                        variant="contained"
                        onClick={handleClickOpen}
                        disabled={disableButton}
                    >
                        {buttonText()}
                    </Button>

            </Box>
            <AlertDialog
                type={"subscription"}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            ></AlertDialog>
        </Stack>
    );
};

EventDetailsTicket.propTypes = {
    details: PropTypes.object,
    handleClickOpen: PropTypes.func,
    disableButton: PropTypes.bool,
    hasTicket: PropTypes.bool,
    isOwner: PropTypes.bool,
    isComp: PropTypes.bool,
    edit: PropTypes.bool,
    eventIsFull: PropTypes.bool
}
export default EventDetailsTicket;