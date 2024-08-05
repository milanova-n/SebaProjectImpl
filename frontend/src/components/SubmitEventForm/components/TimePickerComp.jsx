import {Stack} from "@mui/material";
import PropTypes from "prop-types";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const TimePickerComp = ({label, eventDateObj, setEventTime, error}) => {

    const handleTimeChange = (newDate) => {
        setEventTime(newDate)
    }
    return (
        <Stack direction="row" spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker onChange={handleTimeChange} value={eventDateObj ? eventDateObj : null}
                            ampm={false}
                            label={label}
                            slotProps={{
                        textField: {
                            error: !!error,
                            helperText: error ? "Invalid Time" : "",
                        },
                    }}

                />
            </LocalizationProvider>
        </Stack>

    )
}
TimePickerComp.propTypes = {
    label: PropTypes.string,
    eventDateObj: PropTypes.object,
    setEventTime: PropTypes.func,
    error: PropTypes.bool,
}
export default TimePickerComp;