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

export default function CompaniesFeatures() {

    return (
        <Container id="features" sx={{py: {xs: 8, sm: 16}}}>
            <div>
                <Typography component="h2" variant="h4" sx={{color: 'text.primary'}}>
                    Fuel Your Innovation Pipeline with Tomorrow's Tech Titans!👩🏻‍💼
                </Typography>
                <Typography
                    variant="body1"
                    sx={{color: 'text.secondary', mb: {xs: 2, sm: 4}}}
                >
                    Thinking of hosting an event? 📆

                    TUMSocial is your ideal platform! Promote your event directly to our engaged student community, ensuring your message reaches the most promising future tech talent.

                    Let's connect you with the minds that will shape tomorrow's technological landscape.
                </Typography>
            </div>


        </Container>
    );
}
