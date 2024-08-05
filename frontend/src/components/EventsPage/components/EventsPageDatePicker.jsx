import DateTimePickerComp from "../../DateTimePickerComp.jsx";
import PropTypes from "prop-types";
import {Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
const EventsPageDatePicker = ({ eventStartDateObj, eventEndDateObj, setSelectedDate }) => {
        const [errorDate, setErrorDate] = useState(false)

    useEffect(() => {
            const checkDate = () => {
                if (dayjs(eventStartDateObj).isAfter(dayjs(eventEndDateObj))
                    || dayjs(eventEndDateObj).isBefore(dayjs())
                    || dayjs(eventStartDateObj).isAfter(dayjs().add(5, 'years'))
                    || dayjs(eventEndDateObj).isAfter(dayjs().add(5, 'years'))
                ) {
                    setErrorDate(true)
                } else {
                    setErrorDate(false)
                }
            }
            checkDate();
        }, [eventStartDateObj, eventEndDateObj]
    )

    return (
    <Stack direction={"column"} width={"10%"} sx={{ alignItems:"flex-start"}} spacing={2} padding={"20px"}>
        <Typography variant={"h7"} width={"20%"}>From</Typography>
        <DateTimePickerComp views={['year', 'month', 'day']}
                            eventDateObj={eventStartDateObj}
                            setEventDate = {newDate => setSelectedDate('startDate', newDate)}
                            dateError={errorDate}
                            width={"12vw"}
        />
        <Typography variant={"h7"} width={"20%"}>To</Typography>
        <DateTimePickerComp views={['year', 'month', 'day']}
                            eventDateObj={eventEndDateObj}
                            setEventDate = {newDate => setSelectedDate('endDate', newDate)}
                            dateError={errorDate}
                            width={"12vw"}
        />
    </Stack>
  );
}
EventsPageDatePicker.propTypes = {
    eventStartDateObj: PropTypes.object,
    eventEndDateObj: PropTypes.object,
    setSelectedDate: PropTypes.func,
}
export default EventsPageDatePicker;

