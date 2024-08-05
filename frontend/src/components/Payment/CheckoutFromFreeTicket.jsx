import {getToken} from "../../../utils/tokenService.jsx";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {PaymentElement} from "@stripe/react-stripe-js";
import {Box, Button, CircularProgress, Typography} from "@mui/material";
import PropTypes from "prop-types";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline.js";
import {useNavigate} from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function CheckoutFormFree({eventId}) {
    const [message, setMessage] = useState("Waiting for Server");
    const [processSuccess, setProcessSuccess] = useState(false);
    const [processed, setProcessed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const updateEventTickets = async () => {
        try {
            const token = getToken(); // Assuming you have a getToken function
            const resp = await axios.patch(
                `http://localhost:8080/api/events/${eventId}/addTicket`,
                {},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            if (resp.status === 200) {
                setMessage("Booking succeeded! You can find your tickets in your profile!");
                setProcessSuccess(true);
            } else {
                setMessage("Booking succeeded, but failed to update event and user tickets.")
            }
            setProcessed(true);
        } catch (error) {
            setMessage("Booking succeeded, but failed to update event and user tickets.")
            console.error("Failed to update event tickets:", error);
            setProcessed(true);
        }


    };


    useEffect(() => {
        if (!processed) {
            updateEventTickets();
        }

    }, [])

    const handleNavigateToStart = () => {
        navigate('/'); // Adjust the path to your start page
    };


    /*    return (<>
                <form id="payment-form">
                    <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 2}}>
                        <CheckCircleOutlineIcon sx={{color: '#6AF170', fontSize: 150}}/>
                        <Typography variant="body2" sx={{color: 'white'}}>
                            {message}
                        </Typography>
                    </Box>
                </form>

            </>
        );*/
    if (processSuccess) {
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2}}>
                {processSuccess ? <CheckCircleOutlineIcon sx={{color: '#6AF170', fontSize: 150}}/> :
                    <ErrorOutlineIcon sx={{color: '#FF0000', fontSize: 150}}/>}
                <Typography variant="h6" sx={{color: '#FFFFFF', marginTop: 1}}>
                    {message}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleNavigateToStart}
                    sx={{bgcolor: '#1C75BC', color: '#FFFFFF', marginTop: 2}}
                >
                    Go to Start Page
                </Button>
            </Box>
        );
    } else {
        return (
            <Box sx={{display: 'flex'}}>
                <CircularProgress/>
            </Box>
        )
    }


}
CheckoutFormFree.propTypes = {
    eventId: PropTypes.string.isRequired
}