import {AppBar, Button, Snackbar, Toolbar} from "@mui/material";
import PropTypes from "prop-types";
import {getToken} from "../../utils/tokenService.jsx";
import axios from "axios";
import {useState} from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

const PatchEventBar = ({
                           details,
                           setDetails,
                           edit,
                           eventLocation,
                           setWebsiteError,
                           setSocialMediaError,
                           setDescriptionError,
                           userId,
                       }) => {
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [returnButton, setReturnButton] = useState(false);

    const patchEventById = async () => {
        details = {
            ...details,
            eventLocation: eventLocation,
        };
        const linkRegex =
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        let error = false;

        if (details.eventWebsite !== undefined && details.eventWebsite !== "" && !linkRegex.test(details.eventWebsite)) {
            setWebsiteError(true)
            error = true
        }

        if (details.eventSocialMedia !== undefined && details.eventSocialMedia !== "" && !linkRegex.test(details.eventSocialMedia)) {
            setSocialMediaError(true);
            error = true;
        }

        if (details.eventDescription !== undefined && details.eventDescription.length > 800) {
            setDescriptionError(true)
            error = true
        }

        if (error) {
            setSnackbarMessage("Event update failed!");
            setOpen(true);
            return;
        }

        const token = getToken();
        try {
            const res = await axios.patch(`http://localhost:8080/api/events/${details._id}`, details, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setDetails(res.data)
            if (res.status === 200) {
                setSnackbarMessage("Event updated successfully!")
                setOpen(true)
            }
            setReturnButton(true)
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 401) {
                    window.location.href = "/noAccess";
                }
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                setSnackbarMessage("Event update failed!")
                setOpen(true)
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
                setSnackbarMessage("Event update failed!")
                setOpen(true)
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
                setSnackbarMessage("Event update failed!")
                setOpen(true)
            }
        }

    };
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };
    /*    useEffect(() => {
            if (snackbarMessage === "Event updated successfully!") {
                window.location.href = `/profile/${userId}`;
            }
        }, [snackbarMessage]);*/

    const handleReturn = () => {
        window.location.href = `/profile/${userId}`;
    }

    if (!edit) {
        return (<> </>);
    } else {
        return (
            <>
                <AppBar position="sticky" color="primary" sx={{top: 'auto', bottom: 0}}>
                    <Toolbar sx={{height: "8vh", alignItems: "center", justifyContent: "center"}}>
                        <Box>
                            {!returnButton ?
                                <Button color="inherit" onClick={patchEventById}
                                        sx={{border: '1px solid white', width: "30vh", height: "4vh"}}>
                                    Update
                                </Button>
                                :
                                <Button color="inherit" onClick={handleReturn}
                                        sx={{border: '1px solid white', width: "30vh", height: "4vh"}}>
                                    Return to Profile
                                </Button>
                            }
                        </Box>

                    </Toolbar>
                </AppBar>
                <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        sx={{width: "100%"}}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </>
        )
    }
}

PatchEventBar.propTypes = {
    eventId: PropTypes.string,
    details: PropTypes.object,
    setDetails: PropTypes.func,
    edit: PropTypes.bool,
    eventLocation: PropTypes.object,
    setWebsiteError: PropTypes.func,
    setSocialMediaError: PropTypes.func,
    setDescriptionError: PropTypes.func,
    userId: PropTypes.string
}
export default PatchEventBar;