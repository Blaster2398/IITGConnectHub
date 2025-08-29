import Setting from "../models/Setting.js";
import { createError } from "../utils/error.js";

// Controller to get all passkeys
export const getKeys = async (req, res, next) => {
  try {
    // There should only be one document in the settings collection
    const settings = await Setting.findOne({ type: "passkeys" });
    if (!settings) {
      return next(createError(404, "Settings document not found."));
    }
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
};

// Controller to update all passkeys
export const updateKeys = async (req, res, next) => {
  try {
    const updatedSettings = await Setting.findOneAndUpdate(
      { type: "passkeys" },
      {
        $set: {
          registration: req.body.registration,
          deletion: req.body.deletion,
        },
      },
      { new: true, upsert: true } // upsert: true will create the document if it doesn't exist
    );
    res.status(200).json(updatedSettings);
  } catch (err) {
    next(err);
  }
};

