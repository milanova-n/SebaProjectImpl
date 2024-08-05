import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
    GroupAddRounded,
    LocalActivityRounded,
    LocalBarRounded,
    SearchRounded,
    QueryStatsRounded, ThumbUpAltRounded
} from "@mui/icons-material";

const items = [
        {
        icon: <GroupAddRounded/>,
        title: 'Early Engagement',
        description:
            'Build relationships with students before they enter the workforce, fostering long-term loyalty.',
    },
    {
        icon: <SearchRounded/>,
        title: 'Targeted Talent Pool',
        description:
            'Access a network of future tech leaders eager to make their mark on the industry.',
    },
    {
        icon: <QueryStatsRounded/>,
        title: 'Effortless Promotion',
        description:
            'Showcase your company events directly to the most relevant student audience.',
    },
];

export default function CompaniesHighlights() {
    return (
        <Box
            id="highlights"
            sx={{
                pt: {xs: 4, sm: 12},
                pb: {xs: 8, sm: 10},
            }}
        >
            <Container
                sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: {xs: 3, sm: 6},
                }}
            >
                <Box
                    sx={{
                        width: {sm: '100%', md: '90%'},
                        textAlign: {sm: 'left', md: 'center'},
                    }}
                >
                    <Typography component="h2" variant="h4">
                        Fuel Your Innovation Pipeline with Tomorrow's Tech Titans!👩🏻‍💼
                    </Typography>
                    <Typography variant="body1" sx={{color: 'text.secondary'}}>
                        Thinking of hosting an event? 📆 <br/>

                        TUMSocial is your ideal platform! Promote your event directly to our engaged student community,
                        ensuring your message reaches the most promising future tech talent. Let's connect you with the minds that will shape tomorrow's technological landscape.
                    </Typography>
                </Box>
                <Grid container spacing={2.5}>
                    {items.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Stack
                                direction="column"
                                component={Card}
                                spacing={1}
                                useFlexGap
                                sx={{
                                    color: 'inherit',
                                    p: 3,
                                    height: '100%',
                                    border: '1px solid',
                                    borderColor: 'grey.300', // Updated border color for better visibility on white background
                                    background: 'transparent',
                                    backgroundColor: 'white', // Changed card background to white
                                    boxShadow: 'none',
                                }}
                            >
                                <Box sx={{opacity: '50%'}}>{item.icon}</Box>
                                <div>
                                    <Typography gutterBottom sx={{fontWeight: 'medium'}}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{color: 'grey.700'}}>
                                        {item.description}
                                    </Typography>
                                </div>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
