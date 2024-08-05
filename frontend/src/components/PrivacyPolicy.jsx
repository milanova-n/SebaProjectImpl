import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider, Link, CssBaseline } from '@mui/material';
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function PrivacyPolicy() {
    const defaultTheme = createTheme({ palette: 'light' });

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Header />
            <Box sx={{ bgcolor: 'background.default', padding: 5, marginTop: 10 }}>
                <Typography variant="h4" gutterBottom>
                    Privacy Policy
                </Typography>
                <Typography variant="body1" paragraph>
                    This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Personal Information We Collect
                </Typography>
                <Typography variant="body1" paragraph>
                    When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the site, and information about how you interact with the site. We refer to this automatically-collected information as “Device Information.”
                </Typography>
                <Typography variant="h5" gutterBottom>
                    How Do We Use Your Personal Information?
                </Typography>
                <Typography variant="body1" paragraph>
                    We use the Order Information that we collect generally to fulfill any orders placed through the site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:
                </Typography>
                <ul>
                    <li><Typography variant="body1">Communicate with you;</Typography></li>
                    <li><Typography variant="body1">Screen our orders for potential risk or fraud; and</Typography></li>
                    <li><Typography variant="body1">When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</Typography></li>
                </ul>
                <Typography variant="h5" gutterBottom>
                    Sharing Your Personal Information
                </Typography>
                <Typography variant="body1" paragraph>
                    We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Stripe to power the payment in our online store--you can read more about how Stripe uses your Personal Information <Link href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer">here</Link>. We also use a Google Maps integration to visualize the location of the events--you can read more about how Google uses your Personal Information <Link href="https://www.google.com/intl/en/policies/privacy/" target="_blank" rel="noopener noreferrer">here</Link>.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Your Rights
                </Typography>
                <Typography variant="body1" paragraph>
                    If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Data Retention
                </Typography>
                <Typography variant="body1" paragraph>
                    When you place an order through the site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Changes
                </Typography>
                <Typography variant="body1" paragraph>
                    We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Contact Us
                </Typography>
                <Typography variant="body1" paragraph>
                    For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by email at <Link href="mailto:seba.team21@gmail.com">seba.team21@gmail.com</Link> or by mail using the details provided below:
                </Typography>
                <Typography variant="body1">
                    SEBA TEAM 21<br />
                    Boltzmannstraße 3, <br />
                    85748 Garching <br />
                    Germany
                </Typography>
                <Divider sx={{ my: 3 }} />
            </Box>
            <Footer />
        </ThemeProvider>
    );
}
