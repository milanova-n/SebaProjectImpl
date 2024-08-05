import PropTypes from "prop-types";
import {Slider, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useEffect} from "react";

const EventsPageCostFilter = ({costFilter, setCostFilter, maxValue, setCostLabel, setCostIcon}) => {
    const minDistance = 0;

    function valuetext(value) {
        return `${value}€`;
    }

    const minValue = 0;

    useEffect(() => {
        if (costFilter[0] === minValue && costFilter[1] === maxValue) {
            setCostLabel("Cost");
            setCostIcon(true)
        } else {
            setCostLabel(`${costFilter[0]}€ - ${costFilter[1]}€`)
            setCostIcon(false)
        }
    }, [costFilter, maxValue, setCostLabel])

    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setCostFilter([Math.min(newValue[0], costFilter[1] - minDistance), costFilter[1]]);
        } else {
            setCostFilter([costFilter[0], Math.max(newValue[1], costFilter[0] + minDistance)]);
        }
    };

    const marks = [
        {
            value: 0,
            label: '0€',
        },
        {
            value: maxValue,
            label: `${maxValue}€`,
        },
    ]

    return (
        <>

            <Stack direction="column" sx={{
                alignItems: "flex-start",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1C75BC"
                }

            }} spacing={2} width={"300px"} paddingLeft={"25px"} paddingTop={"20px"} paddingBottom={"10px"}>
                <Typography variant={"h6"}>Price Range </Typography>
                <Stack direction="row" spacing={2} sx={{alignItems: "center"}}>
                    <Typography>{costFilter[0]} €</Typography>
                    <Typography>to</Typography>
                    <Typography>{costFilter[1]} €</Typography>
                </Stack>
                <Box width={'calc(100% - 25px)'}>
                    <Slider
                        getAriaLabel={() => 'Minimum distance shift'}
                        value={costFilter}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        min={minValue}
                        max={maxValue}
                        disableSwap
                        marks={marks}
                        sx={{width: '100%'}}
                    />
                </Box>

            </Stack>
        </>
    );

}
EventsPageCostFilter.propTypes = {
    costRange: PropTypes.array,
    costFilter:
    PropTypes.array,
    setCostFilter:
    PropTypes.func,
    maxValue: PropTypes.number,
    setCostLabel: PropTypes.func,
    setCostIcon: PropTypes.func,


}
export default EventsPageCostFilter;