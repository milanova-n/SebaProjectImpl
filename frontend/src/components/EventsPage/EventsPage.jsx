import Event from "../Event.jsx";
import {Grid, Button, Stack, Typography, Alert} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import axios from "axios";

import AlertDialog from "../AlertDialog.jsx";
import useAuth from "../../../utils/useAuth.jsx";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import EventsPageSearchBar from "./components/EventsPageSearchBar.jsx";
import EventsPageCategoriesBar from "./components/EventsPageCategoriesBar.jsx";
import Box from "@mui/material/Box";
import EventsPageFilterBar from "./components/EventsPageFilterBar.jsx";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import {UserContext} from "../../context/UserContext.jsx";
import {Link} from "react-router-dom";
import {getToken} from "../../../utils/tokenService.jsx";
import {ErrorContext} from "../../context/ErrorContext.jsx";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const EventsPage = () => {
    // State for the selected filters
    const [selectedFilters, setSelectedFilters] = useState({
        searchString: "",
        date: [dayjs(), dayjs().add(1, "year").endOf("day")],
        location: [],
        costRange: [0, 100],
        categories: [],
        sort: "0",
    });
    //Main data of the events fetched from the backend
    const [data, setData] = useState([]);
    const [eventsNumber, setEventsNumber] = useState(4);
    const {setErrorMessage} = useContext(ErrorContext);

    /*    //State for the filtered events
          const [filteredEvents, setFilteredEvents] = useState(data);*/
    //Hide Button, if all events have been loaded
    const [hideButton, setHideButton] = useState(true);
    const [maxValue, setMaxValue] = useState(100);
    const {user} = useContext(UserContext);
    const token = getToken();

    const params = {
        location: selectedFilters.location,
        startDate: selectedFilters.date[0].toISOString(),
        endDate: selectedFilters.date[1].toISOString(),
        priceFrom: selectedFilters.costRange[0],
        priceTo: selectedFilters.costRange[1],
        categories: selectedFilters.categories,
        searchString: selectedFilters.searchString,
        sort: selectedFilters.sort,
        eventAmount: 20,
    };

    useEffect(() => {
        async function fetchMaxPriceEvent() {
            try {
                const res = await axios.get(
                    "http://localhost:8080/api/events/maxPrice"
                );
                if (res.status === 200) {
                    const tempMaxValue = parseFloat(res.data.maxPrice.$numberDecimal);
                    console.log("Max price event fetched successfully: ", tempMaxValue);
                    setMaxValue(tempMaxValue);
                    selectedFilters.costRange[1] = tempMaxValue;
                } else {
                    console.error("No events found");
                }
            } catch (error) {
                console.error("Error fetching max price event:", error);
                //return null;
                const errorMessage = error?.response?.data?.message || "Unknown";
                setErrorMessage(errorMessage);
                window.location.href = "/error";
            }
        }

        fetchMaxPriceEvent();
    }, []);

    //Function to handle the change of the selected filters
    const handleFilterSortChange = (categoryType, selectedFilters) => {
        if (categoryType === "startDate") {
            setSelectedFilters((prevState) => ({
                ...prevState,
                date: [selectedFilters, prevState.date[1]],
            }));
        } else if (categoryType === "endDate") {
            setSelectedFilters((prevState) => ({
                ...prevState,
                date: [prevState.date[0], selectedFilters],
            }));
        } else if (categoryType === "costRange") {
            setSelectedFilters((prevState) => ({
                ...prevState,
                costRange: selectedFilters,
            }));
        } else if (
            categoryType === "location" ||
            categoryType === "searchString" ||
            categoryType === "categories" ||
            //Value 0 (upcoming dates),1 (Price low to high), 2 (Price high to low)
            categoryType === "sort"
        ) {
            setSelectedFilters((prevState) => ({
                ...prevState,
                [categoryType]: selectedFilters,
            }));
        }
    };

    const [dialogOpen, setDialogOpen] = useState(false);
    const isAuthenticated = useAuth();

    const handleEventClick = (eventId) => {
        if (!isAuthenticated) {
            setDialogOpen(true);
        } else {
            // Navigate to event details
            window.location.href = `/events/${eventId}`;
        }
    };

    //Function to fetch all events from the backend
    async function loadEvents(params) {
        try {
            const res = await axios.get("http://localhost:8080/api/events/getAll", {
                params,
            });
            if (!res.data) {
                console.log("Result is empty");
            } else {
                setData(res.data);
            }
        } catch (error) {
            console.error("Error fetching events data:", error);
            const errorMessage = error?.response?.data?.message || "Unknown";
            setErrorMessage(errorMessage);
            window.location.href = "/error";
        }
    }

    // async function loadEvents() {
    //   try {
    //     const res = await axios.get(
    //       "http://localhost:8080/api/events/userEventstatus",
    //       {
    //         params: { status: "ACCEPTED" },
    //       }
    //     );
    //     if (!res.data) {
    //       console.log("Result is empty");
    //     } else {
    //       setData(res.data);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching events data:", error);
    //   }
    // }

    //Function to fetch the min and max price of the events (used for the cost range filter)
    //   useEffect(() => {
    //     if (data.length > 0) {
    //       const min = Math.min(
    //         ...data.map((event) => Number(event.price.$numberDecimal))
    //       );
    //       const max = Math.max(
    //         ...data.map((event) => Number(event.price.$numberDecimal))
    //       );
    //       setSelectedFilters((prevState) => ({
    //         ...prevState,
    //         costRange: [min, max],
    //       }));
    //     }
    //   }, [data]);

    // useEffect(() => {
    //   loadEvents();
    // }, [selectedFilters, eventsNumber]);

    useEffect(() => {
        loadEvents(params);
    }, [selectedFilters, eventsNumber]);

    const handleButtonClick = () => {
        setEventsNumber(eventsNumber + 4);
    };

    useEffect(() => {
        if (data.length > 0 && eventsNumber >= data.length) {
            setHideButton(true);
        } else {
            setHideButton(false);
        }
    }, [data.length, eventsNumber]);

    const handleAlertClose = async () => {
        try {
            const user = await axios.patch(
                `http://localhost:8080/api/users/changedEventStatus`,
                {status: false},
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            console.log("Updated user seen", user);
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
            <header className="mui-fixed">
                <Header/>

                <Stack direction="column" alignItems={"center"} paddingBottom={"50px"}>
                    <EventsPageSearchBar
                        search={selectedFilters.searchString}
                        setSearch={handleFilterSortChange}
                    />
                    <Stack direction="row" paddingTop={"30px"}>
                        <Box width={"20vw"} paddingLeft={"20px"}>
                            <EventsPageCategoriesBar
                                selectedCategories={selectedFilters.categories}
                                setSelectedCategories={(newCategories) =>
                                    handleFilterSortChange("categories", newCategories)
                                }
                            />
                        </Box>

                        <Stack
                            direction={"column"}
                            width={"60vw"}
                            sx={{backgroundColor: "white"}}
                            spacing={1}
                            alignItems={"center"}
                        >
                            <EventsPageFilterBar
                                selectedFilters={selectedFilters}
                                handleFilterSortChange={handleFilterSortChange}
                                data={data}
                                setSelectedFilters={setSelectedFilters}
                                maxValue={maxValue}
                            />
                            {user.eventStatusChanged && (
                                <Alert severity="info" onClose={handleAlertClose}>
                                    The status of your event/s changed!{" "}
                                    <Link to={`/profile/${user._id}`} onClick={handleAlertClose}>
                                        {" "}
                                        Have a look!
                                    </Link>
                                </Alert>
                            )}

                            <Grid
                                container
                                sx={{padding: "20px 10px"}}
                                alignItems={"center"}
                                rowSpacing={4}
                                columnSpacing={{xs: 2, sm: 3, md: 4}}
                            >
                                {data.length > 0 ? (
                                    data.slice(0, eventsNumber).map((event) => (
                                        <Grid item key={event._id} xs={3}>
                                            <Event
                                                eventId={event._id}
                                                title={event.eventName}
                                                startDate={event.eventStartDate}
                                                price={Number(event.price.$numberDecimal)}
                                                onEventClick={handleEventClick}
                                                headerPicture={event.headerPicture}
                                            />
                                        </Grid>
                                    ))
                                ) : (
                                    <Stack alignItems={"center"} width={"100%"} paddingTop={"5vh"}>
                                        <Typography align={"center"} variant="h5" color="text.secondary">
                                            No events could be found.
                                        </Typography>
                                    </Stack>
                                )}
                            </Grid>
                        </Stack>
                    </Stack>

                    <Grid container justifyContent="center">
                        {!hideButton && (
                            <Button sx={{width: "20%"}} onClick={handleButtonClick}>
                                Load More
                            </Button>
                        )}
                    </Grid>
                    <AlertDialog
                        type={"registration"}
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                    />
                </Stack>

                <Footer/>
            </header>
        </>
    );
};

export default EventsPage;
