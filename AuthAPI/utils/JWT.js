import jwt from "jsonwebtoken";

const createJWT = function (id) {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

const verifyJWT = function (req, res, next) {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).send({ message: "Access denied." });
  }

  try {
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!verifiedToken) {
      return res.status(400).send({ message: "Invalid token" });
    }
  } catch (error) {
    next(error);
  }
};

export { createJWT, verifyJWT };
