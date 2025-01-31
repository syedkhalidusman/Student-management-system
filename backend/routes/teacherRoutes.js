import express from "express";
import {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();

router.post("/",  createTeacher); // Add new teacher
router.get("/", getTeachers); // Get all teachers
router.get("/:id", getTeacherById); // Get teacher by ID
router.put("/:id", updateTeacher); // Update teacher by ID
router.delete("/:id", deleteTeacher); // Delete teacher by ID

export default router;
