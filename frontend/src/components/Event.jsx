import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  createTheme,
  ThemeProvider,
  Stack,
  Tooltip,
} from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { StringToDate } from "../../utils/dateFormating.jsx";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Box from "@mui/material/Box";
import BlockIcon from "@mui/icons-material/Block";

const Event = ({
  eventId,
  title,
  startDate,
  price,
  isEdit,
  onEventClick,
  onEditEventClick,
  headerPicture,
  published,
  status,
  notification,
  userProfileCategoryTitle,
}) => {
  const handleEventClick = () => {
    onEventClick(eventId);
  };
  const ToolTipTitle =
    userProfileCategoryTitle === "My booked Events"
      ? "The event organizer is updating the event. The information is not verified."
      : "Your event is being verified by TUMSocial";

  //When the edit button is clicked, the event id is passed to the parent component
  const handleEditEventClick = () => {
    onEditEventClick(eventId);
  };

  const theme = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            padding: "10px",
            borderRadius: "10px",
          },
        },
      },
    },
  });

  theme.typography.h6 = {
    fontSize: "0.8rem",
    "@media (min-width:1000px)": {
      fontSize: "0.8rem",
    },
    "@media (min-width:1400px)": {
      fontSize: "1.0rem",
    },
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Card sx={{ maxWidth: 225 }}>
          <Link
            to="#"
            onClick={handleEventClick}
            style={{ textDecoration: "none" }}
          >
            <CardMedia
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                width: "100%",
                paddingTop: "56.25%", // 16:9 aspect ratio (change as needed)
              }}
            >
              <img
                src={headerPicture ? headerPicture : "/EventImage.svg"}
                alt="Logo"
                style={{
                  position: "absolute",
                  top: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </CardMedia>
            <CardContent>
              <Box height={"5vh"}>
                <Typography gutterBottom variant="h6" component="div" sx={{ color: "#1C75BC" }}>
                  {title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {StringToDate(startDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {price + " €"}
              </Typography>
            </CardContent>
          </Link>
          <Stack direction="row" justifyContent={"space-between"}>
            {isEdit && (
              <IconButton aria-label={"edit"} onClick={handleEditEventClick}>
                <EditIcon />
              </IconButton>
            )}
            {status === "ACCEPTED" &&
              userProfileCategoryTitle !== "My booked Events" && (
                <Tooltip title="Verified">
                  <DoneAllIcon sx={{ p: 1, color: "green" }} />
                </Tooltip>
              )}
            {(status === "PENDING" ||
              (status === "DECLINED" &&
                userProfileCategoryTitle === "My booked Events")) && (
              <Tooltip title={ToolTipTitle}>
                <PublishedWithChangesIcon sx={{ p: 1 }} />
              </Tooltip>
            )}
            {status === "DECLINED" &&
              userProfileCategoryTitle !== "My booked Events" && (
                <Tooltip title={`${notification}: Please, update your event!`}>
                  <BlockIcon sx={{ p: 1, color: "red" }} />
                </Tooltip>
              )}
          </Stack>
        </Card>
      </ThemeProvider>
    </>
  );
};

Event.propTypes = {
  eventId: PropTypes.string,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  onEventClick: PropTypes.func,
  isEdit: PropTypes.bool,
  onEditEventClick: PropTypes.func,
};

export default Event;
