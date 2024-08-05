import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {visuallyHidden} from '@mui/utils';
import {styled} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";

const StyledBox = styled('div')(({theme}) => ({
    alignSelf: 'center',
    width: '100%',
    height: 400,
    marginTop: theme.spacing(8),
    borderRadius: theme.shape.borderRadius,
    outline: '1px solid',
    boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
    backgroundImage: `url(${'/static/images/templates/templates-images/hero-light.png'})`,
    outlineColor: 'hsla(220, 25%, 80%, 0.5)',
    backgroundSize: 'cover',
    [theme.breakpoints.up('sm')]: {
        marginTop: theme.spacing(10), height: 700,
    },
}));

const InfoBox = () => {
    const navigate = useNavigate();
    const handleButtonClick = (event) => {
        if (event.currentTarget.id === "submitEvent") {
            navigate("/submitEvent");
        } else if (event.currentTarget.id === "signUpCompany") {
            navigate("/signUpCompany");
        }
    }


    return (
        <Box className="info-box"
             sx={{
                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
                 backdropFilter: 'blur(10px)', // Adjusted to blur 10px
                 border: '4px solid #FFFFFF',
                 borderRadius: '10px',
                 height: 250,
                 width: 500,
                 marginLeft: 'auto', // Ensure it is aligned to the right
                 marginRight: 15, // Some margin from the right edge
                 //marginTop: 0, // Adjusted to 10 to fit better in the layout
                 marginBottom: -30,
                 p: 3 // Padding to add some space inside the box
             }}>
            <Typography
                sx={{color: '#FFFFFF', fontSize: '30px', fontWeight: 'bold', marginBottom: 2, textAlign: 'left'}}>
                Searching for the brightest minds in Data Science, Engineering, and Leadership?
            </Typography>
            <Stack spacing={2} direction="row" sx={{justifyContent: 'center'}}>
                <Button id={"submitEvent"} variant="outlined" sx={{
                    width: 180,
                    bgcolor: '#1C75BC',
                    color: '#FFFFFF',
                    '&:hover': {
                        bgcolor: '#FFFFFF', // Light blue background on hover
                        color: '#1C75BC',   // White text on hover
                    }
                }} onClick={(event) => handleButtonClick(event)}>
                    Submit Event
                </Button>
                <Button id={"signUpCompany"} variant="outlined" sx={{
                    width: 180,
                    bgcolor: '#1C75BC',
                    color: '#FFFFFF',
                    '&:hover': {
                        bgcolor: '#FFFFFF', // Light blue background on hover
                        color: '#1C75BC',   // White text on hover
                    }
                }} onClick={(event) => handleButtonClick(event)}>
                    Create Account
                </Button>
            </Stack>
        </Box>
    );
};

export default function CompaniesHero() {
    return (
        <Box
            id="hero"
            sx={{
                width: '100%',
                height: '100vh', // Ensure the section covers the full viewport height
                backgroundImage: `url('https://www.ub.tum.de/files/tum_uhrenturm_1482543.jpg')`, // Your background image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Center content vertically
                alignItems: 'flex-end' // Align content to the right
            }}
        >
            <InfoBox/>
        </Box>
    );
}
