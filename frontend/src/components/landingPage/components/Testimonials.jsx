import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {useTheme} from '@mui/system';
//import AmyPic from "../frontend/public/Testimonials/Testimonial_Amy_Rosenthal.jpg"

const userTestimonials = [
    {
        avatar: <Avatar alt="Amy Rosenthal" src="/frontend/public/Testimonials/Testimonial_Amy_Rosenthal.svg" sx={{ width: 60, height: 60 }}/>,
        name: 'Amy Rosenthal',
        occupation: 'M.Sc. Information Systems',
        personal:
            "I like spending time on my own. This resulted for me into problems to get all information about university.",
        testimonial: "Since I am part of TUMSocial I know where to find all information and how to find the right WhatsApp Group for each lecture!"
        ,
    },
    {
        avatar: <Avatar alt="Peter Adams" src="/frontend/public/Testimonials/Testimonial_Amy_Rosenthal.svg" sx={{ width: 60, height: 60 }}/>,
        name: 'Peter Adams',
        occupation: 'M.Sc. Biomedical Computing',
        personal:
            "For me it was always difficult to get in touch with other students during my Bachelor.",
        testimonial: "Since I’m a member of TUMSocial I don’t have to worry about that anymore. Here I find all events on one platform."
    },
    {
        avatar: <Avatar alt="Luisa Neugebauer" src="/frontend/public/Testimonials/Testimonial_Amy_Rosenthal.svg" sx={{ width: 60, height: 60 }}/>,
        name: 'Luisa Neugebauer',
        occupation: 'M.Sc. Informatics',
        personal:
            'I always felt stressed because I was afraid to miss something!',
        testimonial: "In my Master I signed up for  TUMSocial and my student life changed completely!"
    },
];

const whiteLogos = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ufGVufDB8fDB8fHww',
    'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

];


const logoStyle = {
    width: '64px',
    opacity: 0.3,
};

export default function Testimonials() {
    const theme = useTheme();
    const logos = whiteLogos;

    return (
        <Container
            id="testimonials"
            sx={{
                pt: {xs: 4, sm: 12},
                pb: {xs: 8, sm: 16},
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
                    What other students say
                </Typography>
                <Typography variant="body1" sx={{color: 'text.secondary'}}>
                    See what our members love about our TUM Social. Discover how we improve the experience of every member study experience.
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
                                <Typography variant="body2" sx={{color: 'text.secondary', mb: 2}}>
                                    {testimonial.personal}
                                </Typography>

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
                                    avatar={testimonial.avatar}
                                    title={testimonial.name}
                                    subheader={testimonial.occupation}
                                />
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
