import { createContext, useEffect, useState } from "react";
import { getToken } from "../../utils/tokenService";
import axios from "axios";
import PropTypes from "prop-types";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const token = getToken();

  async function loadUser() {
    try {
      const res = await axios.get("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.data) {
        console.log("Result is empty");
      } else {
        setUser(res.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
    };

