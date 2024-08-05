// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {useTheme} from '@mui/system';
import BMW_Logo from "./CompanyLogos/BMW-Logo.svg"
import Microsoft_Logo from "./CompanyLogos/Microsoft-Logo.svg"
import Google from "./CompanyLogos/Google-Logo.svg"

const userTestimonials = [
    {
        name: 'Sam Jerkins',
        occupation: 'Head of Recruiting at Google',
        testimonial: "No matter if recruiting, marketing or coding events, tt always nice to have TUM talents at our Events. TUMSocial helps us to promote our events and to get in touch with these highly talented students."
        ,
    },
    {
        name: 'Markus Chen',
        occupation: 'Senior Marketing Lead at Microsoft',
        testimonial: "Promoting events can be annoying, especially if you want to reach a specific group. TUMSocial helps us to reach a community of motivated students and to invite them to our events!"
    },
    {
        name: 'Javier Ramirez',
        occupation: 'Senior Vice President R&D at BMW',
        testimonial: "We love to promote our events at TUMSocial, as it is very uncomplicated for us and we always receive a list of high potentials as participants for our events!"
    },
];

const whiteLogos = [
    BMW_Logo,
    Microsoft_Logo,
    Google,
];


const logoStyle = {
    width: '80px',
};

export default function CompaniesTestimonials() {
    const theme = useTheme();
    const logos = whiteLogos;

    return (
        <Container
            id="testimonials"
            sx={{
                pt: {xs: 4, sm: 12},
                pb: {xs: 8, sm: 10},
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: {xs: 3, sm: 6},
            }}
        >
            <Box
                sx={{
                    width: {sm: '100%', md: '60%'},
                    textAlign: {sm: 'left', md: 'center'},
                }}
            >
                <Typography component="h2" variant="h4" sx={{color: 'text.primary'}}>
                    What other companies say! 💭
                </Typography>
                <Typography variant="body1" sx={{color: 'text.secondary'}}>
                    See what our members love about our TUM Social. Discover how we improve the experience of every
                    member study experience.
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {userTestimonials.map((testimonial, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} sx={{display: 'flex'}}>
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                flexGrow: 1,
                                p: 1,
                            }}
                        >
                            <CardContent>
                                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                    {testimonial.testimonial}
                                </Typography>
                            </CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    pr: 2,
                                }}
                            >

                                <CardHeader
                                    title={testimonial.name}
                                    subheader={testimonial.occupation}
                                />
                                <img
                                    src={logos[index]}
                                    alt={`Logo ${index + 1}`}
                                    style={logoStyle}
                                />

                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
