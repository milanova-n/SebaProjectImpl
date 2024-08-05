import {
    Button, TextField, Typography, CssBaseline, Link, Box, Alert, Grid,
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import axios from "axios";
import {useState} from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Divider from "@mui/material/Divider";
import Footer from "../../Footer.jsx";
import Header from "../../Header.jsx";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline.js";
import {useParams} from "react-router-dom";

const RequestResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [formIsVisible, setFormIsVisible] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState(""); // Add this state variable to store success message

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (confirmPassword && e.target.value !== confirmPassword) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (password && e.target.value !== password) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post(`/api/users/reset-password/${token}`, { newPassword: password });
            setMessage(response.data); // Set success message
            setFormIsVisible(false); // Hide the form

        } catch (error) {
            setError(error.response?.data || "An error occurred");
        }
    };

    const handleNavigateToStart = () => {
        window.location.href = `/login`;
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
                                    color: "#FFFFFF", fontSize: "34px", fontWeight: "bold", marginBottom: 1, textAlign: "left",
                                }}
                            >
                                Reset your password 🚀
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{display: "flex", flexDirection: "column", gap: 1}}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <FormLabel htmlFor="password" sx={{ color: '#FFFFFF' }}>Password *</FormLabel>
                                            <TextField
                                                required
                                                fullWidth
                                                name="password"
                                                placeholder="••••••"
                                                type="password"
                                                id="password"
                                                autoComplete="new-password"
                                                variant="outlined"
                                                InputProps={{ style: { color: '#FFFFFF' } }}
                                                onChange={handlePasswordChange}
                                                error={passwordError}
                                                color={passwordError ? 'error' : 'primary'}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <FormLabel htmlFor="confirmPassword" sx={{ color: '#FFFFFF' }}>Confirm Password *</FormLabel>
                                            <TextField
                                                required
                                                fullWidth
                                                name="confirmPassword"
                                                placeholder="••••••"
                                                type="password"
                                                id="confirmPassword"
                                                autoComplete="new-password"
                                                variant="outlined"
                                                InputProps={{ style: { color: '#FFFFFF' } }}
                                                onChange={handleConfirmPasswordChange}
                                                error={passwordError}
                                                color={passwordError ? 'error' : 'primary'}
                                                onBlur={handleConfirmPasswordChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                {error && <Alert severity="error">{error}</Alert>}
                                {passwordError && <Alert severity="error">Passwords must match.</Alert>}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={!password || !confirmPassword || passwordError}
                                >
                                    Reset password
                                </Button>
                                <Link
                                    href="/login"
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
                                Go to SignIn Page
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
