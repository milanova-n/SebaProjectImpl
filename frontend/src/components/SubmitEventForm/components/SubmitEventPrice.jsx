import PropTypes from "prop-types";
import {InputAdornment, TextField} from "@mui/material";
import {useState} from "react";

const SubmitEventPrice = ({eventPrice, setEventPrice, error, setError}) => {

    const [errorMessage, setErrorMessage] = useState("Please select a valid number")


    const handlePriceChange = (e) => {
        setError(false)

        if ((e.target.value !== "+" && e.target.value !== "-") || e.target.value === "") {
            setEventPrice(e.target.value)
        } else {
            setEventPrice("0")
        }
    }


    return (<TextField
        type="number"
        onChange={e => handlePriceChange(e)}
        value={eventPrice}
        rows={1}
        width={200}
        error={error}
        helperText={error ? errorMessage : ""}
        style={{width: 100}}
        InputProps={{
            inputProps: {min: 0},
            startAdornment: <InputAdornment position="start">€</InputAdornment>,

        }}

    />)


}
SubmitEventPrice.propTypes = {
    eventPrice: PropTypes.string,
    setEventPrice: PropTypes.func,
    error: PropTypes.bool,
    setError: PropTypes.func,
}
export default SubmitEventPrice;