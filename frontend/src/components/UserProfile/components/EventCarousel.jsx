import { useContext, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PropTypes from "prop-types";
import Event from "../../Event.jsx";
import useAuth from "../../../../utils/useAuth.jsx";
import AlertDialog from "../../AlertDialog.jsx";
import { getToken } from "../../../../utils/tokenService.jsx";
import { Alert, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { UserContext } from "../../../context/UserContext.jsx";
import axios from "axios";
import { ErrorContext } from "../../../context/ErrorContext.jsx";

const EventCarousel = ({ events, title, edit }) => {
  const { user } = useContext(UserContext);
  const isAuthenticated = useAuth();
  const token = getToken();
  const { setErrorMessage } = useContext(ErrorContext);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEventClick = (eventId) => {
    if (!isAuthenticated) {
      setDialogOpen(true);
    } else {
      // Navigate to event details
      window.location.href = `/events/${eventId}`;
    }
  };

  const handleEditClick = async (eventId) => {
    //change status of event
    if (user.eventStatusChanged) {
      try {
        const response = await axios.patch(
          `http://localhost:8080/api/users/changedEventStatus`,
          { status: false },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
    }
    if (!isAuthenticated) {
      setDialogOpen(true);
    } else {
      // Navigate to event details
      window.location.href = `/events/edit/${eventId}`;
    }
  };

  //   async function loadEvents() {
  //     try {
  //       const token = getToken();
  //       //Fetches all events that are created by the user (Based on the user id)
  //       const res = await axios.get(
  //         "http://localhost:8080/api/events/edit/getAll",
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       if (!res.data) {
  //         console.log("Result is empty");
  //       } else {
  //         console.log("Response", res.data);
  //         setEvents(res.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching events data:", error);
  //     }
  //   }

  //   useEffect(() => {
  //     loadEvents();
  //   }, []);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 2000 },
      items: 5,
      slidesToSlide: 2,
    },
    desktop: {
      breakpoint: { max: 2000, min: 800 },
      items: 3,
      slidesToSlide: 2,
    },

    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 2,
    },
  };

  const handleAlertClose = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/api/users/changedEventStatus`,
        { status: false },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  return (
    <>
      <Typography variant="h4">{title}</Typography>
      {user.eventStatusChanged && title === "Submitted Events" && (
        <Alert severity="info" onClose={handleAlertClose}>
          The status of your event/s changed!
        </Alert>
      )}

      {events.length === 0 ? (
        <Box padding={"5%"} paddingBottom={"5vh"} paddingTop={"2vh"}>
          <Typography variant="h5" align={"center"}>
            No events yet
          </Typography>
        </Box>
      ) : (
        <Box width={"auto"} paddingInline={"10vh"} height={"inherit"}>
          <Carousel
            draggable={false}
            showDots={false}
            responsive={responsive}
            infinite={false}
            autoPlaySpeed={1000}
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
          >
            {events.map((event) => (
              <Event
                eventId={event._id}
                isEdit={edit}
                key={event._id}
                title={event.eventName}
                onEditEventClick={handleEditClick}
                startDate={event.eventStartDate}
                price={Number(event.price?.$numberDecimal)}
                onEventClick={handleEventClick}
                headerPicture={event.headerPicture}
                published={event.published}
                status={event.status}
                notification={event.notification}
                userProfileCategoryTitle={title}
              />
            ))}
          </Carousel>
        </Box>
      )}
      <AlertDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

export default EventCarousel;
EventCarousel.propTypes = {
  eventCategory: PropTypes.string,
  events: PropTypes.array,
  title: PropTypes.string,
  edit: PropTypes.bool,
};
