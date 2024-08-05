import {Link} from 'react-router-dom';
import {CardMedia} from "@mui/material";

// eslint-disable-next-line react/prop-types
const LogoLink_medium = ({height}) => {
    return (
        <Link to="/"> {/* Link to StartPage */}
            <img
                src="/Logo_medium.png"
                alt="Logo"
                style={{height: height, marginRight: '2px', marginTop:'6px', borderRadius:"10px"}}
            />
        </Link>
    );
};

export default LogoLink_medium;
