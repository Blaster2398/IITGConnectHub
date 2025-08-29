import Role from "../models/Role.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";
import mongoose from "mongoose";

// MODIFIED: Prevent admins from applying and check if already applied
export const applyToRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return next(createError(404, "User not found"));

    // 1. Prevent admins from applying
    if (user.role === 'BoardAdmin' || user.role === 'SuperAdmin') {
        return next(createError(403, "Administrators cannot apply for roles."));
    }

    const role = await Role.findById(req.params.id);
    if (!role) return next(createError(404, "Role not found"));

    // 2. Check if user has already applied
    const hasApplied = role.applicants.some(app => app.userId === req.body.userId);
    if (hasApplied) return next(createError(400, "You have already applied for this role."));

    const newApplicant = {
      userId: req.body.userId,
      status: 'Applied'
    };

    await Role.findByIdAndUpdate(req.params.id, {
      $push: { applicants: newApplicant }
    });

    res.status(200).json("Application submitted successfully.");
  } catch (err) {
    next(err);
  }
};

// This function now contains the complex logic for accepting/rejecting.
export const updateApplicationStatus = async (req, res, next) => {
  const { status } = req.body;
  const { roleid, userid } = req.params;

  try {
    if (status === "Rejected") {
      // 1. If rejected, simply remove the applicant from the array.
      await Role.findByIdAndUpdate(roleid, {
        $pull: { applicants: { userId: userid } }
      });
      return res.status(200).json("Applicant rejected and removed.");
    }

    if (status === "Accepted") {
      // 2. If accepted, update status and decrement available positions.
      const updatedRole = await Role.findOneAndUpdate(
        { _id: roleid, "applicants.userId": userid },
        {
          $set: { "applicants.$.status": "Accepted" },
          $inc: { positionsAvailable: -1 }
        },
        { new: true } // Return the document after update
      );

      // 3. Check if all positions are now filled.
      if (updatedRole.positionsAvailable <= 0) {
        // Auto-reject all other non-accepted applicants.
        await Role.findByIdAndUpdate(roleid, {
          $pull: { applicants: { status: { $ne: "Accepted" } } }
        });
      }
    } else {
      // For other statuses like "Interviewing"
      await Role.updateOne(
        { _id: roleid, "applicants.userId": userid },
        { $set: { "applicants.$.status": status } }
      );
    }
    res.status(200).json("Application status updated.");
  } catch (err) {
    next(err);
  }
};

export const increaseOpenings = async (req, res, next) => {
    try {
        await Role.findByIdAndUpdate(req.params.id, {
            $inc: { positionsAvailable: 1, originalPositions: 1 }
        });
        res.status(200).json("Openings increased.");
    } catch (err) {
        next(err);
    }
};

// NEW: Function to decrease the number of available positions.
export const decreaseOpenings = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return next(createError(404, "Role not found"));

        // Prevent decreasing if no positions are available
        if (role.positionsAvailable <= 0) {
            return next(createError(400, "Cannot decrease openings below zero."));
        }
  
        await Role.findByIdAndUpdate(req.params.id, {
            $inc: { positionsAvailable: -1, originalPositions: -1 }
        });
        res.status(200).json("Openings decreased.");
    } catch (err) {
        next(err);
    }
};


export const getRoleApplicants = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return next(createError(404, "Role not found"));

        const applicantUserIds = role.applicants.map(app => app.userId)
            .filter(id => mongoose.Types.ObjectId.isValid(id));

        const users = await User.find({ '_id': { $in: applicantUserIds } }).select("-password");
        const usersMap = new Map(users.map(user => [user._id.toString(), user._doc]));

        const allApplicants = role.applicants.map(applicant => {
            const user = usersMap.get(applicant.userId);
            if (!user) return null;
            return {
                ...user,
                applicationStatus: applicant.status
            };
        }).filter(Boolean);

        res.status(200).json(allApplicants);
    } catch (err) {
        next(err);
    }
};

// --- Other existing functions (create, delete, etc.) ---
export const createRole = async (req, res, next) => {
  const teamId = req.params.teamid;
  // Make sure originalPositions is set when creating
  const newRole = new Role({
    ...req.body,
    originalPositions: req.body.positionsAvailable 
  });

  try {
    const savedRole = await newRole.save();
    try {
      await Team.findByIdAndUpdate(teamId, {
        $push: { roles: savedRole._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRole);
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req, res, next) => {
  const teamId = req.params.teamid;
  try {
    await Role.findByIdAndDelete(req.params.id);
    try {
      await Team.findByIdAndUpdate(teamId, {
        $pull: { roles: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Role has been deleted.");
  } catch (err) {
    next(err);
  }
};
