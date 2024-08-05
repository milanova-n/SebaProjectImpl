import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import InfoIcon from '@mui/icons-material/Info';
import PropTypes from "prop-types";
import {Divider, Stack} from "@mui/material";

const SimpleBottomNavigation = ({navValue, setNavValue}) => {


    return (
        <Stack sx={{ width: "60vw"}}>
            <BottomNavigation
                showLabels

                value={navValue}
                onChange={(event, newValue) => {
                    setNavValue(newValue);
                }}
            >
                <BottomNavigationAction label="Details" value={navValue} onClick={() => setNavValue(0)}
                                        icon={<InfoIcon/>}
                />
                <BottomNavigationAction label="Map" value={navValue} onClick={() => setNavValue(1)}
                                        icon={<LocationOnIcon/>}/>
                <BottomNavigationAction label="Chat" value={navValue} onClick={() => setNavValue(2)}
                                        icon={<ChatIcon/>}/>
                <BottomNavigationAction label="Participants" value={navValue} onClick={() => setNavValue(4)}
                                        icon={<PersonIcon/>}/>

            </BottomNavigation>
            <Divider style={{backgroundColor:'rgb(29,117,188)'}}/>
        </Stack>
    );
}
SimpleBottomNavigation.propTypes = {
    navValue: PropTypes.number,
    setNavValue: PropTypes.func
}
export default SimpleBottomNavigation;


