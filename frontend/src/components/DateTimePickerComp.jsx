import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import 'dayjs/locale/de';
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

const DateTimePickerComp = ({eventDateObj, setEventDate, views, label, dateError, recurring, minDate, width}) => {
    const handleDateChange = (newDate) => {
        setEventDate(newDate)
    }

    if (recurring) {
        return (<>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                <DatePicker
                    sx={{width:{width}}}
                    views={views}
                    label={label}
                    disablePast = {true}
                    value={eventDateObj ? eventDateObj : null}
                    onChange={handleDateChange}
                    minDate={minDate}
                    maxDate={dayjs().add(5, 'year')}
                    slotProps={{
                        textField: {
                            error: !!dateError,
                            helperText: dateError ? "Invalid Date" : "",
                        },
                    }}
                />
            </LocalizationProvider>
        </>)
    } else {
        return (<>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <DateTimePicker
                        sx={{width:{width}}}
                        views={views}
                        ampm={false}
                        label={label}
                        value={eventDateObj ? eventDateObj : null}
                        onChange={handleDateChange}
                        disablePast = {true}
                        slotProps={{
                            textField: {
                                error: !!dateError,
                                helperText: dateError ? "Invalid Date" : "",
                            },
                        }}
                        minDateTime={dayjs()}
                        maxDateTime={dayjs().add(5, 'year')}
                    />
                </LocalizationProvider>
            </>
        );
    }


}
DateTimePickerComp.propTypes = {
    dateError: PropTypes.bool,
    label: PropTypes.string,
    views: PropTypes.array,
    eventDateObj: PropTypes.object,
    setEventDate: PropTypes.func,
    recurring: PropTypes.bool,
    minDate: PropTypes.object,
    width: PropTypes.string,
}
export default DateTimePickerComp;