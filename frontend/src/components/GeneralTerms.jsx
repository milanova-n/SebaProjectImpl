import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider, Link, CssBaseline } from '@mui/material';
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function GeneralTerms() {
    const defaultTheme = createTheme({ palette: 'light' });

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Header />
            <Box sx={{ bgcolor: 'background.default', padding: 5, marginTop: 10 }}>
                <Typography variant="h4" gutterBottom>
                    General Terms and Conditions
                </Typography>
                <Typography variant="body1" paragraph>
                    Welcome to our ticket platform for students. These General Terms and Conditions govern the use of our services and the purchase of tickets through our platform.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Service Description
                </Typography>
                <Typography variant="body1" paragraph>
                    We are a ticket platform offering events specifically for students. Our platform allows students to purchase tickets for various events. It is important to note that we do not host the events; we only sell the tickets.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Ticket Purchase
                </Typography>
                <Typography variant="body1" paragraph>
                    Each student is allowed to purchase only one ticket per event using their personalized @tum.de email address. This ensures that all students have a fair chance to attend the events.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Refunds and Transfers
                </Typography>
                <Typography variant="body1" paragraph>
                    Please be aware that refunds for purchased tickets are not possible. Additionally, transferring the ticket to another person is not allowed. These policies help us maintain the integrity of our ticketing system.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Liability
                </Typography>
                <Typography variant="body1" paragraph>
                    As we are only the sellers of the tickets and not the event hosts, we are not responsible for any issues that may arise at the events themselves. Any concerns or complaints regarding the events should be directed to the event organizers.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Changes to Terms
                </Typography>
                <Typography variant="body1" paragraph>
                    We reserve the right to update these terms and conditions from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Contact Us
                </Typography>
                <Typography variant="body1" paragraph>
                    If you have any questions about these General Terms and Conditions or our services, please contact us by email at <Link href="mailto:seba.team21@gmail.com">seba.team21@gmail.com</Link>.
                </Typography>
                <Divider sx={{ my: 3 }} />
            </Box>
            <Footer />
        </ThemeProvider>
    );
}
