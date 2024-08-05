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
        icon: <SearchRounded/>,
        title: 'All events on one platform',
        description:
            'TUMSocial offers you all the events that could be relevant for you as an TUM student.',
    },
    {
        icon: <GroupAddRounded/>,
        title: 'Make new friends',
        description:
            'TUMSocial offers you the platform and the right events to make new TUM friends.',
    },
    {
        icon: <ThumbUpAltRounded/>,
        title: 'Great user experience',
        description:
            'TUMSocial offers you an intuitive platform for a great user experience.',
    },
    {
        icon: <LocalActivityRounded/>,
        title: 'Buy VIP Tickets',
        description:
            'TUMSocial offers you to buy the tickets online and not to stand in a queue just for buying tickets. Better spent your time on studying then waiting!',
    },
    {
        icon: <LocalBarRounded/>,
        title: 'Work Hard – Party Harder',
        description:
            'TUMSocial offers you not only the best platform to find your study group, we also help you to find the best parties and sport groups.',
    },
    {
        icon: <QueryStatsRounded/>,
        title: 'Get in touch with companies',
        description:
            'TUMSocial offers you the most interesting events to get in touch with companies and to grow your business network.',
    },
];

export default function Highlights() {
    return (
        <Box
            id="highlights"
            sx={{
                pt: { xs: 4, sm: 12 },
                pb: { xs: 8, sm: 16 },
                color: 'black', // Updated to ensure text is visible on white background
                bgcolor: 'white', // Changed to white background
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
                        width: {sm: '100%', md: '60%'},
                        textAlign: {sm: 'left', md: 'center'},
                    }}
                >
                    <Typography component="h2" variant="h4">
                        Get started! 🚀
                    </Typography>
                    <Typography variant="body1" sx={{color: 'text.secondary'}}>
                        Your benefits as a members of the TUMSocial community include:
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
                                    <Typography variant="body2" sx={{ color: 'grey.700' }}>
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
