import express from "express";
import { getKeys, updateKeys } from "../controllers/setting.js";
import { verifySuperAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// GET ALL KEYS (SuperAdmin only)
router.get("/", verifySuperAdmin, getKeys);

// UPDATE KEYS (SuperAdmin only)
router.put("/", verifySuperAdmin, updateKeys);

export default router;

