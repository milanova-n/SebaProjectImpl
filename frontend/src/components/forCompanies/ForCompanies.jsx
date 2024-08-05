import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";
import RegisterButton from "../registerButton.jsx";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import CompaniesPricing from "./CompaniesPricing.jsx";
import CompaniesHero from "./CompaniesHero.jsx";
import CompaniesHighlights from "./CompaniesHighlights.jsx";
import CompaniesTestimonials from "./CompaniesTestimonials.jsx";

export default function ForCompanies() {
    const defaultTheme = createTheme({palette: 'light'});
    return (<ThemeProvider theme={defaultTheme}>
        <CssBaseline/>
        <Header/>
        <Box sx={{bgcolor: 'background.default'}}>
            <CompaniesHero/>
            <Divider/>
            <CompaniesHighlights/>
            <Divider/>
            <CompaniesPricing/>
            <Divider/>
            <CompaniesTestimonials/>
            <Divider/>
            <Footer/>
        </Box>
        <RegisterButton/>
    </ThemeProvider>);
}
