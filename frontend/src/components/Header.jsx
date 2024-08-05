import {
    AppBar,
    Toolbar,
    Button,
    Avatar,
    Box,
    Container,
    MenuItem, Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
//import { jwtDecode } from "jwt-decode";
//import axios from "axios";
import { useContext, useState } from "react";
//import {getToken} from "../../../../utils/tokenService.jsx";
import useAuth from "../../utils/useAuth.jsx";
import LoginPopOver from "./LoginPopOver.jsx";
import { UserContext } from "../context/UserContext.jsx";
import LogoLink_medium from "./LogoLink/LogoLink_medium.jsx";
import NotificationComponent from "./NotificationComponent.jsx";
import {Notifications} from "@mui/icons-material";

function Header() {
  const isAuthenticated = useAuth();
  //const token = getToken();
  //const decodedToken = token ? jwtDecode(token) : null;
  //const userId = decodedToken?.id;
  //const [user, setUser] = useState([]);
  //const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useContext(UserContext);
  // const [showNotification, setShowNotification] = useState(
  //   user?.notifyAboutEvent
  // );

  /*
        async function loadUser() {
            try {
                const res = userId
                    ? await axios.get(`http://localhost:8080/api/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    : null;
                if (!res || !res.data) {
                    console.log("Result is empty");
                } else {
                    setUser(res.data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        useEffect(() => {
            loadUser();
        }, [isAuthenticated]);

     */

  // useEffect(() => {
  //   if (user?.notifyAboutEvent) {
  //     setShowNotification(true);
  //     // Show the notification for 5 seconds
  //     const timeout = setTimeout(() => {
  //       setShowNotification(false);
  //     }, 60000); // 5 seconds in milliseconds

  //     return () => clearTimeout(timeout);
  //   }
  // }, [user?.notifyAboutEvent]);

  const handleClickOpen = (event) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
    } else {
      window.location.href = "/LogIn";
    }
  };

  const initials = user?.firstName?.[0] + user?.lastName?.[0] || null;

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderRadius: "999px",
            backdropFilter: "blur(24px)",
            maxHeight: 40,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "rgb(29,117,188)", // Updated color with transparency
            boxShadow:
              "0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)",
            ...theme.applyStyles("dark", {
              bgcolor: "hsla(220, 0%, 0%, 0.7)",
              boxShadow:
                "0 1px 2px hsla(210, 0%, 0%, 0.5), 0 2px 12px hsla(210, 100%, 25%, 0.3)",
            }),
          })}
        >
          <Stack
              direction={"row"}
              spacing={1}
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
                    <LogoLink_medium height={"35px"}/>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <MenuItem component={Link} to="/events">
                All Events
              </MenuItem>
              <MenuItem component={Link} to="/submitEvent">
                Submit Event
              </MenuItem>
              <MenuItem component={Link} to="/forCompanies">
                For Companies
              </MenuItem>
              <MenuItem component={Link} to="/FAQ">
                FAQ
              </MenuItem>
              {user?.role === "admin" && (
                <MenuItem component={Link} to="/admin">
                  Admin View
                </MenuItem>
              )}
            </Box>
          </Stack>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              alignItems: "center",
            }}
          >
            {isAuthenticated && (
              <MenuItem>
                  <NotificationComponent />
              </MenuItem>
            )}
            {/* Login button */}
            <Button color="inherit" onClick={handleClickOpen}>
              {!isAuthenticated ? (
                "Login "
              ) : user?.profilePicture ? (
                <Avatar src={user.profilePicture} />
              ) : (
                <Avatar> {initials} </Avatar>
              )}
            </Button>
            <LoginPopOver
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              userId={user?._id}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
