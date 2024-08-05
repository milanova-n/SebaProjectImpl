import {
    Button, TextField, Typography, CssBaseline, Link, Box, Alert} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import axios from "axios";
import {useState} from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import Footer from "../../Footer.jsx";
import Header from "../../Header.jsx";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const RequestResetPassword = () => {
    const [email, setEmail] = useState("");
    const [formIsVisible, setFormIsVisible] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState(""); // Add this state variable to store success message



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        console.log("email: ", email);
        try {
            const response = await axios.post('/api/users/request-reset-password', {email});
            setMessage(response.data); // Set success message
            setFormIsVisible(false); // Hide the form

        } catch (error) {
            setError(error.response?.data || "An error occurred");
        }
    };

    const handleNavigateToStart = () => {
        window.location.href = `/`;
    };

    const defaultTheme = createTheme({palette: "light"});

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline/>
            <Header/>
            <Box
                id="hero"
                sx={{
                    width: "100%",
                    minHeight: '100vh',
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
                        width: "100vdh",
                        marginLeft: "auto",
                        marginRight: 15,
                        marginBottom: -10,
                        p: 3,
                    }}
                >
                    {formIsVisible ? (
                        <>
                            <Typography
                                sx={{
                                    color: "#FFFFFF",
                                    fontSize: "34px",
                                    fontWeight: "bold",
                                    marginBottom: 1,
                                    textAlign: "left",
                                }}
                            >
                                Reset your password 🚀
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{display: "flex", flexDirection: "column", gap: 1}}
                            >
                                <FormControl>
                                    <FormLabel htmlFor="email" sx={{color: "#FFFFFF"}}>
                                        Email *
                                    </FormLabel>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        placeholder="your@tum.de or your@company.de"
                                        name="email"
                                        autoComplete="email"
                                        variant="outlined"
                                        InputProps={{style: {color: "#FFFFFF"}}}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={!!error && error.includes("email")}
                                        color={error && error.includes("email") ? "error" : "primary"}
                                    />
                                </FormControl>
                                {error && <Alert severity="error">{error}</Alert>}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={!email}
                                >
                                    Reset password
                                </Button>
                                <Link
                                    href="/LogIn"
                                    variant="body2"
                                    sx={{alignSelf: "center", color: "#FFFFFF"}}
                                >
                                    Remember your password? Sign in instead.
                                </Link>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2}}>
                            <CheckCircleOutlineIcon sx={{color: '#6AF170', fontSize: 150}}/>
                            <Typography variant="h6" sx={{color: '#FFFFFF', marginTop: 1}}>
                                {message}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleNavigateToStart}
                                sx={{bgcolor: '#1C75BC', color: '#FFFFFF', marginTop: 2}}
                            >
                                Go to Start Page
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
            <Divider/>
            <Footer/>
        </ThemeProvider>
    );
};

export default RequestResetPassword;

/*
 const roleOptions = [
        {
            label: 'Student',
        }, {
            label: 'Company',
        }, {
            label: 'Admin',
        },];

    const [selectedRoleIndex, setSelectedRoleIndex] = useState(''); // Initialize as empty string
        const role = roleOptions[selectedRoleIndex]?.label;

        <FormControl fullWidth variant="outlined" sx={{mb: 2}}>
                                    <InputLabel sx={{color: '#FFFFFF'}}>Choose your role</InputLabel>
                                    <Select
                                        sx={{
                                            color: '#FFFFFF', '.MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#FFFFFF',
                                            }, '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#FFFFFF',
                                            }, '.MuiSvgIcon-root': {
                                                color: '#FFFFFF',
                                            },
                                        }}
                                        value={selectedRoleIndex}
                                        onChange={(e) => setSelectedRoleIndex(e.target.value)}
                                        label="Choose your role"
                                        displayEmpty
                                    >
                                        {roleOptions.map((option, index) => (
                                            <MenuItem key={option.label} value={index}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                || selectedRoleIndex === ''

 */