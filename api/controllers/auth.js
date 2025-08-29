import User from "../models/User.js";
import Setting from "../models/Setting.js"; // IMPORT SETTING MODEL
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

// MODIFIED: This function now handles admin registration with passkeys.
export const register = async (req, res, next) => {
  try {
    const { isAdminRegistration, board, adminKey, ...userDetails } = req.body;

    if (isAdminRegistration) {
      // Logic for Admin Registration
      if (!board || !adminKey) {
        return next(createError(400, "Board selection and admin key are required for admin registration."));
      }

      const settings = await Setting.findOne({ type: "passkeys" });
      if (!settings) {
        return next(createError(500, "Security settings are not configured. Please contact the SuperAdmin."));
      }

      const correctKey = settings.registration[board];
      if (!correctKey || adminKey !== correctKey) {
        return next(createError(401, "Invalid Admin Registration Key for the selected board."));
      }

      // If key is correct, proceed to create a BoardAdmin user
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(userDetails.password, salt);

      const newUser = new User({
        ...userDetails,
        password: hash,
        role: "BoardAdmin",
        adminOf: board,
      });

      await newUser.save();
      res.status(200).send("BoardAdmin user has been created successfully.");

    } else {
      // Logic for Standard Student Registration
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const newUser = new User({
        ...req.body,
        password: hash,
      });

      await newUser.save();
      res.status(200).send("Student user has been created.");
    }
  } catch (err) {
    // Catch duplicate username/email errors from MongoDB
    if (err.code === 11000) {
      return next(createError(409, `An account with that ${Object.keys(err.keyValue)[0]} already exists.`));
    }
    next(err);
  }
};


export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT
    );

    const { password, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails } });
  } catch (err)
  {
    next(err);
  }
};

