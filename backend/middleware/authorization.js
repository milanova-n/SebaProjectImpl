import jwt from "jsonwebtoken";
export const checkAuth = (req, res, next) => {
  let token;

  if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).send({
      error: "Unauthorized",
      message: "No token provided in the request",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;
  req.role = decoded.role;
  next();
  try {
    //Verify token
  } catch (error) {
    return res.status(403).send({
      error: "Unauthorized",
      message: "Failed to authenticate token",
    });
  }
};
