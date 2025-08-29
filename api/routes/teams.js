import express from "express";
import {
  countByCategory,
  countByBoard,
  createTeam,
  deleteTeam,
  getTeam,
  getTeamRoles,
  getTeams,
  updateTeam,
  getManagedTeams, // IMPORT NEW CONTROLLER
} from "../controllers/team.js";
import { verifyTeamAdmin, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// GET MANAGED TEAMS (for admin dashboard)
router.get("/admin/managed", verifyToken, getManagedTeams);

// CREATE
router.post("/", verifyTeamAdmin, createTeam);

// UPDATE
router.put("/:id", verifyTeamAdmin, updateTeam);

// DELETE
router.delete("/:id", verifyTeamAdmin, deleteTeam);

// GET
router.get("/find/:id", getTeam);

// GET ALL
router.get("/", getTeams);
router.get("/countByCategory", countByCategory);
router.get("/countByBoard", countByBoard);
router.get("/role/:id", getTeamRoles);

export default router;

