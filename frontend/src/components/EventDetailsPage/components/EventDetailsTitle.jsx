import {TextField, Typography} from "@mui/material";
import PropTypes from "prop-types";

const EventDetailsTitle = ({details, edit, handleTextChange }) => {

    const showContent = () => {
        if (edit) {
            return (
                <TextField
                    value={details.eventName}
                    onChange={handleTextChange('eventName')}
                    maxRows={1}
                    sx={{width: "auto"}}
                    inputProps={{style: {fontSize: 28}}}
                />
            )
        } else {
            return (
                <Typography variant="h4" sx={{paddingBlock: "2px", fontWeight:'bold'} }>{details.eventName} </Typography>
            )
        }
    }

    return(
        <>
            {showContent()}
            </>
      )

}
EventDetailsTitle.propTypes = {
    details: PropTypes.object,
    edit: PropTypes.bool,
    handleTextChange: PropTypes.func,
}
export default EventDetailsTitle;

