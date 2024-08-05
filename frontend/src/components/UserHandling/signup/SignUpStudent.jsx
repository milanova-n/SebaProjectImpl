import {
  Button,
  TextField,
  Typography,
  CssBaseline,
  Link,
  Box,
  Alert,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../../Header.jsx";
import axios from "axios";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Footer from "../../Footer.jsx";

const SignUpStudent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsCheckboxChecked(event.target.checked);
  };

  const validateInputs = () => {
    if (!firstName || !/^[a-zA-ZäöüÄÖÜ]+$/.test(firstName)) {
      setError("Please enter a valid first name. Only letters are allowed.");
      return false;
    }
    if (!lastName || !/^[a-zA-ZäöüÄÖÜ]+$/.test(lastName)) {
      setError("Please enter a valid last name. Only letters are allowed.");
      return false;
    }
    if (!email || !/\S+@tum\.de$/.test(email)) {
      setError("Please enter a valid TUM email address ending with @tum.de.");
      return false;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (
      !uppercaseRegex.test(password) ||
      !lowercaseRegex.test(password) ||
      !numberRegex.test(password) ||
      !specialCharRegex.test(password)
    ) {
      setError("Please use a stronger password such as 'Abc123$#'");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return false;
    }
    return true;
  };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (!validateInputs()) {
            return;
        }

    const stripeCustomerId = await createStripeCustomer();
    try {
      const res = await axios.post("http://localhost:8080/api/users/create", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: "student",
        stripeCustomerId: stripeCustomerId,
      });
      if (res.data) {
        window.location.href = "/logIn";
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setError("An account with this email already exists");
        } else {
          setError("An error occurred during sign up. Please try again.");
        }
      } else {
        setError("Network error. Please try again.");
      }
    }
  };
  const createStripeCustomer = async () => {
    // StripeCustomer Creation
    try {
      // Create Stripe customer
      const stripeResponse = await fetch("/api/subscriptions/create-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: `${firstName} ${lastName}`,
        }),
      });

      if (!stripeResponse.ok) {
        throw new Error(`HTTP error! status: ${stripeResponse.status}`);
      }

      const stripeData = await stripeResponse.json();
      //setStripeCustomerId(stripeData.id);
      console.log("Stripe customer created successfully:", stripeData);
      console.log("Stripe customer ID:", stripeData.id);
      return stripeData.id;
    } catch (error) {
      console.error("Signup error with creating a stripe customer:", error); // Log the error for debugging
      if (error.response) {
        setError(
          "An error occurred during sign up with creating a stripe customer. Please try again."
        );
      } else {
        setError(
          "Network error with creating a stripe customer. Please try again."
        );
      }
    }
  };

  const defaultTheme = createTheme({ palette: "light" });

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header />
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
            width: "100vdh",
            marginLeft: "auto",
            marginRight: 15,
            marginBottom: -10,
            p: 3,
          }}
        >
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: "34px",
              fontWeight: "bold",
              marginBottom: 1,
              textAlign: "left",
            }}
          >
            SignUp as TUM Student 🚀
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="firstName" sx={{ color: "#FFFFFF" }}>
                    First name *
                  </FormLabel>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    placeholder="Jon"
                    InputProps={{ style: { color: "#FFFFFF" } }}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={!!error && error.includes("first name")}
                    color={
                      error && error.includes("first name")
                        ? "error"
                        : "primary"
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="lastName" sx={{ color: "#FFFFFF" }}>
                    Last name *
                  </FormLabel>
                  <TextField
                    autoComplete="family-name"
                    name="lastName"
                    required
                    fullWidth
                    id="lastName"
                    placeholder="Snow"
                    InputProps={{ style: { color: "#FFFFFF" } }}
                    onChange={(e) => setLastName(e.target.value)}
                    error={!!error && error.includes("last name")}
                    color={
                      error && error.includes("last name") ? "error" : "primary"
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
            <FormControl>
              <FormLabel htmlFor="email" sx={{ color: "#FFFFFF" }}>
                Email *
              </FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@tum.de"
                name="email"
                autoComplete="email"
                variant="outlined"
                InputProps={{ style: { color: "#FFFFFF" } }}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error && error.includes("email")}
                //helperText={!!error && error.includes("email") ? error : ""}
                color={error && error.includes("email") ? "error" : "primary"}
              />
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="password" sx={{ color: "#FFFFFF" }}>
                    Password *
                  </FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    variant="outlined"
                    InputProps={{ style: { color: "#FFFFFF" } }}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!error && error.includes("Password must")}
                    color={
                      error && error.includes("Password must")
                        ? "error"
                        : "primary"
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel
                    htmlFor="confirmPassword"
                    sx={{ color: "#FFFFFF" }}
                  >
                    Confirm Password *
                  </FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    placeholder="••••••"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    variant="outlined"
                    InputProps={{ style: { color: "#FFFFFF" } }}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!error && error.includes("Passwords must")}
                    color={
                      error && error.includes("Passwords must")
                        ? "error"
                        : "primary"
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
            {error && <Alert severity="error">{error}</Alert>}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCheckboxChecked}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
              }
              label={
                <Typography sx={{ color: "#FFFFFF" }}>
                  I have read the data protection policy & the general terms.
                </Typography>
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isCheckboxChecked}
            >
              Sign up
            </Button>

                  <Link
                        href="/request-reset-password"
                        variant="body2"
                        sx={{alignSelf: "center", color: "#FFFFFF"}}
                    >
                        Forget your password?
                    </Link>
            <Link
              href="/login"
              variant="body2"
              sx={{ alignSelf: "center", color: "#FFFFFF" }}
            >
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Footer />
    </ThemeProvider>
  );
};

export default SignUpStudent;
