import PropTypes from "prop-types";
import {TextField} from "@mui/material";

const SubmitEventText = ({eventWebsite, setEventWebsite, error, setError}) => {

    const handleEventWebsiteChange = (e) => {
            setEventWebsite(e.target.value);
    }

    return (
        <TextField
            variant='outlined'
            onChange={e => handleEventWebsiteChange(e)}
            value={eventWebsite}
            required={true}
            style={{width: 500}}
            sx={{mb: 4}}
            inputProps={{maxLength: "100"}}
            error={error}
            helperText={error ? "Please type in an a valid link" : ""}
        />
    )

}
SubmitEventText.propTypes = {
    eventWebsite: PropTypes.string,
    setEventWebsite: PropTypes.func,
    error: PropTypes.bool,
    setError: PropTypes.func,
    textLimit: PropTypes.string
}
export default SubmitEventText;