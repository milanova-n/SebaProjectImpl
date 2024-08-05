import {Box, TextField, Typography} from "@mui/material";
import PropTypes from "prop-types";

const EventDetailsCategory = ({details, edit, handleTextChange }) => {

    const showContent = () => {
        if (!edit) {
            return(<Typography sx={{ color: "white" }}>{details.eventCategory}</Typography>)
        } else {
            return(<TextField
                    inputProps={{min: 0, style: { textAlign: 'center' }}}
                    value={details.eventCategory}
                    onChange={handleTextChange('eventCategory')}
                    fullWidth

            />
            )
        }
    }


    return(
        <Box
            sx={{
                position: 'absolute',
                top: '50px',
                right: '150px',
                backgroundColor: "#f4f4f4",
                borderRadius: '16px',
            }}
        >
            {showContent()}
        </Box>
    )

}
EventDetailsCategory.propTypes = {
    details: PropTypes.object,
    edit: PropTypes.bool,
    handleTextChange: PropTypes.func,
}
export default EventDetailsCategory;