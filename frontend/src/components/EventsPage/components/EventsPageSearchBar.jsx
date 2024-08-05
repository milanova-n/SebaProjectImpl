import {InputAdornment, Stack, TextField, Typography} from "@mui/material";
import PropTypes from "prop-types";
import SearchIcon from '@mui/icons-material/Search';
import backgroundImage from "../../TUM_Uhrenturm.jpg";

const EventsPageSearchBar = ({setSearch}) => {

    return(
        <Stack  sx={{
            paddingTop: "20vh",
            paddingBottom: "10vh",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: "100%",
        }}
                spacing={3}
                alignItems={"center"}
                padding={"20px"}
        >
            <Stack sx={{
                padding: "30px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
                border: "4px solid #FFFFFF",
                borderRadius: "10px",
                width: "50%",
                marginTop: 400,
            }}
            alignItems={"center"}
            spacing={2}
            >
            <Typography color={"white"} variant={"h3"}>Discover new Events</Typography>

            <TextField
                sx={{width: "80%", backgroundColor: "white",borderRadius: "10px", }}
                id="outlined-basic"
                variant="outlined"
                onChange={(event) => setSearch('searchString', event.target.value)}
                InputProps={{startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                    placeholder: "Search for events"
                }}
            />
            </Stack>
        </Stack>

    )

}
EventsPageSearchBar.propTypes = {
    search: PropTypes.string,
    setSearch: PropTypes.func,
}
export default EventsPageSearchBar;