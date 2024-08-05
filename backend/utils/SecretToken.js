//Generate JWT
import jwt from "jsonwebtoken";
export const generateJWTToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "180d", //expires in 180 days
  });
};
