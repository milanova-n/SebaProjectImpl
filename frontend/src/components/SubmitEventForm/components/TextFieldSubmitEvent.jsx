import {TextField} from "@mui/material";
import PropTypes from "prop-types";

const TextFieldSubmitEvent = ({type, label, value, onChange, rows, multiline, fullWidth, style }) => {
    return (
        <TextField
            type={type}
            variant='outlined'
            color='secondary'
            label={label}
            onChange={onChange}
            value={value}
            multiline={multiline}
            rows={rows}
            fullWidth={fullWidth}
            required = {true}
            style = {style}
            sx={{mb: 4}}
            inputProps={{ maxLength: "12" }}
        />
    );
};
TextFieldSubmitEvent.propTypes = {
    type: PropTypes.string,
    label:PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    onChange: PropTypes.func,
    rows: PropTypes.number,
    multiline: PropTypes.bool,
    fullWidth: PropTypes.bool,
    style: PropTypes.object,
};
export default TextFieldSubmitEvent;