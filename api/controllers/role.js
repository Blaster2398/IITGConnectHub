import Role from "../models/Role.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";
import mongoose from "mongoose";

export const applyToRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return next(createError(404, "User not found"));

    if (user.role === 'BoardAdmin' || user.role === 'SuperAdmin') {
        return next(createError(403, "Administrators cannot apply for roles."));
    }

    const role = await Role.findById(req.params.id);
    if (!role) return next(createError(404, "Role not found"));
    
    // SERVER-SIDE CHECK: Prevent applying if no positions are available
    if (role.positionsAvailable <= 0) {
      return next(createError(400, "No positions available for this role."));
    }

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

export const updateApplicationStatus = async (req, res, next) => {
  const { status } = req.body;
  const { roleid, userid } = req.params;

  try {
    const role = await Role.findById(roleid);
    if (!role) return next(createError(404, "Role not found."));

    const applicant = role.applicants.find(app => app.userId === userid);
    if (!applicant) return next(createError(404, "Applicant not found in this role."));
    
    const wasAccepted = applicant.status === "Accepted";

    if (status === "Rejected") {
      // If they were previously accepted, increment positions back.
      const update = wasAccepted
        ? { $pull: { applicants: { userId: userid } }, $inc: { positionsAvailable: 1 } }
        : { $pull: { applicants: { userId: userid } } };
      
      await Role.findByIdAndUpdate(roleid, update);
      return res.status(200).json("Applicant rejected and removed.");
    }

    if (status === "Accepted") {
      // Only allow acceptance if positions are available and they weren't already accepted.
      if (role.positionsAvailable <= 0 && !wasAccepted) {
        return next(createError(400, "Cannot accept applicant, no positions available."));
      }

      const update = wasAccepted 
        ? { $set: { "applicants.$.status": "Accepted" } }
        : { $set: { "applicants.$.status": "Accepted" }, $inc: { positionsAvailable: -1 } };

      const updatedRole = await Role.findOneAndUpdate(
        { _id: roleid, "applicants.userId": userid },
        update,
        { new: true }
      );

      if (updatedRole.positionsAvailable <= 0) {
        await Role.findByIdAndUpdate(roleid, {
          $pull: { applicants: { status: { $ne: "Accepted" } } }
        });
      }
    } else {
      // For any other status change like "Interviewing"
      const update = wasAccepted
        ? { $set: { "applicants.$.status": status }, $inc: { positionsAvailable: 1 } }
        : { $set: { "applicants.$.status": status } };
        
      await Role.updateOne({ _id: roleid, "applicants.userId": userid }, update);
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

export const decreaseOpenings = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return next(createError(404, "Role not found"));

        if (role.positionsAvailable <= 0) {
            return next(createError(400, "Cannot decrease openings below zero."));
        }

        const acceptedCount = role.applicants.filter(app => app.status === 'Accepted').length;
        if (role.originalPositions - 1 < acceptedCount) {
          return next(createError(400, "Cannot decrease openings below the number of accepted applicants."));
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

export const createRole = async (req, res, next) => {
  const teamId = req.params.teamid;
  const newRoleData = {
    ...req.body,
    originalPositions: req.body.positionsAvailable 
  };
  const newRole = new Role(newRoleData);

  try {
    const savedRole = await newRole.save();
    try {
      await Team.findByIdAndUpdate(teamId, {
        $push: { roles: savedRole._id },
      });
    } catch (err) {
      await Role.findByIdAndDelete(savedRole._id);
      return next(createError(500, "Failed to associate role with team."));
    }
    res.status(200).json(savedRole);
  } catch (err) {
    next(err);
  }
};

// NEW: Function to update the details of an existing role.
export const updateRole = async (req, res, next) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRole);
  } catch (err) {
    next(err);
  }
};


export const deleteRole = async (req, res, next) => {
  const { teamid, id } = req.params;
  try {
    await Team.findByIdAndUpdate(teamid, {
      $pull: { roles: id },
    });
    
    await Role.findByIdAndDelete(id);
    
    res.status(200).json("Role has been successfully deleted.");
  } catch (err) {
    next(err);
  }
};

