import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import PropTypes from "prop-types";
import {useEffect, useMemo} from "react";
import PlaceIcon from '@mui/icons-material/Place';
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";

const EventsPageLocationPicker = ({categoryType, onCategoryChange}) => {

    //UseMemo is used to prevent the optionsLocation from being recreated on every render
    const optionsLocation = useMemo(() => ["München", "Garching bei München", "Heilbronn", "Straubing", "Weihenstephan"], []);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
        },
        transformOrigin: {
            vertical: "top",
            horizontal: "left"
        },
        getContentAnchorEl: null

    };
    const [category, setCategory] = React.useState([]);
    const [categories, setCategories] = React.useState([]);

    const handleDelete = (categoryToDelete) => () => {
        const newCategory = category.filter((category) => category !== categoryToDelete);
        setCategory(newCategory);
        onCategoryChange(newCategory); // Assuming you want to propagate changes up
    };

    useEffect(() => {
        setCategories(optionsLocation); // Update state

    }, [categoryType, optionsLocation]);


    const handleChange = (event) => {
        const {target: {value}} = event;
        setCategory(value);
        onCategoryChange(value);
    };

    return (
        <div>
            <FormControl size={"small"}>
                <InputLabel id="multiple-chip-label">
                    <Stack direction={"row"} alignItems={"center"} sx={{display: 'flex', width: "auto"}}>
                        <PlaceIcon/>
                        <Typography variant={"h8"}>TUM Location</Typography>
                    </Stack>
                </InputLabel>
                <Select
                    labelId="multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={category}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Category"/>}
                    renderValue={(selected) => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            {selected.map((value) => (
                                <Chip
                                    key={value}
                                    label={value}
                                    onDelete={handleDelete(value)}
                                    onMouseDown={(event) => {
                                        event.stopPropagation();
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                    sx={{
                        width: "13vw",
                        height: "5vh",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1C75BC"
                        },
                        "& .MuiFormLabel-root": {
                            display: "flex",
                            alignItems: "center",
                            "& .myIcon": {
                                paddingLeft: "8px",
                                order: 999
                            }
                        }


                    }}

                >
                    {categories.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

EventsPageLocationPicker.propTypes = {
    categoryType: PropTypes.string.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
};

export default EventsPageLocationPicker