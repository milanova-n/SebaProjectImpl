import { useContext, useEffect, useState } from "react";
import { getToken } from "../../../../utils/tokenService.jsx";
import axios from "axios";
import { Autocomplete, TextField, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import { ErrorContext } from "../../../context/ErrorContext.jsx";

const AddHobbies = () => {
  const [allHobbies, setAllHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const { setErrorMessage } = useContext(ErrorContext);

  const loadAllHobbies = async () => {
    const token = getToken();
    if (!token) {
      return;
    }
    let resAllHobbies;
    try {
      resAllHobbies = await axios.get("http://localhost:8080/api/hobbies/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }
    let resStudentHobbies;
    try {
      resStudentHobbies = await axios.get(
        "http://localhost:8080/api/hobbies/hobbiesFromStudent",
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
    setAllHobbies(resAllHobbies?.data);
    setSelectedHobbies(resStudentHobbies?.data);
  };

  const handleHobbiesChange = async (event, newSelectedHobbies) => {
    const token = getToken();
    const hobbyIds = newSelectedHobbies.map((hobby) => hobby._id);
    try {
      await axios.put(
        "http://localhost:8080/api/hobbies/updateHobbiesForStudent",
        {
          hobbyIds: hobbyIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error changing hobbies:", error);
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }

    setSelectedHobbies(newSelectedHobbies);
  };

  useEffect(() => {
    loadAllHobbies();
  }, []);

  return (
    <>
      <Typography variant={"h4"}>Hobbies</Typography>
      <Autocomplete
        multiple
        id="multiple-tags"
        options={allHobbies}
        getOptionLabel={(option) => option.subCategory}
        value={selectedHobbies}
        onChange={handleHobbiesChange}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        //Render the textfield for the input
        renderInput={(params) => <TextField {...params} variant="outlined" />}
        //Render selected options as chips
        //Value is the selected courses
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...props } = getTagProps({ index });
            return <Chip key={key} label={option.subCategory} {...props} />;
          })
        }
      />
    </>
  );
};
export default AddHobbies;
