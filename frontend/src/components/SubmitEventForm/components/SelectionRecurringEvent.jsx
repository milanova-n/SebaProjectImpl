import PropTypes from "prop-types";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useState} from "react";

const SelectionRecurringEvent = ({recurringEvent, setRecurringEvent}) => {

    const handleChange = (event) => {
        setRecurringEvent(event.target.value);
    };

    return (<>
            <FormControl>
                <Select
                    id="select"
                    value={recurringEvent}
                    onChange={handleChange}
                    sx={{width:"30vh"}}
                >
                    <MenuItem value={"once"}>Once</MenuItem>
                    <MenuItem value={"weekly"}>Weekly</MenuItem>
                    <MenuItem value={"biweekly"}>Biweekly</MenuItem>
                    <MenuItem value={"monthly"}>Monthly</MenuItem>
                </Select>
            </FormControl>

        </>
    )
}
SelectionRecurringEvent.propTypes = {
    recurringEvent: PropTypes.string.isRequired,
    setRecurringEvent: PropTypes.func.isRequired
}
export default SelectionRecurringEvent;