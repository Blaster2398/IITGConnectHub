import Team from "../models/Team.js";
import Role from "../models/Role.js";
import Setting from "../models/Setting.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

// NEW: Get all teams managed by the currently logged-in admin
export const getManagedTeams = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found."));
    }

    let teams;
    if (user.role === "SuperAdmin") {
      // SuperAdmin gets all teams
      teams = await Team.find();
    } else if (user.role === "BoardAdmin") {
      // BoardAdmin gets only teams from their board
      teams = await Team.find({ board: user.adminOf });
    } else {
      // Students are not authorized to access this
      return next(createError(403, "You are not authorized to view this page."));
    }
    res.status(200).json(teams);
  } catch (err) {
    next(err);
  }
};


// MODIFIED: Enhanced to prevent duplicates and set board correctly
export const createTeam = async (req, res, next) => {
    const currentUser = req.user;
    const newTeamData = req.body;

    try {
        const user = await User.findById(currentUser.id);
        if (!user) return next(createError(404, "User not found"));

        // For BoardAdmins, force the team's board to be their own board.
        // For SuperAdmins, allow them to set the board from the request body.
        const board = user.role === 'BoardAdmin' ? user.adminOf : newTeamData.board;
        if (!board) {
            return next(createError(400, "Board must be specified to create a team."));
        }
        
        // Check for duplicate team name within the same board
        const existingTeam = await Team.findOne({ name: newTeamData.name, board: board });
        if (existingTeam) {
            return next(createError(409, `A team named '${newTeamData.name}' already exists in the ${board} board.`));
        }

        const newTeam = new Team({ ...newTeamData, board: board });
        const savedTeam = await newTeam.save();
        res.status(200).json(savedTeam);
    } catch (err) {
        next(err);
    }
};

export const updateTeam = async (req, res, next) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTeam);
  } catch (err) {
    next(err);
  }
};

// MODIFIED: Requires board-specific deletion key and deletes associated roles
export const deleteTeam = async (req, res, next) => {
  const teamId = req.params.id;
  const { deletionKey } = req.body;

  try {
    if (!deletionKey) {
        return next(createError(400, "Deletion key is required."));
    }

    const team = await Team.findById(teamId);
    if (!team) return next(createError(404, "Team not found."));

    const settings = await Setting.findOne({ type: 'passkeys' });
    if (!settings) return next(createError(500, "Security settings not configured."));
    
    const correctKey = settings.deletion[team.board];
    if (correctKey !== deletionKey) {
        return next(createError(401, "Invalid Deletion Key for this board."));
    }

    // If key is correct, proceed with deletion
    // 1. Delete all roles associated with the team
    await Role.deleteMany({ _id: { $in: team.roles } });

    // 2. Delete the team itself
    await Team.findByIdAndDelete(teamId);
    
    res.status(200).json("Team and all its associated roles have been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    res.status(200).json(team);
  } catch (err) {
    next(err);
  }
};
export const getTeams = async (req, res, next) => {
  const { minAvailability, tag, ...others } = req.query;

  try {
    // Base query filters by category (case-insensitive)
    const query = {};
    if (others.category) {
      query.category = { $regex: new RegExp(others.category, "i") };
    }
    if (tag) {
      query.tags = tag;
    }

    let teams = await Team.find(query).populate('roles');

    if (minAvailability > 0) {
      teams = teams.filter(team => {
        const totalAvailable = team.roles.reduce((sum, role) => sum + role.positionsAvailable, 0);
        return totalAvailable >= minAvailability;
      });
    }

    res.status(200).json(teams);
  } catch (err) {
    next(err);
  }
};
export const countByCategory = async (req, res, next) => {
  const categories = req.query.categories.split(",");
  try {
    const list = await Promise.all(
      categories.map((category) => {
        return Team.countDocuments({ category: category });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByBoard = async (req, res, next) => {
  try {
    const technicalCount = await Team.countDocuments({ board: "Technical" });
    const culturalCount = await Team.countDocuments({ board: "Cultural" });
    const welfareCount = await Team.countDocuments({ board: "Welfare" });
    const sportsCount = await Team.countDocuments({ board: "Sports" });
    const habCount = await Team.countDocuments({ board: "HAB" });

    res.status(200).json([
      { board: "Technical", count: technicalCount },
      { board: "Cultural", count: culturalCount },
      { board: "Welfare", count: welfareCount },
      { board: "Sports", count: sportsCount },
      { board: "HAB", count: habCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getTeamRoles = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    const list = await Promise.all(
      team.roles.map((role) => {
        return Role.findById(role);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};

