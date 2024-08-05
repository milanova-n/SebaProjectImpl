import PropTypes from "prop-types";
import {Autocomplete, FormControl, FormHelperText, TextField} from "@mui/material";
import {useEffect} from "react";

const SelectCategory = ({
                            selectedTopCategory,
                            selectedCategories,
                            setSelectedCategory,
                            selectedCategory,
                            isTopCategory,
                            setIsOther,
                            error,
                            setError
                        }) => {


    const handleChange = (e, newValue) => {
        let selectedId;
        setError(false);
        // Check if subCategory is an object and has an _id property
        selectedId = newValue._id;
        setSelectedCategory(selectedId);
        checkIfOther(newValue);
    }
    //Check if category is "Other", as the user can add his recommended subcategory
    const checkIfOther = (newValue) => {
        if (!isTopCategory) {
            if (typeof newValue.subCategory === "string" && newValue.subCategory === 'Other' && typeof newValue.subCategory !== 'object') {
                setIsOther(true);
            } else {
                setIsOther(false);
            }
        } else {
            if (newValue.topCategory === 'Other') {
                setIsOther(true);
            } else {
                setIsOther(false);
            }
        }
    }

    //After selecting the Top category, the first subcategory from the is selected as default
    useEffect(() => {
        if (selectedCategories.length > 1) {

            if (selectedCategories[0].subCategory === 'Other') {
                setSelectedCategory(selectedCategories[1]._id);
            } else {
                setSelectedCategory(selectedCategories[0]._id);
            }
            checkIfOther(selectedCategory);

        } else {
            setSelectedCategory('');
        }
    }, [selectedTopCategory, selectedCategories]);

    return (
        <FormControl sx={{m: 1, width: 300}} error={error}>
            <Autocomplete
                value={selectedCategories.find(category => {
                    return category._id === selectedCategory;

                }) || selectedCategories[0]}
                onChange={handleChange}
                options={selectedCategories}

                getOptionLabel={(option) => {
                    // Check if subCategory is an object and has a courseName
                    if (typeof option.subCategory === 'object' && option.subCategory.courseName) {
                        // Format the label to include courseName and courseIDs
                        const courseName = option.subCategory.courseName;
                        const courseIDs = option.subCategory.courseIDs.join(', ');
                        return `${courseName} (${courseIDs})`;
                    } else {
                        // If subCategory is not an object
                        // Check if it is a topCategory
                        if (isTopCategory) {
                            return option.topCategory;
                        } else {
                            return option.subCategory;
                        }
                    }
                }}
                renderInput={(params) => <TextField {...params} variant="outlined"/>}
            />
            {error && <FormHelperText>Please select a category</FormHelperText>}
        </FormControl>
    );
};
SelectCategory.propTypes = {
    isTopCategory: PropTypes.bool,
    selectedCategories: PropTypes.array,
    setSelectedCategory: PropTypes.func,
    selectedCategory: PropTypes.string,
    setIsOther: PropTypes.func,
    selectedTopCategory: PropTypes.string,
    error: PropTypes.bool,
    setError: PropTypes.func
}
export default SelectCategory;