import PropTypes from "prop-types";
import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getToken } from "../../../../utils/tokenService.jsx";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import {Checkbox, Collapse, ListItemButton, ListSubheader, Stack} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { UserContext } from "../../../context/UserContext.jsx";
import { ErrorContext } from "../../../context/ErrorContext.jsx";

const EventsPageCategoriesBar = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const [subCategories, setSubCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [notUserCourses, setNotUserCourses] = useState([]);
  const [openUserCourses, setOpenUserCourses] = useState(false);
  const [openNotUserCourses, setOpenNotUserCourses] = useState(false);
  const { user } = useContext(UserContext);
  const { setErrorMessage } = useContext(ErrorContext);
  const token = useState(getToken());
  //Fetch all categories from the backend
  const loadAllCategories = useCallback(async () => {
    const token = getToken();
    const role = user.role;
    let resTopCategory;
    try {
      resTopCategory = await axios.get(
        `http://localhost:8080/api/categories/topCategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userRole: role,
          },
        }
      );
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Unknown";
      setErrorMessage(errorMessage);
      window.location.href = "/error";
    }
    let resSubCategory;
    if (token !== null && user.role === "student") {
      try {
        resSubCategory = await axios.get(
          "http://localhost:8080/api/categories/subCategories/withoutCourses",
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
    } else {
      try {
        resSubCategory = await axios.get(
          "http://localhost:8080/api/categories/subCategories/all",
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
    }

    setTopCategories(resTopCategory.data);
    setSubCategories(resSubCategory.data);
  }, []);

  //Fetch all courses from the backend
  const loadUserCourses = useCallback(async () => {
    const token = getToken();

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

    // Sort userCourses by courseName
    const sortedUserCourses = resStudentCourses?.data.sort((a, b) =>
      a.subCategory.courseName.localeCompare(b.subCategory.courseName)
    );

    setUserCourses(sortedUserCourses);
    let resOtherCourses;
    try {
      resOtherCourses = await axios.get(
        "http://localhost:8080/api/courses/otherCoursesFromStudent",
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

    // Sort notUserCourses by courseName
    const sortedNotUserCourses = resOtherCourses?.data.sort((a, b) =>
      a.subCategory.courseName.localeCompare(b.subCategory.courseName)
    );
    setNotUserCourses(sortedNotUserCourses);
  }, []);

  /*    const loadAllCourses = useCallback(async () => {
            const token = getToken();
            const resCourses = await axios.get("http://localhost:8080/api/courses/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            subCategories.map((subCategory) => {
                const courses = resCourses.data.filter((course) => {
                        if (course.subCategory === subCategory._id) {
                            return course;
                        }
                    }
                );
                subCategory.courses = courses;
            });

        })*/

  useEffect(() => {
    const loadData = async () => {
      await loadAllCategories();
    };

    loadData();
  }, [loadAllCategories, loadUserCourses]);

  useEffect(() => {
    const loadUserData = async () => {
      if (getToken() !== null && user.role !== undefined) {
        if (user.role === "student") {
          console.log("load user courses");
          loadUserCourses();
        }
      }
    };
    loadUserData();
  }, [loadUserCourses, user.role]);

  const [open, setOpen] = useState({});

  //Function to handle the opening and closing of the categories
  const handleClick = (id) => {
    if (id === "userCourses" || id === "notUserCourses") {
      if (id === "userCourses") {
        setOpenUserCourses(!openUserCourses);
      } else {
        setOpenNotUserCourses(!openNotUserCourses);
      }
    } else {
      setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  //Function to handle the selection of categories
  const handleToggle = (value) => () => {
    const currentIndex = selectedCategories.indexOf(value);
    let newSelectedCategories = [...selectedCategories];

    //If the category is not selected, add it to the list of selected categories
    if (currentIndex === -1) {
      newSelectedCategories.push(value);
    } else {
      //If the category is selected, remove it from the list of selected categories
      newSelectedCategories.splice(currentIndex, 1);
    }
    setSelectedCategories(newSelectedCategories);
  };

  return (
    <List
      subheader={
        <ListSubheader component="div" id="title" sx={{ fontSize: "1.4em" }}>
          Categories
        </ListSubheader>
      }
    >
      {topCategories.map((topCategory) => (
        <div key={topCategory._id}>
          <ListItem onClick={() => handleClick(topCategory._id)}>
            <ListItemText primary={topCategory.topCategory} />
            {open[topCategory._id] ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open[topCategory._id]} timeout="auto" unmountOnExit>
            {/*
                        Need to check if it is a Study Group as we need the two sublists my courses and others
*/}
            {topCategory.topCategory === "Study Group" &&
            token !== null &&
            token[0] !== null &&
            user.role === "student" ? (
              <>
                {/*
                                The iteration on the user's courses
*/}
                <ListItemButton onClick={() => handleClick("userCourses")}>
                  <ListItemText primary="My Courses" />
                  {openUserCourses ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openUserCourses} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {userCourses.map((subcategory) => (
                      <ListItemButton
                        key={subcategory._id}
                        onClick={handleToggle(subcategory._id)}
                      >
                        <ListItemText
                          primary={subcategory.subCategory.courseName}
                        />
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={
                              selectedCategories.indexOf(subcategory._id) !== -1
                            }
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": subcategory._id }}
                          />
                        </ListItemIcon>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>

                {/*
                                The iteration over the courses that not are from the user
*/}
                <ListItemButton onClick={() => handleClick("notUserCourses")}>
                  <ListItemText primary="Other" />
                  {openNotUserCourses ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openNotUserCourses} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {notUserCourses.map((subCategory) => (
                      <ListItemButton
                        key={subCategory._id}
                        onClick={handleToggle(subCategory._id)}
                      >
                        <ListItemText
                          primary={subCategory.subCategory.courseName}
                        />
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={
                              selectedCategories.indexOf(subCategory._id) !== -1
                            }
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": subCategory._id }}
                          />
                        </ListItemIcon>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              /*
                                                        Else the "usual" List we need, e.g. Business, Sport&Fitness...
                            */
                            <List component="div" disablePadding>
                                {subCategories
                                    .filter((subCategory) => subCategory.topCategory === topCategory._id)
                                    .map((subCategory) => (
                                        <ListItemButton key={subCategory._id} onClick={handleToggle(subCategory._id)}>
                                            <ListItemText sx={{paddingRight:"10px"}} primary={typeof subCategory.subCategory === "object"?subCategory.subCategory.courseName: subCategory.subCategory}/>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={selectedCategories.indexOf(subCategory._id) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{'aria-labelledby': subCategory._id}}
                                                />
                                                </ListItemIcon>


                                        </ListItemButton>
                                    ))}
                            </List>
                        )}


                    </Collapse>
                </div>
            ))}
        </List>
    );
}


EventsPageCategoriesBar.propTypes = {
  selectedCategories: PropTypes.array,
  setSelectedCategories: PropTypes.func,
};
export default EventsPageCategoriesBar;
