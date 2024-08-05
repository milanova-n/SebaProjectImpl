import PropTypes from "prop-types";
import {TextField} from "@mui/material";
import {useState} from "react";

const SubmitEventDescription = ({eventDescription, setEventDescription, error, setError}) => {

    const [errorMessage, setErrorMessage] = useState('')

    const handleEventNameChange = (e) => {
        if (e.target.value.length > 800) {
            setError(true)
            setErrorMessage('Event description has to be max 500 characters long.')
            return
        } else {
            setErrorMessage('Please type in an Event Description')
        }

        setError(false)
        setEventDescription(e.target.value)
    }

    return (
            <TextField
                variant='outlined'
                onChange={e => handleEventNameChange(e)}
                value={eventDescription}
                required={true}
                multiline={true}
                minRows={8}
                style={{width: 500}}
                sx={{mb: 4}}
                inputProps={{maxLength: "801"}}
                error={error}
                helperText={error?errorMessage:`Characters: ${eventDescription.length}/800`}
            />
    )

}
SubmitEventDescription.propTypes = {
    eventDescription: PropTypes.string,
    setEventDescription: PropTypes.func,
    error: PropTypes.bool,
    setError: PropTypes.func,
}

export default SubmitEventDescription;