import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

// eslint-disable-next-line react/prop-types
const Copyright = ({color = 'text.secondary'}) => {
    return (
        <Typography variant="body2" sx={{color: color, mt: 1}}>
            {'Copyright © '}
            <Link href="https://tum.de" sx={{textDecoration: 'none'}}>
                TUMSocial
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
};

export default Copyright;
