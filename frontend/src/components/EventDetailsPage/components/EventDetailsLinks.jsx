import React, {useEffect, useState} from 'react';
import {Button, Link, Stack} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language'; // For the website
import InstagramIcon from '@mui/icons-material/Instagram'; // For Instagram
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Box from "@mui/material/Box";
import PropTypes from "prop-types"; // For WhatsApp
import FacebookIcon from '@mui/icons-material/Facebook';
import TelegramIcon from '@mui/icons-material/Telegram';

const EventDetailsLinks = ({eventWebsite, eventSocialMedia}) => {
    const [eventWebsiteIsEmpty, setEventWebsiteIsEmpty] = useState(true);
    const [eventSocialMediaIsEmpty, setEventSocialMediaIsEmpty] = useState(true);
    const [correctedEventWebsite, setCorrectedEventWebsite] = useState("");
    const [correctedEventSocialMedia, setCorrectedEventSocialMedia] = useState("");
    useEffect(() => {
        if (eventWebsite !== undefined) {
            if (eventWebsite === "") {
                setEventWebsiteIsEmpty(true);
            } else if (correctedEventWebsite === "") {
                setCorrectedEventWebsite(eventWebsite);
                setEventWebsiteIsEmpty(false)
            }
        }
        if (eventSocialMedia !== undefined) {
            if (eventSocialMedia === "") {
                setEventSocialMediaIsEmpty(true);
            } else if (correctedEventSocialMedia === "") {
                setCorrectedEventSocialMedia(eventSocialMedia);
                setEventSocialMediaIsEmpty(false)
            }
        }
    }, [eventWebsite, eventSocialMedia]);

    const iconDecider = (link) => {
        if (link.includes("instagram") || link.includes("instagr.am")) {
            return <InstagramIcon/>
        } else if (link.includes("whatsapp") || link.includes("wa.me")) {
            return <WhatsAppIcon/>
        } else if (link.includes("facebook") || link.includes("fb.com")) {
            return <FacebookIcon/>
        } else if (link.includes("telegram") || link.includes("t.me")) {
            return <TelegramIcon/>
        } else {
            return <LanguageIcon/>
        }
    }

    const openLink = (link) => {
        if (link.includes("http")) {
                window.location.href = link;
        } else {
            window.location.href = "https://"+link;
        }
    }



    return (

        (!eventWebsiteIsEmpty || !eventSocialMediaIsEmpty) &&
        <Box sx={{
            border: '1px solid #000',
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: "grey.500"
        }}>
            <Stack direction={"row"}
                   style={{display: 'flex', justifyContent: 'space-around', width: '150px', margin: 'auto'}}>
                {!eventWebsiteIsEmpty &&
                    <Button onClick={() => openLink(eventWebsite)}
                            sx={{color: 'black'}}>
                        <LanguageIcon/>
                    </Button>
                }
                {!eventSocialMediaIsEmpty &&
                    <Button onClick={() => openLink(eventSocialMedia)}
                            sx={{color: 'black'}}>
                        {eventSocialMedia ? iconDecider(eventSocialMedia) : ""}
                    </Button>
                }
            </Stack>
        </Box>
    )
        ;

};

EventDetailsLinks.propTypes = {
    eventWebsite: PropTypes.string,
    eventSocialMedia: PropTypes.string,
}

export default EventDetailsLinks;