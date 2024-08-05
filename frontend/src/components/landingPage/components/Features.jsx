import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import {Chip as MuiChip} from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {styled} from '@mui/material/styles';

import {RuleRounded, SchoolRounded, SearchRounded} from "@mui/icons-material";

const items = [
    {
        icon: <SearchRounded/>,
        title: 'Ditch the endless searching',
        description:
            'We curate the ultimate calendar of all things TUM, from unforgettable parties to study groups for next semester.',
        imageLight: 'url("https://unity.bayern/dist/img/party-3000.webp")',
    },
    {
        icon: <RuleRounded/>,
        title: 'No more missing out',
        description:
            'Get the inside scoop on all the exclusive events and secret WhatsApp groups that make TUM life legendary.',
        imageLight: 'url("https://unity.bayern/dist/img/kugel-3000.webp")',
    },
    {
        icon: <SchoolRounded/>,
        title: 'TUM Social',
        description:
            'Where connections are made, memories are built, and the fear of missing out is a distant memory.',
        imageLight: 'url("https://images.unsplash.com/photo-1588696191779-61dde1b83475?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZyaWVuZHNoaXB8ZW58MHx8MHx8fDA%3D")',
    },
];

const Chip = styled(MuiChip)(({theme}) => ({
    variants: [
        {
            props: ({selected}) => selected,
            style: {
                background:
                    'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
                color: 'hsl(0, 0%, 100%)',
                borderColor: theme.palette.primary.light,
                '& .MuiChip-label': {
                    color: 'hsl(0, 0%, 100%)',
                },

            },
        },
    ],
}));

export default function Features() {
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

    const handleItemClick = (index) => {
        setSelectedItemIndex(index);
    };

    const selectedFeature = items[selectedItemIndex];

    return (
        <Container id="features" sx={{py: {xs: 8, sm: 16}}}>
            <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                    <div>
                        <Typography component="h2" variant="h4" sx={{color: 'text.primary'}}>
                            You know the feeling of not being part of the TUM community?
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{color: 'text.secondary', mb: {xs: 2, sm: 4}}}
                        >
                            Tired of scrambling to find the hottest events and coolest connections?
                        </Typography>
                    </div>
                    <Grid container item sx={{gap: 1, display: {xs: 'auto', sm: 'none'}}}>
                        {items.map(({title}, index) => (
                            <Chip
                                key={index}
                                label={title}
                                onClick={() => handleItemClick(index)}
                                selected={selectedItemIndex === index}
                            />
                        ))}
                    </Grid>
                    <Card
                        variant="outlined"
                        sx={{display: {xs: 'auto', sm: 'none'}, mt: 4}}
                    >
                        <Box
                            sx={(theme) => ({
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: 280,
                                    backgroundImage: 'var(--items-imageLight)'
                                }
                            )}
                            style={{
                                '--items-imageLight': items[selectedItemIndex].imageLight
                            }}
                        />
                        <Box sx={{px: 2, pb: 2}}>
                            <Typography
                                gutterBottom
                                sx={{color: 'text.primary', fontWeight: 'medium'}}
                            >
                                {selectedFeature.title}
                            </Typography>
                            <Typography variant="body2" sx={{color: 'text.secondary', mb: 1.5}}>
                                {selectedFeature.description}
                            </Typography>

                        </Box>
                    </Card>
                    <Stack
                        direction="column"
                        spacing={2}
                        useFlexGap
                        sx={{
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            width: '100%',
                            display: {xs: 'none', sm: 'flex'},
                        }}
                    >
                        {items.map(({icon, title, description}, index) => (
                            <Card
                                key={index}
                                component={Button}
                                onClick={() => handleItemClick(index)}
                                sx={[
                                    (theme) => ({
                                        p: 3,
                                        height: 'fit-content',
                                        width: '100%',
                                        background: 'none',
                                        '&:hover': {
                                            background:
                                                'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)',
                                            borderColor: 'primary.light',
                                            boxShadow: '0px 2px 8px hsla(0, 0%, 0%, 0.1)',

                                        },
                                    }),
                                    selectedItemIndex === index &&
                                    ((theme) => ({
                                        backgroundColor: 'action.selected',
                                        borderColor: 'primary.light',
                                    })),
                                ]}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        textAlign: 'left',
                                        flexDirection: {xs: 'column', md: 'row'},
                                        alignItems: {md: 'center'},
                                        gap: 2.5,
                                    }}
                                >
                                    <Box
                                        sx={[
                                            (theme) => ({
                                                color: 'grey.400',

                                            }),
                                            selectedItemIndex === index && {
                                                color: 'primary.main',
                                            },
                                        ]}
                                    >
                                        {icon}
                                    </Box>
                                    <div>
                                        <Typography
                                            gutterBottom
                                            sx={{color: 'text.primary', fontWeight: 'medium'}}
                                        >
                                            {title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{color: 'text.secondary', mb: 1.5}}
                                        >
                                            {description}
                                        </Typography>
                                    </div>
                                </Box>
                            </Card>
                        ))}
                    </Stack>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{display: {xs: 'none', sm: 'flex'}, width: '100%'}}
                >
                    <Card
                        variant="outlined"
                        sx={{
                            height: '100%',
                            width: '100%',
                            display: {xs: 'none', sm: 'flex'},
                            pointerEvents: 'none',
                        }}
                    >
                        <Box
                            sx={(theme) => ({
                                m: 'auto',
                                width: 420,
                                height: 500,
                                backgroundSize: 'contain',
                                backgroundImage: 'var(--items-imageLight)',
                            })}
                            style={{
                                '--items-imageLight': items[selectedItemIndex].imageLight,
                            }}
                        />
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
