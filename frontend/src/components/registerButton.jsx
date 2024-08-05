import React, { useContext } from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import CorporateFareRounded from "@mui/icons-material/CorporateFareRounded";
import { UserContext } from "../context/UserContext.jsx";

const RegisterButton = () => {
  const { user } = useContext(UserContext);

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100dvw",
        position: "fixed",
        bottom: 24,
      }}
    >
      {isEmpty(user) && (
        <ButtonGroup
          color="primary"
          aria-label="Page navigation buttons"
          sx={{
            backgroundColor: "background.default",
          }}
        >
          <Button component={Link} to="/register">
            <SchoolRounded sx={{ fontSize: "20px", mr: 1 }} />
            Register as Student
          </Button>
          <Button component={Link} to="/signUpCompany">
            <CorporateFareRounded sx={{ fontSize: "20px", mr: 1 }} />
            Register as Company
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};

export default RegisterButton;
