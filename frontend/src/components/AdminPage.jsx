import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { getToken } from "../../utils/tokenService.jsx";
import Event from "./Event.jsx";
import useAuth from "../../utils/useAuth.jsx";
import { UserContext } from "../context/UserContext.jsx";
import Header from "./Header.jsx";
import { Stack } from "@mui/material";
import { ErrorContext } from "../context/ErrorContext.jsx";

const AdminPage = () => {
  const { user } = useContext(UserContext);
  const [pendingEvents, setPendingEvents] = useState([]);
  const isAuthenticated = useAuth();
  const { setErrorMessage } = useContext(ErrorContext);

  const handleEventClick = (eventId) => {
    if (!isAuthenticated) {
      console.log("Not authenticated");
    } else {
      window.location.href = `/events/${eventId}`;
    }
  };

  useEffect(() => {
    const token = getToken();
    //Add checkAuth in backend as well and here
    const loadPendingEvents = async () => {
      try {
        console.log("Load Events");
        const res = await axios.get(`http://localhost:8080/api/events/status`, {
          params: { status: "PENDING" },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.data) {
          console.log("No Events found.");
        } else {
          console.log("Events found:");
          console.log(res.data);
          setPendingEvents(res.data);
        }
      } catch (error) {
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

    loadPendingEvents();
  }, []);

  const userName = `${user.firstName} ${user.lastName}`;
  return (
    <>
      <Header />
      <Stack sx={{ padding: " 100px 300px" }}>
        <div>
          {user.role === "admin" ? (
            <div>
              <h2>Hello, {userName}!</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "20px",
                }}
              >
                {pendingEvents.length > 0 ? (
                  pendingEvents.map((event) => (
                    <Event
                      key={event._id}
                      id={event._id}
                      title={event.eventName}
                      startDate={event.eventStartDate}
                      description={event.description}
                      price={parseFloat(event.price.$numberDecimal)}
                      onEventClick={() => handleEventClick(event._id)}
                      headerPicture={event.headerPicture}
                    />
                  ))
                ) : (
                  <p>No pending events found.</p>
                )}
              </div>
            </div>
          ) : (
            <p>You are not allowed to access this page!</p>
          )}
        </div>
      </Stack>
    </>
  );
};

export default AdminPage;
