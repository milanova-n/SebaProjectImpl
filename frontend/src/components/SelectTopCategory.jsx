import PropTypes from "prop-types";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/tokenService.jsx";
import SelectCategory from "./SelectCategory.jsx";
import { UserContext } from "../context/UserContext.jsx";
import { ErrorContext } from "../context/ErrorContext.jsx";

const SelectTopCategory = ({
  setEventTopCategory,
  selectedTopCategory,
  setIsOther,
  error,
  setError,
}) => {
  const [topCategories, setTopCategories] = useState([
    { _id: "0", topCategory: "Select a category" },
  ]);
  const { user } = useContext(UserContext);
  const { setErrorMessage } = useContext(ErrorContext);

  const loadTopCategories = useCallback(async () => {
    if (
      topCategories.length === 1 &&
      selectedTopCategory !== "Select a category"
    ) {
      const token = getToken();
      let res;
      try {
        res = await axios.get(
          "http://localhost:8080/api/categories/topCategories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              userRole: user.role,
            },
          }
        );
      } catch (error) {
        const errorMessage = error?.response?.data?.message || "Unknown";
        setErrorMessage(errorMessage);
        window.location.href = "/error";
      }
      if (res) {
        setTopCategories([...topCategories, ...res.data]);
      }
    }
  }, []);


  useEffect(() => {
    if (user._id !== undefined) {
      loadTopCategories();
    }
  }, [loadTopCategories, user._id]);

  return (
    <>
      <SelectCategory
        selectedCategories={topCategories}
        setIsOther={setIsOther}
        setSelectedCategory={setEventTopCategory}
        selectedCategory={selectedTopCategory}
        isTopCategory={true}
        error={error}
        setError={setError}
      />
    </>
  );
};

SelectTopCategory.propTypes = {
    setEventTopCategory: PropTypes.func,
    selectedTopCategory: PropTypes.string,
    setIsOther: PropTypes.func,
    error: PropTypes.bool,
    setError: PropTypes.func,
};

export default SelectTopCategory;
