import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";

const tiers = [
    {
        title: 'Monthly Plan',
        price: '3.00',
        description: [
            'Pay every month 3.00€',
            'All events at TUMSocial',
            'Never wait in a queue for buying a ticket',
        ],
    },
    {
        title: 'Semester Plan',
        subheader: 'Most students',
        price: '2.00',
        description: [
            'Pay every semester 12.00€',
            'All events at TUMSocial',
            'Never wait in a queue for buying a ticket',
        ],
    },
    {
        title: 'Year Plan',
        price: '1.50',
        description: [
            'Pay every year 18.00€',
            'All events at TUMSocial',
            'Never wait in a queue for buying a ticket',
        ],
    },
];

const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 0;
    if (sectionElement) {
        const targetScroll = sectionElement.offsetTop - offset;
        sectionElement.scrollIntoView({behavior: 'smooth'});
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth',
        });
    }
};

export default function SubscriptionPricing() {
    return (
        <Container
            id="pricing"
            sx={{
                pt: {xs: 0, sm: 22},
                pb: {xs: 8, sm: 10},
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: {xs: 3, sm: 10},
            }}
        >
            <Box
                sx={{
                    width: {sm: '100%', md: '60%'},
                    textAlign: {sm: 'left', md: 'center'},
                }}
            >
                <Typography component="h2" variant="h4" sx={{color: 'text.primary'}}>
                    Get your Subscription! 🚀
                </Typography>
                <Typography variant="body1" sx={{color: 'text.secondary'}}>
                    TUMSocial offers companies the following pricing options.
                </Typography>
            </Box>

            <Grid
                container
                spacing={3}
                sx={{alignItems: 'center', justifyContent: 'center'}}
            >
                {tiers.map((tier) => (
                    <Grid
                        item
                        key={tier.title}
                        xs={12}
                        sm={tier.title === 'Semester Plan' ? 12 : 6}
                        md={4}
                    >
                        <Card
                            sx={[
                                {
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4,
                                },
                                tier.title === 'Semester Plan' &&
                                ((theme) => ({
                                    border: 'none',
                                    background:
                                        'radial-gradient(circle at 50% 0%, hsl(210, 98%, 35%), hsl(210, 100%, 16%))',
                                    boxShadow: `0 8px 12px hsla(210, 98%, 42%, 0.2)`,
                                    ...theme.applyStyles('dark', {
                                        boxShadow: `0 8px 12px hsla(0, 0%, 0%, 0.8)`,
                                    }),
                                })),
                            ]}
                        >
                            <CardContent>
                                <Box
                                    sx={[
                                        {
                                            mb: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: 2,
                                        },
                                        tier.title === 'Semester Plan'
                                            ? {color: 'grey.100'}
                                            : {color: ''},
                                    ]}
                                >
                                    <Typography component="h3" variant="h6">
                                        {tier.title}
                                    </Typography>
                                    {tier.title === 'Semester Plan' && (
                                        <Chip
                                            icon={<AutoAwesomeIcon/>}
                                            label={tier.subheader}
                                            size="small"
                                            sx={{
                                                borderColor: 'hsla(220, 60%, 99%, 0.3)',
                                                backgroundColor: 'hsla(220, 60%, 99%, 0.1)',
                                                '& .MuiChip-label': {
                                                    color: 'hsl(0, 0%, 100%)',
                                                },
                                                '& .MuiChip-icon': {
                                                    color: 'primary.light',
                                                },
                                            }}
                                        />
                                    )}
                                </Box>
                                <Box
                                    sx={[
                                        {
                                            display: 'flex',
                                            alignItems: 'baseline',
                                        },
                                        tier.title === 'Semester Plan'
                                            ? {color: 'grey.50'}
                                            : {color: null},
                                    ]}
                                >
                                    <Typography component="h3" variant="h2">
                                        €{tier.price}
                                    </Typography>
                                    <Typography component="h3" variant="h6">
                                        &nbsp; per month
                                    </Typography>
                                </Box>
                                <Divider sx={{my: 2, opacity: 0.8, borderColor: 'divider'}}/>
                                {tier.description.map((line) => (
                                    <Box
                                        key={line}
                                        sx={{py: 1, display: 'flex', gap: 1.5, alignItems: 'center'}}
                                    >
                                        <CheckCircleRoundedIcon
                                            sx={[
                                                {
                                                    width: 20,
                                                },
                                                tier.title === 'Semester Plan'
                                                    ? {color: 'primary.light'}
                                                    : {color: 'primary.main'},
                                            ]}
                                        />
                                        <Typography
                                            variant="subtitle2"
                                            component={'span'}
                                            sx={[
                                                tier.title === 'Semester Plan'
                                                    ? {color: 'grey.50'}
                                                    : {color: null},
                                            ]}
                                        >
                                            {line}
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Button
                variant="contained"
                onClick={() => scrollToSection('get-subscription')}
                sx={{ bgcolor: '#1C75BC', color: '#FFFFFF' }}
            >
                Subscribe Now
            </Button>
        </Container>
    );
}
