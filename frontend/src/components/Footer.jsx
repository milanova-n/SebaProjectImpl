import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from "@mui/icons-material/Mail";
import {Instagram} from "@mui/icons-material";
import {Link as RouterLink} from 'react-router-dom';
import Copyright from "./Copyright.jsx";
import LogoLink from "./LogoLink/LogoLink.jsx";


const linkStyle = {
    textDecoration: 'none',
    color: "text.secondary"
};

export default function Footer() {
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: {xs: 4, sm: 8},
                py: {xs: 8, sm: 10},
                textAlign: {sm: 'center', md: 'left'},
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', sm: 'row'},
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        minWidth: {xs: '100%', sm: '40%'},
                    }}
                >
                    <LogoLink height="80px"/>
                    <Stack
                        direction="row"
                        spacing={2}
                        useFlexGap
                        sx={{justifyContent: 'left', color: 'text.secondary'}}
                    >
                        <IconButton
                            color="inherit"
                            href="mailto: seba.team21@gmail.com"
                            aria-label="Mail"
                            sx={{alignSelf: 'center'}}
                        >
                            <MailIcon/>
                        </IconButton>
                        <IconButton
                            color="inherit"
                            href="https://linkedin.com"
                            aria-label="LinkedIn"
                            sx={{alignSelf: 'center'}}
                        >
                            <LinkedInIcon/>
                        </IconButton>
                        <IconButton
                            color="inherit"
                            href="https://www.instagram.com/"
                            aria-label="Instagram"
                            sx={{alignSelf: 'center'}}
                        >
                            <Instagram/>
                        </IconButton>
                    </Stack>
                    <Copyright/>
                </Box>
                <Box
                    sx={{
                        display: {xs: 'none', sm: 'flex'},
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Typography color="#1C75BC" variant="body2" sx={{fontWeight: 'bold'}}>
                        Quick Links
                    </Typography>
                    <RouterLink to="/events" style={linkStyle}>
                        <Typography variant="body2" color="text.secondary">All Events</Typography>
                    </RouterLink>
                    <RouterLink to="/submitEvent" style={linkStyle}>
                        <Typography variant="body2" color="text.secondary">Submit Event</Typography>
                    </RouterLink>
                    <RouterLink to="/faq" style={linkStyle}>
                        <Typography variant="body2" color="text.secondary">FAQs</Typography>
                    </RouterLink>
                </Box>
                <Box
                    sx={{
                        display: {xs: 'none', sm: 'flex'},
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Typography color="#1C75BC" variant="body2" sx={{fontWeight: 'bold'}}>
                        Legal
                    </Typography>
                    <RouterLink to="/Impressum" style={linkStyle}>
                        <Typography variant="body2" color="text.secondary">Impressum</Typography>
                    </RouterLink>
                    <RouterLink to="/GeneralTerms" style={linkStyle}>
                        <Typography variant="body2" color="text.secondary">Terms of Service</Typography>
                    </RouterLink>
                    <RouterLink to="/PrivacyPolicy" style={linkStyle}>
                        <Typography variant="body2" color="text.secondary">Privacy Policy</Typography>
                    </RouterLink>
                </Box>
                <Box
                    sx={{
                        display: {xs: 'none', sm: 'flex'},
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Typography color="#1C75BC" variant="body2" sx={{fontWeight: 'bold'}}>
                        Contact us
                    </Typography>
                    <Link
                        href="mailto:seba.team21@gmail.com"
                        color="text.secondary"
                        variant="body2"
                        sx={linkStyle}
                    >
                        seba.team21@gmail.com
                    </Link>
                    <Link
                        href="tel:+4989123456789"
                        color="text.secondary"
                        variant="body2"
                        sx={linkStyle}
                    >
                        +49 89 1234 56789
                    </Link>
                    <Link
                        href="https://www.google.com/maps/place/TUM+School+of+Computation,+Information+and+Technology+(CIT)/@48.262547,11.6654128,17z/data=!3m2!4b1!5s0x479e72edbf93d39d:0x24cc61bdb93edf40!4m6!3m5!1s0x479e72ed94cb83f3:0x6ec67872741a9e84!8m2!3d48.2625435!4d11.6679877!16s%2Fg%2F11h7j33crk?entry=ttu"
                        color="text.secondary"
                        variant="body2"
                        sx={linkStyle}
                    >
                        Boltzmannstraße 3, 85748 Garching
                    </Link>
                </Box>
            </Box>

        </Container>
    );
}
