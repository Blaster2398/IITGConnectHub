import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.js";
// MODIFIED: verifyAdmin is now verifySuperAdmin for clarity and security.
import { verifySuperAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// UPDATE
router.put("/:id", verifyUser, updateUser);

// DELETE
router.delete("/:id", verifyUser, deleteUser);

// GET
router.get("/:id", verifyUser, getUser);

// GET ALL
// MODIFIED: This route is now correctly protected by verifySuperAdmin.
router.get("/", verifySuperAdmin, getUsers);

export default router;
