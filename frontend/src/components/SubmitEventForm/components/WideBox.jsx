import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import {Grid, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";

const WideBox = ({categoryname, children}) => {
    return(
        <Grid item xs={6}>
        <Stack
        sx={{bgcolor: "#F9F9F9", borderRadius: '16px'}}
        >
        {/*    <Stack sx={{*/}
        {/*        backgroundColor: "rgba(0, 0, 0, 0.5)",*/}
        {/*        backdropFilter: "blur(10px)",*/}
        {/*        border: "4px solid #FFFFFF",*/}
        {/*        borderRadius: "20px",*/}
        {/*        width: "90%",*/}
        {/*    }}*/}
        {/*    spacing={2}*/}
        {/*    >*/}
            <Stack direction="row" sx={{ padding: '20px',marginBottom: 4, justifyContent: 'space-between'}}   >
                <Typography >{categoryname}</Typography>
                {children}
            </Stack>
        </Stack>
        </Grid>
    )
}
WideBox.propTypes = {
    categoryname: PropTypes.string,
    children: PropTypes.node,
}
export default WideBox;