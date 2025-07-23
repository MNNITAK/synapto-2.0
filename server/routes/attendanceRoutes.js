import express from "express";
import { saveAttendance, getAttendance } from "../controllers/attendanceController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/attendance/mark → Mark or update attendance
router.post("/", protect, saveAttendance);
// GET /api/attendance → Get all attendance records for the logged-in user
router.get("/", protect, getAttendance);

export default router;