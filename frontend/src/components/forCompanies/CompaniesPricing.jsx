import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Link from "@mui/material/Link";
import {useNavigate} from "react-router-dom";

const tiers = [
    {
        title: 'Up to 50 participants',
        price: '30',
        description: [
            'No subscription needed! Pay as you go!',
            "Targeted Talent Pool",
            "Effortless Promotion",
        ],
    },
    {
        title: 'Up to 100 participants',
        //subheader: 'Most events',
        price: '50',
        description: [
            'No subscription needed! Pay as you go!',
            "Targeted Talent Pool",
            "Effortless Promotion",
        ],
    },
    {
        title: 'Unlimited participants',
        price: '100',
        description: [
            'No subscription needed! Pay as you go!',
            "Targeted Talent Pool",
            "Effortless Promotion",
        ],
    },
];

export default function CompaniesPricing() {
        const navigate = useNavigate();


    return (
        <Container
            id="pricing"
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
                    Pricing
                </Typography>
                <Typography variant="body1" sx={{color: 'text.secondary'}}>
                    The price depends on the number of participants and can be is calculated for each event individuelly
                    after the submission of an event with the following pricing:
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
                        sm={tier.title === 'Up to 100 participants' ? 12 : 6}
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
                                tier.title === 'Up to 100 participants' &&
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
                                        tier.title === 'Up to 100 participants'
                                            ? {color: 'grey.100'}
                                            : {color: ''},
                                    ]}
                                >
                                    <Typography component="h3" variant="h6">
                                        {tier.title}
                                    </Typography>
                                    {tier.title === 'Up to 100 participants' && (
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
                                        tier.title === 'Up to 100 participants'
                                            ? {color: 'grey.50'}
                                            : {color: null},
                                    ]}
                                >
                                    <Typography component="h3" variant="h2">
                                        €{tier.price}
                                    </Typography>
                                    <Typography component="h3" variant="h6" fontSize={16}>
                                        &nbsp; per event submission
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
                                                tier.title === 'Up to 100 participants'
                                                    ? {color: 'primary.light'}
                                                    : {color: 'primary.main'},
                                            ]}
                                        />
                                        <Typography
                                            variant="subtitle2"
                                            component={'span'}
                                            sx={[
                                                tier.title === 'Up to 100 participants'
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
            <Button variant="outlined" sx={{
                width: 180,
                bgcolor: '#1C75BC',
                color: '#FFFFFF',
                '&:hover': {
                    bgcolor: '#FFFFFF', // Light blue background on hover
                    color: '#1C75BC',   // White text on hover
                }
            }}
            onClick={() => navigate("/submitEvent")}
            >
                Submit Event
            </Button>
        </Container>
    );
}
