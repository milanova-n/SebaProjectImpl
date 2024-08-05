import PropTypes from "prop-types";
import {Stack} from "@mui/material";
import EventsPageDatePicker from "./EventsPageDatePicker.jsx";
import EventsPageLocationPicker from "./EventsPageLocationPicker.jsx";
import EventsPageCostFilter from "./EventsPageCostFilter.jsx";
import EventsPageFilterButton from "./EventsPageFilterButton.jsx";
import EventsPageSort from "./EventsPageSort.jsx";
import {useState} from "react";

const EventsPageFilterBar = ({
                                 selectedFilters, handleFilterSortChange, maxValue,
                             }) => {

    const [costLabel, setCostLabel] = useState("Cost");
    const [showCostIcon, setShowCostIcon] = useState(true);

    return (<Stack alignItems="center" width={"60vw"} minHeight={"75px"} direction="row" spacing={5}
                   sx={{backgroundColor: "white"}}>
        <EventsPageFilterButton icon={"Date"} label={"Date"} showIcon={true}>
            <EventsPageDatePicker eventStartDateObj={selectedFilters.date[0]}
                                  eventEndDateObj={selectedFilters.date[1]}
                                  setSelectedDate={handleFilterSortChange}

            />
        </EventsPageFilterButton>
        <EventsPageLocationPicker
            categoryType="location"
            onCategoryChange={selectedOptions => handleFilterSortChange('location', selectedOptions)}
        />
        <EventsPageFilterButton icon={"Cost"} label={costLabel} showIcon={showCostIcon}>
            <EventsPageCostFilter costFilter={selectedFilters.costRange}
                                  maxValue={maxValue}
                                  setCostFilter={newCostRange => handleFilterSortChange('costRange', newCostRange)}
                                  setCostLabel={setCostLabel}
                                  setCostIcon={setShowCostIcon}
            />
        </EventsPageFilterButton>
        <EventsPageSort handleSortChange={handleFilterSortChange}></EventsPageSort>

    </Stack>)

}
EventsPageFilterBar.propTypes = {
    data: PropTypes.array,
    selectedFilters: PropTypes.object,
    setFilteredEvents: PropTypes.func,
    handleFilterSortChange: PropTypes.func,
    filteredEvents: PropTypes.array,
    maxValue: PropTypes.number,
}

export default EventsPageFilterBar;