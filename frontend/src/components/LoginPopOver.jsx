import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
  Divider,
  Box,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PropTypes from "prop-types";

const LoginPopOver = ({ anchorEl, setAnchorEl, userId, showNotifications }) => {
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    const event = new Event("tokenChanged");
    window.dispatchEvent(event); // make the event available for any event listeners
    window.location.href = "/";
  };

  const handleMyProfile = () => {
    if (userId) {
      window.location.href = `/profile/${userId}`;
    } else {
      window.location.href = "/LogIn";
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Popover
      onClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6">User Menu</Typography>
        <IconButton edge="end" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleMyProfile}>
            {showNotifications ? (
              <Badge
                color="secondary"
                overlap="circular"
                variant="dot"
                sx={{ mr: 2 }}
              >
                <AccountCircleIcon />
              </Badge>
            ) : (
              <AccountCircleIcon sx={{ mr: 2 }} />
            )}

            <ListItemText primary="My Account" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ExitToAppIcon sx={{ mr: 2 }} />
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Popover>
  );
};

LoginPopOver.propTypes = {
  anchorEl: PropTypes.object,
  setAnchorEl: PropTypes.func,
  userId: PropTypes.string,
};

export default LoginPopOver;
