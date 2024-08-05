import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import {Stack, Typography} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const EventDetailsLocation = ({location}) => {

    const showContent = () => {

            return (
                <Stack direction={"column"} paddingLeft={"3vh"} paddingRight={"3vh"}>
{/*
                    Location number might be undefined, we don't always have a street number
*/}
                    <Typography variant="h8"
                                sx={{paddingBlock: "2px"}}>{location.street} {location.number ?? ""} </Typography>
                    <Typography variant="h8" sx={{paddingBlock: "2px"}}>{location.zipCode} {location.city} </Typography>
                    <Typography variant="h8" sx={{paddingBlock: "2px"}}>{location.country} </Typography>
                </Stack>
            )

    }


    return (

        <Box sx={{
            width: "25vw",
            height: "auto",
            borderRadius: "16px",
            border: 0,
            borderColor: "grey.500",
            padding: "20px",
            paddingLeft: "3vh",
            paddingRight: "3vh",
            backgroundColor:"",
        }}
        >
            <Stack direction={"column"}  alignItems={"flex-start"} spacing={3}>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <LocationOnIcon/>
                    <Typography variant="h6">Location</Typography>
                </Stack>
                {showContent()}

            </Stack>
        </Box>


    );
}
EventDetailsLocation.propTypes = {
    location: PropTypes.object,

}
export default EventDetailsLocation;
