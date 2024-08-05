import {useContext, useEffect, useState} from "react";
import io from "socket.io-client";
import axios from "axios";
import {getToken} from "../../utils/tokenService.jsx";
import {Badge, Button, Menu, MenuItem} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Notifications} from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {jwtDecode} from "jwt-decode";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useNavigate} from "react-router-dom";
import {ErrorContext} from "../context/ErrorContext.jsx";
import PropTypes from "prop-types";

const SOCKET_SERVER_URL = 'http://localhost:8080';

DeleteOutlineIcon.propTypes = {fontSize: PropTypes.string};
const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const token = getToken();
    const {setErrorMessage} = useContext(ErrorContext);
    const navigate = useNavigate();


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (!token) {
            return;
        }
        const userId = jwtDecode(token).id;
        // Connect to Socket.IO server
        const socket = io(SOCKET_SERVER_URL);

        // Function to fetch all unread notifications
        const fetchNotifications = async () => {
            console.log('fetching all notifications');

            try {
                const res = await axios.get(
                    `${SOCKET_SERVER_URL}/api/notifications/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setNotifications(res.data);
                console.log(res.data);
            } catch (error) {
                console.error("Error fetching all notifications", error);
                const errorMessage = error?.response?.data?.message || "Unknown";
                setErrorMessage(errorMessage);
                window.location.href = "/error";
            }
        };

        fetchNotifications();

        // Listen for 'notification' events from the server
        socket.on("notification", (notification) => {
            // Add the new notification to the state, triggering a re-render
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                notification,
            ]);
        });

        return () => socket.disconnect();
    }, []);


    /*
        // Mark a notification as read
        const markAsRead = async (notificationId) => {
            try {
                await axios.patch(`${SOCKET_SERVER_URL}/api/notifications/read/${notificationId}`,{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setNotifications(notifications.map(notification =>
                    notification._id === notificationId ? { ...notification, read: true } : notification
                ));

            } catch (error) {
                console.error('Error marking notification as read', error);
            }

        };

     */

    //Lösche die Notification

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(
                `${SOCKET_SERVER_URL}/api/notifications/delete/${notificationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotifications(
                notifications.filter(
                    (notification) => notification._id !== notificationId
                )
            );
        } catch (error) {
            console.error("Error deleting notification", error);
            const errorMessage = error?.response?.data?.message || "Unknown";
            setErrorMessage(errorMessage);
            window.location.href = "/error";
        }
    };

  const deleteAllNotifications = async () => {
    try {
      if (!token) {
        return;
      }
      const userId = jwtDecode(token).id;
      await axios.delete(`${SOCKET_SERVER_URL}/api/notifications/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Clear notifications from state
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all notifications", error);
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }
  };

    const handleNotificationOnClick = (eventId) => {
        navigate(`/events/${eventId}?nav=2`)

    }

    return (
        <div>
            <Badge badgeContent={notifications.length} color="secondary">
                <Notifications onClick={handleClick} style={{cursor: 'pointer'}}/>
            </Badge>

            <Menu
                id="notification-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mt: '45px', '& .MuiPaper-root': { maxHeight: '400px', maxWidth: '400px' , overflowY: 'auto' } }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1976d2', color: 'white', padding: '8px' }}>
                    <Typography variant="h6">
                        Chat Notifications:
                    </Typography>
                    <Button
                        startIcon={<DeleteForeverIcon />}
                        onClick={deleteAllNotifications}
                        sx={{ color: 'white', ':hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}
                        variant="text"
                    >
                        Delete All
                    </Button>
                </Box>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <MenuItem
                            key={notification._id}
                            sx={{display: 'flex', justifyContent: 'space-between', backgroundColor: notification.read ? '#f0f0f0' : 'white'}}
                            onClick={() => handleNotificationOnClick(notification.eventId)}>
                            <Typography variant="body2" noWrap style={{ textDecoration: notification.read ? 'line-through' : 'none' }}>
                                {notification.message}
                            </Typography>
                            <Box sx={{display: 'flex', flexDirection: 'row', ml: 1, gap: '10px'}}>
                                {/*
                                <IconButton onClick={() => markAsRead(notification._id)} size="small" sx={{color: notification.read ? 'grey' : 'green'}} >
                                    <CheckCircleOutlineIcon fontSize="inherit"/>
                                </IconButton>
                                */}
                <IconButton
                  onClick={() => deleteNotification(notification._id)}
                  size="small"
                  sx={{ color: "red" }}
                >
                  <DeleteOutlineIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleClose}>No new notifications</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default NotificationComponent;