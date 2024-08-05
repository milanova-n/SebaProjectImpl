import PropTypes from "prop-types";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import {getToken} from "../../utils/tokenService.jsx";
import SelectCategory from "./SelectCategory.jsx";
import {ErrorContext} from "../context/ErrorContext.jsx";

const SelectSubCategory = ({
  selectedTopCategory,
  setSubCategory,
  selectedCategory,
  setIsOther,
  error,
  setError,
}) => {
  const [subCategories, setSubCategories] = useState([
    { _id: "0", subCategory: "Select a category", topCategory: "" },
  ]);
  const { setErrorMessage } = useContext(ErrorContext);

  const loadSubCategories = useCallback(async () => {
    if (subCategories.length >= 1) {
      const token = getToken();
      let res;
      try {
        res = await axios.get(
          "http://localhost:8080/api/categories/subCategories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              topCategory: selectedTopCategory,
            },
          }
        );
      } catch (error) {
        const errorMessage = error?.response?.data?.message || "Unknown";
        setErrorMessage(errorMessage);
        window.location.href = "/error";
      }
      setSubCategories(res.data);
    }
  }, [selectedTopCategory, subCategories.length]);

    useEffect(() => {
        //Needed for the popup for the text field for other category
        setIsOther(false);
        if (selectedTopCategory !== "Select a Subcategory" && selectedTopCategory !== "" && selectedTopCategory !== "0" /*&& selectedTopCategory !== "667544c9bbbd944a940fc634"*/) {
            loadSubCategories();
            setSubCategory(subCategories[0]._id)
        } else {
            setSubCategories([{_id: "0", subCategory: "Select a Subcategory", topCategory: ""}]);
        }
        //Hard coded value for "other" top category (id is the same as the one in the database)
        //This is needed to show the text field for the other category directly
        if (selectedTopCategory === "667544c9bbbd944a940fc634") {
            setIsOther(true);
        }
    }, [selectedTopCategory, loadSubCategories, setIsOther]);

  return (
    <>
      <SelectCategory
        selectedTopCategory={selectedTopCategory}
        selectedCategories={subCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSubCategory}
        isTopCategory={false}
        setIsOther={setIsOther}
        error={error}
        setError={setError}
      ></SelectCategory>
    </>
  );
};

SelectSubCategory.propTypes = {
    selectedTopCategory: PropTypes.string,
    setSubCategory: PropTypes.func,
    selectedCategory: PropTypes.string,
    setSelectCategoryId: PropTypes.func,
    setIsOther: PropTypes.func,
    error: PropTypes.bool,
    setError: PropTypes.func,
}

export default SelectSubCategory;
