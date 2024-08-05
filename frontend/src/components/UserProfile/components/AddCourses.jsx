import { Autocomplete, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../../utils/tokenService.jsx";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { ErrorContext } from "../../../context/ErrorContext.jsx";

const AddCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const { setErrorMessage } = useContext(ErrorContext);

  const loadAllCourses = async () => {
    const token = getToken();
    if (!token) {
      return;
    }
    let resAllCourses;
    try {
      resAllCourses = await axios.get("http://localhost:8080/api/courses/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }

    let resStudentCourses;
    try {
      resStudentCourses = await axios.get(
        "http://localhost:8080/api/courses/coursesFromStudent",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }
    setCourses(resAllCourses?.data);
    setSelectedCourses(resStudentCourses?.data);
  };

  const handleCourseChange = async (event, newSelectedCourses) => {
    const token = getToken();
    const courseIds = newSelectedCourses?.map((course) => course._id);
    try {
      await axios.put(
        "http://localhost:8080/api/courses/updateCoursesForStudent",
        {
          courseIds: courseIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error changing courses:", error);
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }
    setSelectedCourses(newSelectedCourses);
  };

  useEffect(() => {
    loadAllCourses();
  }, []);

  return (
    <Box width={"auto"}>
      <Typography variant={"h4"}>Courses</Typography>
      <Autocomplete
        multiple
        id="multiple-tags"
        options={courses}
        getOptionLabel={(option) => option.subCategory.courseName}
        value={selectedCourses}
        onChange={handleCourseChange}
        isOptionEqualToValue={(option, value) =>
          option.subCategory._id === value.subCategory._id
        }
        //Render the textfield for the input
        renderInput={(params) => <TextField {...params} variant="outlined" />}
        //Render selected options as chips
        //Value is the selected courses
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...props } = getTagProps({ index });
            return (
              <Chip
                key={key}
                label={option.subCategory.courseName}
                {...props}
              />
            );
          })
        }
      />
    </Box>
  );
};

export default AddCourses;
