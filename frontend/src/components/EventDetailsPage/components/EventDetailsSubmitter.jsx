import PropTypes from "prop-types";
import {Avatar, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {getToken} from "../../../../utils/tokenService";
import PersonIcon from '@mui/icons-material/Person';
import { ErrorContext } from "../../../context/ErrorContext";
import { useContext } from "react";

const EventDetailsSubmitter = ({ submitterName, userId }) => {
  const [user, setUser] = useState();
  const token = getToken();
  const { setErrorMessage } = useContext(ErrorContext);

  async function loadUser() {
    try {
      if (userId) {
        const res = await axios.get(
          `http://localhost:8080/api/users/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res?.data) {
          console.log("Result is empty");
        } else {
          setUser(res.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response) {
        if (error.response.status === 401) {
          window.location.href = "/noAccess";
        }
      }
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }
  }

    useEffect(() => {
        loadUser();
    }, [loadUser, userId]);

    const initials = user?.firstName?.[0] + user?.lastName?.[0] || null;
    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{
                padding: "16px",
                paddingLeft: "5vh",
                paddingRight: "5vh",
                width: "auto",
                height: "auto",
                justifyContent: "space-between",
                backgroundColor: "white",
                borderRadius: "16px",
                alignItems: "center",
                border: 1,
                borderColor: "grey.500",
            }}
        >
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <PersonIcon/>
                <Typography variant={"h6"}>Organiser</Typography>


            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                {user?.profilePicture ? (
                    <Avatar src={user.profilePicture}/>
                ) : (
                    <Avatar> {initials} </Avatar>
                )}
                <Typography variant={"h8"}>{submitterName}</Typography>
            </Stack>
        </Stack>
    );
};
EventDetailsSubmitter.propTypes = {
    submitterName: PropTypes.string,
    userId: PropTypes.string,
};
export default EventDetailsSubmitter;
