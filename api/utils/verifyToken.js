import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import Team from "../models/Team.js";
import Role from "../models/Role.js";
import User from "../models/User.js";

// Middleware 1: Checks if a valid token exists and sets req.user
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user; // Set user payload on the request object
    next(); // Pass control to the next middleware
  });
};

// Middleware 2: Checks if the user is the correct user or an admin
// This MUST run AFTER verifyToken
export const verifyUser = (req, res, next) => {
  if (req.user.id === req.params.id || req.user.role === "SuperAdmin" || req.user.role === "BoardAdmin") {
    next();
  } else {
    return next(createError(403, "You are not authorized!"));
  }
};

// Middleware 3: Checks if the user is a SuperAdmin
// This MUST run AFTER verifyToken
export const verifySuperAdmin = (req, res, next) => {
  if (req.user.role === "SuperAdmin") {
    next();
  } else {
    return next(createError(403, "This action requires SuperAdmin privileges."));
  }
};

// Helper function to find the board for a given role ID
const getBoardFromRoleId = async (roleId) => {
    const role = await Role.findById(roleId);
    if (!role) return { error: createError(404, "Role not found.") };

    const team = await Team.findOne({ roles: roleId });
    if (!team) return { error: createError(404, `Data Integrity Error: The role '${role.title}' is not associated with any team.`) };
    return { board: team.board };
};

// Helper function to find the board for a given team ID
const getBoardFromTeamId = async (teamId) => {
    const team = await Team.findById(teamId);
    if (!team) return { error: createError(404, "Team not found.") };
    return { board: team.board };
};
    
// This is your original complex logic, which relies on verifyToken
export const verifyTeamAdmin = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const currentUser = await User.findById(req.user.id);
            if (!currentUser || (currentUser.role !== 'BoardAdmin' && currentUser.role !== 'SuperAdmin')) {
                return next(createError(403, "You are not authorized to perform this action."));
            }

            if (currentUser.role === 'SuperAdmin') {
                return next(); // SuperAdmins can do anything
            }
            
            let result;
            if (req.params.roleid) {
                result = await getBoardFromRoleId(req.params.roleid);
            } else if (req.params.id && req.baseUrl.includes('/roles')) {
                result = await getBoardFromRoleId(req.params.id);
            } else if (req.params.teamid) {
                result = await getBoardFromTeamId(req.params.teamid);
            } else if (req.params.id) {
                result = await getBoardFromTeamId(req.params.id);
            } else {
                return next();
            }

            if (result.error) {
                return next(result.error);
            }

            if (currentUser.adminOf !== result.board) {
                return next(createError(403, `You are not authorized to manage the ${result.board} board.`));
            }

            next();
        } catch (err) {
            next(err);
        }
    });
};