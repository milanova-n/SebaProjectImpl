import {FormControl, Stack, Typography} from "@mui/material";
import PropTypes from "prop-types";
import TodayIcon from '@mui/icons-material/Today';
import dayjs from "dayjs";
import 'dayjs/locale/de';
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";

const EventDetailsDate = ({
                              startDate,
                              endDate,
                              details,
                          }) => {

    const [dateView, setDateView] = useState("")
    const [upcomingDate, setUpcomingDate] = useState(dayjs())
    const [missedEvent, setMissedEvent] = useState(false)

    const dateViewType = () => {
        if (startDate.isSame(endDate, 'day')) {
            setDateView("sameDay")
        } else if (details.recurringEvent === "weekly" || details.recurringEvent === "biweekly" || details.recurringEvent === "monthly") {
            setDateView("recurring")
        }
    }

    const getUpcomingDate = () => {
        const today = dayjs();
        const recurringEvent = details.recurringEvent

        if (today.isBefore(startDate)) {
            setUpcomingDate(startDate)
            return
        }

        //If event already has ended
        if (today.isAfter(endDate)) {
            return
        }

        let upComingDate = startDate;

        while (upComingDate.isBefore(endDate)) {

            if(upComingDate.isAfter(endDate)){
                setMissedEvent(true)
                return
            }

            if (upComingDate.isAfter(today, "minute")) {
                setUpcomingDate(upComingDate)
                return
            }
            switch (recurringEvent) {
                case "weekly":
                    upComingDate = upComingDate.add(1, 'week');
                    break;
                case "biweekly":
                    upComingDate = upComingDate.add(2, 'weeks');
                    break;
                case "monthly":
                    upComingDate = upComingDate.add(1, 'month');
                    break;
                default:
                    return null; // Invalid recurring event type
            }
        }

        return null; // No upcoming date found within the range
    };

    useEffect(() => {
        if (startDate !== null && endDate !== null) {
            getUpcomingDate()
            dateViewType()
        }
    }, [details]);


    const dateTimeView = () => {

        switch (dateView) {
            case "sameDay":
                return (<>
                    <Typography variant="h7"
                                sx={{paddingBlock: "2px"}}>{startDate.format("ddd, DD.MM.YYYY").toString()} </Typography>
                    <Stack direction={"row"}>
                        <Typography variant="h7"
                                    sx={{paddingBlock: "2px"}}>{startDate.format("HH:mm").toString()} - {endDate.format("HH:mm").toString()}</Typography>
                    </Stack>
                </>)
            case "recurring":
                return (<Stack alignItems={"center"}>
                    <Typography variant="h7"
                                sx={{paddingBlock: "2px"}}>{startDate.format("DD.MM.YYYY").toString()} - {endDate.format("DD.MM.YYYY").toString()}</Typography>
                    <Typography variant="h7" sx={{fontWeight: "bold"}}>
                        {details.recurringEvent === "weekly" ? "Weekly" : details.recurringEvent === "biweekly" ? "Biweekly" : details.recurringEvent === "monthly" ? "Monthly" : ""}
                    </Typography>

                    <Typography variant="h8"
                                sx={{paddingBlock: "2px"}}>{startDate.format("HH:mm").toString()} - {endDate.format("HH:mm").toString()}</Typography>

                    <Typography variant="h8"
                                sx={{paddingBlock: "2px"}}>Upcoming Date</Typography>
                    {!missedEvent ?
                    <Typography variant="h8"
                                sx={{paddingBlock: "2px"}}>{upcomingDate.format("ddd, DD.MM.YYYY")}</Typography>:
                    <Typography variant="h8">It seems, that the event has already ended.</Typography>
                    }
                </Stack>)
            default:
                return (<>
                    <Typography variant="h7"
                                sx={{paddingBlock: "2px"}}>{startDate.format("DD.MM.YYYY").toString()} - {endDate.format("DD.MM.YYYY").toString()}</Typography>
                    <Typography variant="h7"
                                sx={{paddingBlock: "2px"}}>{startDate.format("HH:mm").toString()} - {endDate.format("HH:mm").toString()}</Typography>
                </>)
        }

    }



    return (

        <>
            <Stack spacing={1} sx={{
                width: "25vw",
                height: "auto",
                borderRadius: "16px",
                border: 0,
                borderColor: "grey.500",
                padding: "20px",
                backgroundColor:""
            }}>

                <Stack direction={"column"} alignItems={"flex-start"} spacing={3} sx={{backgroundColor: ""}}>
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                        <TodayIcon/>
                        <Typography variant="h6">Date and Time</Typography>
                    </Stack>
                    <Stack direction={"column"} alignItems={"center"} width={"100%"} spacing={1}>
                    {dateTimeView()}
                    </Stack>

                </Stack>
            </Stack>
        </>

    )

}
EventDetailsDate.propTypes = {
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    details: PropTypes.object,
}
export default EventDetailsDate;