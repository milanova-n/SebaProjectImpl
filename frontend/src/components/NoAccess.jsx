import {
    Button, Typography, CssBaseline, Box, Divider,
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import {ErrorOutline} from "@mui/icons-material";


const NoAccessPage = () => {
    //const [error, setError] = useState("");
    const defaultTheme = createTheme({palette: "light"});
    const navigate = useNavigate();
    const message = "Sorry, you do not have access to perform this action.";

    const handleNavigateToStart = () => {
        navigate("/"); // Adjust the path to your start page
    };

    return (<ThemeProvider theme={defaultTheme}>
        <CssBaseline/>
        <Header/>
        <Box
            id="hero"
            sx={{
                width: "100%",
                minHeight: "100vh",
                backgroundImage: `url('https://www.ub.tum.de/files/tum_uhrenturm_1482543.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
            }}
        >
            <Box
                className="info-box"
                sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(10px)",
                    border: "4px solid #FFFFFF",
                    borderRadius: "10px",
                    height: "auto",
                    width: 500,
                    marginLeft: "auto",
                    marginRight: 15,
                    marginBottom: -10,
                    p: 3,
                    textAlign: "center"
                }}
            >
                <Typography
                    sx={{
                        color: "#FFFFFF", fontSize: "34px", fontWeight: "bold", marginBottom: 2,
                    }}
                >
                    Permission denied!
                </Typography>
                <ErrorOutline sx={{color: "red", fontSize: 150}}/>
                <Typography variant="h6" sx={{color: "#FFFFFF", marginTop: 1}}>
                    {message}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleNavigateToStart}
                    sx={{bgcolor: "#1C75BC", color: "#FFFFFF", marginTop: 2}}
                >
                    Go to Start Page
                </Button>

            </Box>
        </Box>
        <Divider/>
        <Footer/>
    </ThemeProvider>);
};

export default NoAccessPage;
