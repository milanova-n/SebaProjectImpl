import { Chip, Stack, TextField, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import { useState } from "react";

const AddCoursesHobbies = ({ label }) => {
  const [items, setItems] = useState([]);
  const defaultTextValue = `Your ${label} are ...`;

  const handleTextInput = (newItem) => {
    setItems([...items, newItem]);
    return defaultTextValue;
  };

  const handleDelete = (index) => {
    const updatedItems = items.filter((item, indexItem) => indexItem !== index);
    setItems(updatedItems);
  };

  return (
    <Stack>
      <Stack direction="row" spacing={2} sx={{ border: "2px solid " }}>
        {label === "Courses" ? <SchoolIcon /> : <SportsBaseballIcon />}
        <Typography>{label}</Typography>
      </Stack>
      <Stack direction="row" flexWrap="wrap" sx={{ gap: "2px" }}>
        {items &&
          items?.map((item, index) => (
            <Chip
              key={index}
              label={item}
              color="primary"
              size="small"
              onDelete={() => handleDelete(index)}
            />
          ))}
      </Stack>
      <TextField
        label={defaultTextValue}
        variant="standard"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleTextInput(event.target.value);
            event.target.value = ""; // Reset the input field value
          }
        }}
      />
    </Stack>
  );
};

export default AddCoursesHobbies;
