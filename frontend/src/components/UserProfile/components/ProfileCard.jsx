import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ImageUpload from "../../ImageUpload.jsx";
import axios from "axios";
import { getToken } from "../../../../utils/tokenService.jsx";
import { UserContext } from "../../../context/UserContext.jsx";
import { ErrorContext } from "../../../context/ErrorContext.jsx";
import {useNavigate} from "react-router-dom";

//eslint-disable-next-line react/prop-types
const ProfileCard = () => {
  const { user, updateUser } = useContext(UserContext);
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserLinkedIn, setNewUserLinkedIn] = useState("");
  const [newUserInstagram, setNewUserInstagram] = useState("");
  const [newUserCompanyPosition, setNewUserCompanyPosition] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const { setErrorMessage } = useContext(ErrorContext);

  const token = getToken();
  const [runOnce, setRunOnce] = useState(false);
    const navigate = useNavigate();
  useEffect(() => {
    if (user._id !== undefined && !runOnce) {
      setNewUserFirstName(user.firstName);
      setNewUserLastName(user.lastName);
      setRunOnce(true);
    }
  }, [user]);

  const handleEditButtonClick = () => {
    setIsEditable(true);
  };

  const handleSubscriptionButtonClick = () => {
    navigate( "/subscribe");
  };

  const handleSaveEditClick = async () => {
    setIsEditable(false);
    try {
      const newUser = await axios.put(
        "http://localhost:8080/api/users/update",
        {
          firstName: newUserFirstName,
          lastName: newUserLastName,
          email: newUserEmail,
          linkedIn: newUserLinkedIn,
          instagram: newUserInstagram,
          companyPosition: newUserCompanyPosition,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser(newUser);
    } catch (error) {
      console.log("Error occured while updating: ", error);
      if (error.response) {
        if (error.response.status === 401) {
          window.location.href = "/noAccess";
        }
      }
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }
  };

  const userName = `${user.firstName} ${user.lastName}`;
  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card style={{ padding: "20px" }}>
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ImageUpload initials={initials} isEditable={isEditable} />
        {isEditable ? (
          <Stack>
            <TextField
              label={"First Name"}
              variant="standard"
              value={newUserFirstName}
              onChange={(event) => setNewUserFirstName(event.target.value)}
            />
          </Stack>
        ) : (
          <Typography variant="h5" component="div">
            {user.firstName}
          </Typography>
        )}
        {isEditable ? (
          <Stack>
            <TextField
              label={"Last Name"}
              variant="standard"
              value={newUserLastName}
              onChange={(event) => setNewUserLastName(event.target.value)}
            />
          </Stack>
        ) : (
          <Typography variant="h5" component="div">
            {user.lastName}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" align={"center"}>
          {user.dateOfBirth}
        </Typography>
        {isEditable && user.companyPosition ? (
          <Stack>
            <TextField
              label={user.companyPosition || "Company Position"}
              variant="standard"
              onChange={(event) =>
                setNewUserCompanyPosition(event.target.value)
              }
            />
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" align={"center"}>
            {user.companyPosition}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" align={"center"}>
          {user.companyName}
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText>
              {isEditable ? (
                <Stack>
                  <TextField
                    label={user.email || "Email"}
                    variant="standard"
                    onChange={(event) => setNewUserEmail(event.target.value)}
                  />
                </Stack>
              ) : (
                <Link href={`mailto:${user.email}`}>{user.email}</Link>
              )}
            </ListItemText>
          </ListItem>
          {user.role === "student" && (
            <ListItem>
              <ListItemIcon>
                <LinkedInIcon />
              </ListItemIcon>
              <ListItemText>
                {isEditable ? (
                  <Stack>
                    <TextField
                      label={user.linkedIn || "LinkedIn"}
                      variant="standard"
                      onChange={(event) =>
                        setNewUserLinkedIn(event.target.value)
                      }
                    />
                  </Stack>
                ) : (
                  <Link href={`https://www.linkedin.com/in/${user.linkedIn}`}>
                    {user.linkedIn}
                  </Link>
                )}
              </ListItemText>
            </ListItem>
          )}
          {user.role === "student" && (
            <ListItem>
              <ListItemIcon>
                <InstagramIcon />
              </ListItemIcon>
              <ListItemText>
                {isEditable ? (
                  <Stack>
                    <TextField
                      label={user.instagram || "Instagram"}
                      variant="standard"
                      onChange={(event) =>
                        setNewUserInstagram(event.target.value)
                      }
                    />
                  </Stack>
                ) : (
                  <Link href={`https://instagram.com/${user.instagram}`}>
                    {user.instagram}
                  </Link>
                )}
              </ListItemText>
            </ListItem>
          )}
        </List>
      </CardContent>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        style={{ marginTop: "30px" }}
      >
        <Button
          variant="contained"
          onClick={isEditable ? handleSaveEditClick : handleEditButtonClick}
          style={{ marginBottom: "30px" }}
        >
          {isEditable ? "Save User Profile" : "Edit User Profile"}
        </Button>
        {user.role === "student" && (
          <Button variant="outlined" onClick={handleSubscriptionButtonClick}>
            My Subscription
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default ProfileCard;
