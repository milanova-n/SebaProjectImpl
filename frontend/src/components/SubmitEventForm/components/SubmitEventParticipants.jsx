import {TextField} from "@mui/material";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";

const SubmitEventParticipants = ({participants, setParticipants, error, setError}) => {

    const [errorMessage, setErrorMessage] = useState("")

    const handleParticipantsChange = (e) => {
        if ((e.target.value > 0 && e.target.value !== "+" && e.target.value !== "-") || e.target.value === "") {
            setParticipants(e.target.value)
        } else {
            setErrorMessage("Please select a valid number")
            setParticipants("0")
        }
    }

    useEffect(() => {
        if (error && participants === "0") {
            setErrorMessage("Please select a number of participants")
        }
    }, [error]);

    return (
        <TextField
            type="number"
            onChange={e => handleParticipantsChange(e)}
            value={participants}
            rows={1}
            width={200}
            error={error}
            helperText={error ? errorMessage : ""}
            style={{width: 100}}
            InputProps={{
                inputProps: {min: 0}
            }}

        />)
}
SubmitEventParticipants.propTypes = {
    participants: PropTypes.string,
    setParticipants: PropTypes.func,
    error: PropTypes.bool,
    setError: PropTypes.func,
}
export default SubmitEventParticipants;