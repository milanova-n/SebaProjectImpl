import dayjs from "dayjs";
import TimePickerComp from "./TimePickerComp.jsx";
import {Stack} from "@mui/material";
import PropTypes from "prop-types";

const TimePickerRange = ({eventStartTime, eventEndTime, setEventStartTime, setEventEndTime, dateError, setError}) => {

    const handleStartTimeChange = (newDate) => {

        if (dayjs(newDate).isAfter(dayjs(eventEndTime), 'minute')) {
            setError(true)

        } else {
            setError(false)
            setEventStartTime(newDate)
        }

    }

    const handleEndTimeChange = (newDate) => {
        const newStartTimeFormatted = dayjs(eventEndTime).format('HH:mm');
        const currentEndTimeFormatted = dayjs(newDate).format('HH:mm');
        if (newStartTimeFormatted > currentEndTimeFormatted) {
            setError(true)

        }else {
            setError(false)
            setEventEndTime(newDate)
        }
    }

    return (
        <Stack direction={"row"} spacing={2}>
            <TimePickerComp setEventTime={handleStartTimeChange} eventDateObj={dayjs(eventStartTime)} error={dateError}
            />
            <TimePickerComp setEventTime={handleEndTimeChange} eventDateObj={dayjs(eventEndTime)} error={dateError}
            />


        </Stack>

    )
}
TimePickerRange.propTypes = {
    eventStartTime: PropTypes.object,
    eventEndTime: PropTypes.object,
    setEventStartTime: PropTypes.func,
    setEventEndTime: PropTypes.func,
    dateError: PropTypes.bool,
    setError: PropTypes.func,
}
export default TimePickerRange;