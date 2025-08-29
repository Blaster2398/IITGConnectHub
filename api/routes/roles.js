import express from "express";
import {
  createRole,
  deleteRole,
  getRoleApplicants,
  applyToRole,
  updateApplicationStatus,
  increaseOpenings,
  decreaseOpenings, // Import the new controller
} from "../controllers/role.js";
// MODIFIED: Import the new, more powerful verifyTeamAdmin middleware
import { verifyToken, verifyTeamAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
// Use verifyTeamAdmin to ensure only the correct admin can create a role for a team
router.post("/:teamid", verifyTeamAdmin, createRole);

// UPDATE
// Student applies to a role - requires only a valid token
router.put("/apply/:id", verifyToken, applyToRole);
// Admin updates an applicant's status - requires specific team admin rights
router.put("/status/:roleid/:userid", verifyTeamAdmin, updateApplicationStatus);
// Admin increases the number of openings for a role
router.put("/increase/:id", verifyTeamAdmin, increaseOpenings);
// NEW: Admin decreases the number of openings for a role
router.put("/decrease/:id", verifyTeamAdmin, decreaseOpenings);


// DELETE
router.delete("/:id/:teamid", verifyTeamAdmin, deleteRole);

// GET
// Only the correct admin should see the list of applicants
router.get("/:id/applicants", verifyTeamAdmin, getRoleApplicants);

export default router;
