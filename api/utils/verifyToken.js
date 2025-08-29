import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import Team from "../models/Team.js";
import Role from "../models/Role.js";
import User from "../models/User.js";

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


export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user; // user object now contains { id, role }
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, async () => {
    const currentUser = await User.findById(req.user.id);
    if (req.user.id === req.params.id || currentUser.role === 'SuperAdmin' || currentUser.role === 'BoardAdmin') {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// RENAMED from verifyAdmin for clarity. This specifically checks for the highest-level admin.
export const verifySuperAdmin = (req, res, next) => {
  verifyToken(req, res, async () => {
    const currentUser = await User.findById(req.user.id);
    if (currentUser && currentUser.role === 'SuperAdmin') {
      next();
    } else {
      return next(createError(403, "This action requires SuperAdmin privileges."));
    }
  });
};


// REFACTORED: This middleware is now cleaner and uses helper functions.
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
            } else if (req.params.id && req.baseUrl.includes('/roles')) { // e.g., /api/roles/increase/:id
                result = await getBoardFromRoleId(req.params.id);
            } else if (req.params.teamid) { // e.g., /api/roles/:teamid
                result = await getBoardFromTeamId(req.params.teamid);
            } else if (req.params.id) { // e.g., /api/teams/:id
                result = await getBoardFromTeamId(req.params.id);
            } else {
                 // For POST /api/teams, there are no params.
                 // The controller will handle authorization based on the request body.
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

