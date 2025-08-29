import express from "express";
import { getKeys, updateKeys } from "../controllers/setting.js";
import { verifyToken, verifySuperAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// GET ALL KEYS (SuperAdmin only)
router.get("/", verifyToken, verifySuperAdmin, getKeys);

// UPDATE KEYS (SuperAdmin only)
router.put("/", verifyToken, verifySuperAdmin, updateKeys);

export default router;