import PropTypes from "prop-types";
import {List, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";

const EventDetailsDescription = ({details, handleTextChange, edit, descriptionError, setDescriptionError}) => {

    const handleDescChange = (event) => {
        if (event.target.value.length > 800) {
            setDescriptionError(true);
            return;
        } else {
            handleTextChange('eventDescription')(event);
            setDescriptionError(false);
        }
    }

    const showContent = () => {
        if (!edit) {
            return (
                <Typography padding={"4%"}
                            minHeight={"200px"}
                            sx={{
                                border: 1,
                                borderColor: "grey.500",
                                borderRadius: '16px',
                                backgroundColor: "grey.200",
                                textAlign: 'justify'
                            }}
                            paragraph={true}
                >
                    <List style={{maxHeight: '300px', overflow: 'auto'}}>
                        {details.eventDescription}
                    </List>
                </Typography>
            )
        } else {
            return (<TextField
                    value={details.eventDescription}
                    onChange={(event) => handleDescChange(event)}
                    multiline
                    fullWidth
                    maxRows={15}
                    minRows={10}
                    inputProps={{maxLength: "801"}}
                    sx={{borderRadius: '16px'}}
                    error={descriptionError}
                    helperText={`Characters: ${details.eventDescription.length}/800`}

                />
            )
        }
    }

    return (
        <Box spacing={1} sx={{width: "100%", height: "auto"}}>

            {showContent()}

        </Box>
    );


}

EventDetailsDescription.propTypes = {
    handleTextChange: PropTypes.func,
    details: PropTypes.object,
    edit: PropTypes.bool,
    descriptionError: PropTypes.bool,
    setDescriptionError: PropTypes.func
}
export default EventDetailsDescription;