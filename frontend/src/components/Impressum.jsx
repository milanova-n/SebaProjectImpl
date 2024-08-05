import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { createTheme, ThemeProvider, Link, CssBaseline } from '@mui/material';
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Impressum() {
    const defaultTheme = createTheme({ palette: 'light' });

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Header />
            <Box sx={{ bgcolor: 'background.default', padding: 5, marginTop: 10 }}>
                <Typography variant="h4" gutterBottom>
                    Impressum
                </Typography>
                <Typography variant="body1" paragraph>
                    Information according to § 5 TMG
                </Typography>
                <Typography variant="body1" paragraph>
                    SEBA TEAM 21<br />
                    Boltzmannstraße 3, <br />
                    85748 Garching <br />
                    Germany
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Contact
                </Typography>
                <Typography variant="body1" paragraph>
                    Phone: +49 (0) 123 456 789 <br />
                    Fax: +49 (0) 987 654 321 <br />
                    Email: <Link href="mailto:seba.team21@gmail.com">seba.team21@gmail.com</Link>
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Responsible for the content according to § 55 Abs. 2 RStV
                </Typography>
                <Typography variant="body1" paragraph>
                    Max Mustermann <br />
                    Boltzmannstraße 3, <br />
                    85748 Garching <br />
                    Germany
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Liability for Content
                </Typography>
                <Typography variant="body1" paragraph>
                    As service providers, we are responsible for our own content on these pages according to § 7 Abs.1 TMG under the general laws. According to §§ 8 to 10 TMG, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
                </Typography>
                <Typography variant="body1" paragraph>
                    Obligations to remove or block the use of information under general laws remain unaffected. However, liability in this regard is only possible from the time of knowledge of a specific infringement. Upon notification of violations, we will remove this content immediately.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Liability for Links
                </Typography>
                <Typography variant="body1" paragraph>
                    Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the sites is always responsible for the contents of the linked sites. The linked sites were checked for possible legal violations at the time of linking. Illegal contents were not recognizable at the time of linking.
                </Typography>
                <Typography variant="body1" paragraph>
                    A permanent control of the linked pages is not reasonable without concrete evidence of an infringement. Upon notification of violations, we will remove such links immediately.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Copyright
                </Typography>
                <Typography variant="body1" paragraph>
                    The contents and works on these pages created by the site operators are subject to German copyright law. Duplication, processing, distribution, and any kind of use outside the limits of copyright law require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use.
                </Typography>
                <Typography variant="body1" paragraph>
                    Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, please notify us accordingly. Upon notification of violations, we will remove such content immediately.
                </Typography>
                <Divider sx={{ my: 3 }} />
            </Box>
            <Footer />
        </ThemeProvider>
    );
}
