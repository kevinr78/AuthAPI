import UserEntity from "../../models/UserEntity.js";
import bcrypt from "bcryptjs";
import { verifyJWT, createJWT } from "../../utils/JWT.js";

const loginController = async function (req, res, next) {
  const { email, password } = req.body;
  let err, errStatus, errMsg;
  errMsg = "Email and password are required";
  try {
    if (email === "" || password === "") {
      err = new Error(errMsg);
      err.status = 400;
      throw err;
    }

    const { ok, message, data } = validateUserData(email, password);

    if (!ok) {
      err = new Error(message);
      err.status = 400;
      throw err;
    }

    const doesUserExist = await UserEntity.findOne({
      email: data.trimmedEmail,
    });

    if (!doesUserExist) {
      errMsg = "Email does not exists";
      err = new Error(errMsg);
      err.status = 400;
      throw err;
    }
    console.log(doesUserExist);
    const comparePasswords = await bcrypt.compare(
      password,
      doesUserExist.password
    );

    if (!comparePasswords) {
      errMsg = "Passwords do not match";
      err = new Error(errMsg);
      err.status = 400;
      throw err;
    }
    const token = createJWT(doesUserExist._id);

    return res
      .status(200)
      .json({ ok: true, message: "User Logged in Successfully", token });
  } catch (error) {
    next(error);
  }
};

const registerController = async function (req, res, next) {
  const { email, password } = req.body;
  let err, errStatus, errMsg;
  errMsg = "Email and password are required";
  try {
    if (email === "" || password === "") {
      err = new Error(errMsg);
      err.status = 400;
      throw err;
    }

    const { ok, message, data } = validateUserData(email, password);

    if (!ok) {
      err = new Error(message);
      err.status = 400;
      throw err;
    }

    const doesEmailExist = await UserEntity.findOne({
      email: data.trimmedEmail,
    });

    if (doesEmailExist) {
      errMsg = "Email Already Exists";
      err = new Error(errMsg);
      err.status = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.trimmedPassword, salt);

    const createdUser = new UserEntity({
      email: data.trimmedEmail,
      password: hashedPassword,
    });

    try {
      const newUser = await createdUser.save();
      console.log(newUser);
      const token = createJWT(newUser._id);
      return res
        .status(201)
        .json({ message: "User created Successfully", ok: true, token });
    } catch (error) {
      errMsg = "Error while creating user";
      err = new Error(errMsg);
      err.status = 400;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

function validateUserData(email, password) {
  let trimmedEmail, trimmedPassword;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  trimmedEmail = email.trim();
  trimmedPassword = password.trim();
  if (trimmedEmail === "" || trimmedPassword === "") {
    return {
      ok: false,
      message: "Email and password are required",
      data: null,
    };
  }

  if (!trimmedEmail.match(emailRegex)) {
    return {
      ok: false,
      message: "Invalid Email",
      data: null,
    };
  }

  return {
    ok: true,
    message: "Validated successfully",
    data: { trimmedEmail, trimmedPassword },
  };
}

export { loginController, registerController };
