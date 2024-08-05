import PropTypes from "prop-types";
import {Button, Menu, Typography} from "@mui/material";
import {useState} from "react";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EuroIcon from '@mui/icons-material/Euro';

const EventsPageFilterButton = ({children, label, icon, showIcon}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const setIcon = () => {
        if (icon === "Date") {
            return <CalendarTodayIcon/>
        }
        if (icon === "Cost") {
            return <EuroIcon/>
        }
    }

    return (
        <>
            <Button startIcon={(showIcon && setIcon())} sx={{
                width: "15vw",
                height: "5vh",
                color: 'grey.700',
                borderColor: 'grey.400',
                paddingLeft: "30px",
                paddingRight: "30px",
                '&:hover': {
                    backgroundColor: '#fff',
                },
            }}
                    variant={"outlined"}
                    onClick={handleClick}
            >
                {/*//TextTransform is set to none to prevent the text from being capitalized*/}
                <Typography style={{ textTransform: "none" }} variant={"h7"}>{label}</Typography>

            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                /*PaperProps={{
                    style: {
                        width: 350,
                    },
                }}*/
            >
                {children}
            </Menu>
        </>
    )
}
EventsPageFilterButton.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
    filter: PropTypes.string,
    setFilter: PropTypes.func,
    icon: PropTypes.string,
    showIcon: PropTypes.bool,
}
export default EventsPageFilterButton;