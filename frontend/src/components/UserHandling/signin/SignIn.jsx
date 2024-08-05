import * as React from "react";
import {
    Button, TextField, Typography, CssBaseline, Link, Box, Grid, Alert, FormControl, FormLabel, Divider,
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Header from "../../Header.jsx";
import axios from "axios";
import {useState} from "react";
import Footer from "../../Footer.jsx";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (email, password) => {
        if (!email) {
            setError("Please enter e-mail address");
        } else if (!password) {
            setError("Please enter password");
        } else {
            try {
                const res = await axios.post("http://localhost:8080/api/users/login", {
                    email, password,
                });
                if (res.data) {
                    localStorage.setItem("token", res.data.token);
                    window.location.href = "/events";
                }
            } catch (error) {
                console.error("Login error:", error); // Log the error for debugging
                if (error.response) {
                    if (error.response.status === 401) {
                        const errorMessage = error.response.data.message.toLowerCase();
                        if (errorMessage.includes("valid authentication credentials are not provided")) {
                            setError("No user account under this mail");
                        } else if (errorMessage.includes("unauthorized")) {
                            setError("Password incorrect");
                        } else {
                            setError("An unexpected error occurred. Please try again.");
                        }
                    } else {
                        setError("An unexpected error occurred. Please try again.");
                    }
                } else {
                    setError("Network error. Please try again.");
                }
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        handleLogin(email, password);
    };

    const defaultTheme = createTheme({palette: "light"});

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
                }}
            >
                <Typography
                    sx={{
                        color: "#FFFFFF", fontSize: "34px", fontWeight: "bold", marginBottom: 2, textAlign: "left",
                    }}
                >
                    TUMSocial Login 🚀
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{display: 'flex', flexDirection: 'column', gap: 1}}
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
                            //helperText={!!error && error.includes("email") ? error : ""}
                            color={error && error.includes("email") ? "error" : "primary"}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <FormLabel htmlFor="password" sx={{color: '#FFFFFF'}}>Password *</FormLabel>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            variant="outlined"
                            InputProps={{style: {color: '#FFFFFF'}}}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!error && error.includes("Password must")}
                            color={error && error.includes("Password must") ? 'error' : 'primary'}
                        />
                    </FormControl>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 1, mb: 1, bgcolor: "#1C75BC"}}
                    >
                        Sign In
                    </Button>
                    <Link
                        href="/request-reset-password"
                        variant="body2"
                        sx={{alignSelf: "center", color: "#FFFFFF"}}
                    >
                        Forget your password?
                    </Link>
                    <Link href="/register" variant="body2" sx={{
                        color: "#FFFFFF", display: 'flex',
                        justifyContent: 'center'
                    }}>
                        Do not have an account? Sign Up as Student!
                    </Link>
                </Box>
            </Box>
        </Box>
        <Divider/>
        <Footer/>
    </ThemeProvider>);
};

export default SignIn;
