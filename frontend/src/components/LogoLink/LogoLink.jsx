import {Link} from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const LogoLink = ({height}) => {
    return (
        <Link to="/"> {/* Link to StartPage */}
            <img
                src="/Logo.svg"
                alt="Logo"
                style={{height: height, marginRight: '2px'}}
            />
        </Link>
    );
};

export default LogoLink;
