import { LinearProgress, Stack, Typography} from "@mui/material";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import {useEffect, useState} from "react";

const EventDetailsParticipantsOverview = ({participants, totalParticipants}) => {

    const [attendanceRate, setAttendanceRate] = useState(0);

    useEffect(() => {
        setAttendanceRate(participants / totalParticipants * 100);
    }, [participants, totalParticipants])

    return (
        <Stack direction="column" spacing={1} sx={{
            padding: "2vh",
            width: "auto",
            height: "auto",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "16px",
            alignItems: "center",
            border: 1,
            borderColor: "grey.500"
        }}>
            <Stack alignItems={"center"} spacing={2}>

                <Typography align="center" variant={"h8"} fontWeight={"bold"}>
                     {participants} of {totalParticipants}
                </Typography>
                                    <Typography align="center" variant={"h8"} fontWeight={"bold"}>

                    Students have joined the event 🎉
                </Typography>
<Box width={"80%"}>
                    <LinearProgress variant="determinate" value={attendanceRate}/>
                </Box>
            </Stack>

        </Stack>
    )
}
EventDetailsParticipantsOverview.propTypes = {
    participants: PropTypes.number,
    totalParticipants: PropTypes.number
}
export default EventDetailsParticipantsOverview;