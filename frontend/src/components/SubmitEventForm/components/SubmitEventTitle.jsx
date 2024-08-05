import {TextField} from "@mui/material";
import PropTypes from "prop-types";
import {useState} from "react";

const SubmitEventTitle = ({eventName, setEventName, error, setError}) => {

    const [errorMessage, setErrorMessage] = useState('')


    const handleEventNameChange = (e) => {

        if (e.target.value.length > 25) {
            setError(true)
            setErrorMessage('Event Name has to be max 25 characters long.')
            return
        } else {
            setErrorMessage('Please type in an Event Name')
        }

        setError(false)
        setEventName(e.target.value)
    }

    return (

        <TextField
            variant='outlined'
            onChange={e => handleEventNameChange(e)}
            value={eventName}
            required={true}
            style={{width: 500}}
            sx={{mb: 4,

        }}
            inputProps={{maxLength: "26"}}
            error={error}
            helperText={error ? errorMessage : `Characters: ${eventName.length}/25`}
        />
    )
}
SubmitEventTitle.propTypes = {
    eventName: PropTypes.string,
    setEventName: PropTypes.func,
    error: PropTypes.bool,
    setError: PropTypes.func,
}
export default SubmitEventTitle;