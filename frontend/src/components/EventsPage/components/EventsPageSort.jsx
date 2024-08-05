import {FormControl, Grid, InputLabel} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";

const EventsPageSort = ({handleSortChange}) => {

    const handleChange = (event) => {
        handleSortChange("sort", event.target.value)
    }

    return (
        <>
            <Grid container justifyContent={"flex-end"}>
                <FormControl sx={{m: 1, minWidth: 300}} size="small">
                    <InputLabel id="sort-selection">Sort</InputLabel>
                    <Select
                        labelId="dsort-selection"
                        id="demo-simple-select"
                        label="Sort"
                        onChange={handleChange}
                        defaultValue={"0"}
                        sx={{
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#1C75BC"
                            }
                        }}
                    >
                        <MenuItem value="0">Upcoming Dates</MenuItem>
                        <MenuItem value="1">Price low to high</MenuItem>
                        <MenuItem value="2">Price high to low</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </>
    )
}
EventsPageSort.propTypes = {
    handleSortChange: PropTypes.func,
}
export default EventsPageSort;