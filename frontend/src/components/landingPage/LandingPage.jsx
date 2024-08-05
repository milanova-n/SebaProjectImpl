import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Header from '../Header.jsx';
import Hero from './components/Hero.jsx';
import Highlights from './components/Highlights.jsx';
import Features from './components/Features.jsx';
import Testimonials from './components/Testimonials.jsx';
import Footer from '../Footer.jsx';
import {CssBaseline} from "@mui/material";
import RegisterButton from "../registerButton.jsx";

export default function LandingPage() {
    const defaultTheme = createTheme({palette: 'light'});
    return (<ThemeProvider theme={defaultTheme}>
        <CssBaseline/>
        <Header/>
        <Box sx={{bgcolor: 'background.default'}}>
            <Hero/>
            <Features/>
            <Divider/>
            <Testimonials/>
            <Divider/>
            <Highlights/>
            <Divider/>
            <Footer/>
        </Box>
        <RegisterButton/>
    </ThemeProvider>);
}
